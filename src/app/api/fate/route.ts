import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Wikipedia helpers ─────────────────────────────────────────────────────────

async function fetchWikipediaEvents(year: number): Promise<string[]> {
  const events: string[] = [];

  // Wikipedia "On this day" / year article approach
  const articleTitle = year < 0 ? `${Math.abs(year)}_BC` : String(year);
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${articleTitle}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "WillISurviveThis/1.0 (educational app)" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.extract) {
        // Pull the first 800 chars as a summary snippet
        events.push(data.extract.slice(0, 800));
      }
    }
  } catch {
    // silent — fall through to search
  }

  // Also fetch the Wikipedia search API for key events of that year
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    `events of the year ${year}`
  )}&srlimit=5&format=json&origin=*`;

  try {
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "WillISurviveThis/1.0 (educational app)" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      const results = data?.query?.search ?? [];
      for (const r of results.slice(0, 3)) {
        events.push(r.snippet.replace(/<[^>]+>/g, "").trim());
      }
    }
  } catch {
    // silent
  }

  return events.length > 0
    ? events
    : [`The year ${year} — a time shrouded in fog and historical ambiguity.`];
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { year, profession } = await request.json();

    if (!year || !profession) {
      return Response.json(
        { error: "Year and profession are required." },
        { status: 400 }
      );
    }

    const parsedYear = parseInt(String(year), 10);
    if (isNaN(parsedYear) || parsedYear < -3000 || parsedYear > 2024) {
      return Response.json(
        { error: "Year must be between 3000 BC and 2024." },
        { status: 400 }
      );
    }

    // 1. Fetch historical context from Wikipedia
    const historicalEvents = await fetchWikipediaEvents(parsedYear);
    const context = historicalEvents.join("\n\n");

    // 2. Call the LLM
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is not configured. Add GEMINI_API_KEY to .env.local." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt = `You are "The Chronicler of Doom" — a darkly comedic, historically knowledgeable narrator who specialises in telling modern people exactly how they would perish in historical eras. Your tone is morbid, sarcastic, darkly funny, and dramatically theatrical. You have encyclopaedic knowledge of historical diseases, warfare, social conditions, and occupational hazards. You never sugarcoat death. You revel in grim details. You speak directly to the person ("you would..."). Think Blackadder meets a plague doctor.`;

    const userPrompt = `A modern "${profession}" wants to know if they would survive the year ${parsedYear > 0 ? parsedYear + " CE" : Math.abs(parsedYear) + " BCE"}.

Historical context retrieved from Wikipedia:
---
${context}
---

Write a darkly morbid, sarcastic, highly detailed narrative (4–6 paragraphs) about exactly how and how quickly this person would die — or, in the extremely unlikely event they might survive briefly, how miserable their life would be before they inevitably died. Reference specific historical events, diseases, social conditions, and hazards of the era. Be specific about their profession's uselessness or peculiar danger in that time. End with a one-sentence epitaph for their tombstone.

After the story, on a new line output EXACTLY this JSON block (no markdown, no extra text around it):
{"survivalProbability": <number 0-100>, "lifeExpectancyDays": <number>, "causeOfDeath": "<short string>"}

The survivalProbability should be a realistic (usually very low) percentage chance they survive more than one year. Be creative and cruel with the cause of death string.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    const completion = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 1200, temperature: 0.9 }
    });

    const rawText = completion.response.text();

    // Parse out the JSON block from the end
    const jsonMatch = rawText.match(/\{[\s\S]*"survivalProbability"[\s\S]*\}/);
    let survivalProbability = 3;
    let lifeExpectancyDays = 14;
    let causeOfDeath = "Something unspeakably unpleasant";

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        survivalProbability = Math.min(100, Math.max(0, Number(parsed.survivalProbability) || 3));
        lifeExpectancyDays = Math.max(1, Number(parsed.lifeExpectancyDays) || 14);
        causeOfDeath = String(parsed.causeOfDeath || causeOfDeath);
      } catch {
        // use defaults
      }
    }

    // Story is everything before the JSON block
    const story = rawText.replace(/\{[\s\S]*"survivalProbability"[\s\S]*\}/, "").trim();

    return Response.json({
      story,
      survivalProbability,
      lifeExpectancyDays,
      causeOfDeath,
      historicalContext: context.slice(0, 400),
      year: parsedYear,
      profession,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred.";
    return Response.json({ error: message }, { status: 500 });
  }
}
