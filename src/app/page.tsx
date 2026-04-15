"use client";

import { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FateResult {
  story: string;
  survivalProbability: number;
  lifeExpectancyDays: number;
  causeOfDeath: string;
  historicalContext: string;
  year: number;
  profession: string;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: "2px",
        height: "2px",
        background: "rgba(139,0,0,0.6)",
        ...style,
      }}
    />
  );
}

function FloatingParticles() {
  const [particles, setParticles] = useState<
    { id: number; left: string; top: string; size: number; opacity: number; animationDuration: string; animationDelay: string }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${4 + Math.random() * 8}s`,
        opacity: 0.15 + Math.random() * 0.4,
        size: 1 + Math.random() * 3,
      }))
    );
  }, []);

  return (
    <div className="bg-particles">
      {particles.map((p) => (
        <Particle
          key={p.id}
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float ${p.animationDuration} ease-in-out ${p.animationDelay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

function SkullDivider() {
  return (
    <div className="divider-ornate my-8 text-sm select-none">
      <span>☠</span>
    </div>
  );
}

function SurvivalMeter({ probability }: { probability: number }) {
  // Colour: red → amber → green (but we cap green at ~30% because survival is rare)
  const hue = Math.round((probability / 100) * 60); // 0 = dark red, 60 = amber
  const color = `hsl(${hue}, 85%, 42%)`;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center font-cinzel text-xs tracking-widest uppercase">
        <span style={{ color: "rgba(200,185,165,0.6)" }}>Survival Probability</span>
        <span
          className="text-2xl font-black animate-glow-red"
          style={{
            color,
            textShadow: `0 0 20px ${color}`,
            fontFamily: "'Cinzel', serif",
          }}
        >
          {probability}%
        </span>
      </div>
      <div className="survival-meter">
        <div
          className="survival-meter-fill"
          style={{
            width: `${probability}%`,
            background: `linear-gradient(90deg, #4a0000, ${color})`,
          }}
        />
      </div>
      <p className="text-xs text-center font-inter" style={{ color: "rgba(200,185,165,0.4)" }}>
        {probability < 5
          ? "You're basically already dead."
          : probability < 15
          ? "A miracle is your only hope."
          : probability < 30
          ? "Slim, but not impossible. Probably impossible."
          : probability < 50
          ? "Against all odds, perhaps."
          : "Suspiciously optimistic."}
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
}: {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div
      className="glass-dark rounded-lg p-4 text-center space-y-1"
      style={{ border: "1px solid rgba(139,0,0,0.25)" }}
    >
      <div className="text-2xl">{icon}</div>
      <div
        className="text-xs uppercase tracking-widest font-cinzel"
        style={{ color: "rgba(200,185,165,0.5)" }}
      >
        {label}
      </div>
      <div
        className="font-cinzel font-bold text-lg"
        style={{ color: "#cc3333" }}
      >
        {value}
      </div>
      {subValue && (
        <div className="text-xs font-crimson italic" style={{ color: "rgba(200,185,165,0.5)" }}>
          {subValue}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  const messages = [
    "Consulting the Grim Reaper…",
    "Rifling through historical obituaries…",
    "Calculating your numerous risk factors…",
    "Preparing your epitaph…",
    "Consulting the Black Death's schedule…",
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-dark rounded-2xl p-12 text-center space-y-8 animate-fade-in-up">
      {/* Spinning skull */}
      <div className="relative flex items-center justify-center">
        <div
          className="animate-spin-slow absolute"
          style={{
            width: "120px",
            height: "120px",
            border: "1px solid rgba(139,0,0,0.3)",
            borderRadius: "50%",
            borderTopColor: "rgba(139,0,0,0.8)",
          }}
        />
        <div className="animate-skull-bob text-7xl" style={{ filter: "drop-shadow(0 0 20px rgba(139,0,0,0.8))" }}>
          💀
        </div>
      </div>

      {/* Loading dots */}
      <div className="flex justify-center gap-3">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>

      <p
        className="font-cinzel text-sm tracking-widest uppercase animate-flicker"
        style={{ color: "rgba(200,185,165,0.7)", minHeight: "1.5rem" }}
      >
        {messages[msgIdx]}
      </p>
    </div>
  );
}

function ResultPanel({ result }: { result: FateResult }) {
  const paragraphs = result.story.split(/\n+/).filter((p) => p.trim().length > 0);

  const formatDays = (days: number) => {
    if (days < 1) return "Less than a day";
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""}`;
    if (days < 30) return `${Math.round(days / 7)} week${Math.round(days / 7) !== 1 ? "s" : ""}`;
    if (days < 365) return `${Math.round(days / 30)} month${Math.round(days / 30) !== 1 ? "s" : ""}`;
    return `${(days / 365).toFixed(1)} year${(days / 365).toFixed(1) !== "1.0" ? "s" : ""}`;
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <div
          className="inline-block font-cinzel text-xs tracking-[0.3em] uppercase px-4 py-1 rounded"
          style={{
            background: "rgba(139,0,0,0.2)",
            border: "1px solid rgba(139,0,0,0.4)",
            color: "#cc4444",
          }}
        >
          Verdict Delivered
        </div>
        <h2
          className="font-cinzel text-3xl md:text-4xl font-black"
          style={{
            color: "#e8dcc8",
            textShadow: "0 0 30px rgba(139,0,0,0.5)",
          }}
        >
          Your Fate in{" "}
          <span style={{ color: "#cc3333" }}>
            {result.year > 0 ? result.year + " CE" : Math.abs(result.year) + " BCE"}
          </span>
        </h2>
        <p className="font-crimson text-lg italic" style={{ color: "rgba(200,185,165,0.6)" }}>
          as a <span style={{ color: "#c9b99a" }}>{result.profession}</span>
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon="⏳"
          label="Life Expectancy"
          value={formatDays(result.lifeExpectancyDays)}
          subValue="from arrival"
        />
        <StatCard
          icon="☠️"
          label="Cause of Death"
          value={result.causeOfDeath}
        />
        <StatCard
          icon="🎲"
          label="Survival Chance"
          value={`${result.survivalProbability}%`}
          subValue="(statistically tragic)"
        />
      </div>

      {/* Survival meter */}
      <div className="glass-dark rounded-xl p-6" style={{ border: "1px solid rgba(139,0,0,0.25)" }}>
        <SurvivalMeter probability={result.survivalProbability} />
      </div>

      <SkullDivider />

      {/* Story */}
      <div className="glass-dark rounded-2xl p-8 space-y-5">
        <h3
          className="font-cinzel text-lg tracking-widest uppercase text-center"
          style={{ color: "#993333" }}
        >
          ✦ The Chronicle of Your Demise ✦
        </h3>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="story-text" style={{ animationDelay: `${i * 0.1}s` }}>
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Historical context */}
      {result.historicalContext && (
        <details className="group">
          <summary
            className="cursor-pointer font-cinzel text-xs tracking-widest uppercase select-none flex items-center gap-2"
            style={{ color: "rgba(200,185,165,0.45)" }}
          >
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            Historical Source Data (Wikipedia)
          </summary>
          <div
            className="mt-3 p-4 rounded-lg font-inter text-xs leading-relaxed"
            style={{
              background: "rgba(10,5,5,0.6)",
              border: "1px solid rgba(139,0,0,0.15)",
              color: "rgba(200,185,165,0.45)",
            }}
          >
            {result.historicalContext}
          </div>
        </details>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [year, setYear] = useState("");
  const [profession, setProfession] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!year.trim() || !profession.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/fate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: parseInt(year, 10), profession: profession.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setResult(data);
    } catch {
      setError("Failed to contact the oracle. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // Scroll to result when it arrives
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [result]);

  const exampleProfessions = ["Software Engineer", "Social Media Influencer", "Barista", "UX Designer", "Data Scientist"];
  const exampleYears = ["1347", "79", "1665", "1918", "1789"];

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <FloatingParticles />

      {/* Background gradient layers */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(80,0,0,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(40,0,0,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 space-y-16">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="text-center space-y-6 animate-fade-in-down">
          {/* Skull icon */}
          <div className="flex justify-center">
            <div
              className="animate-float text-8xl select-none"
              style={{
                filter:
                  "drop-shadow(0 0 30px rgba(139,0,0,0.9)) drop-shadow(0 0 60px rgba(100,0,0,0.5))",
              }}
              aria-hidden="true"
            >
              💀
            </div>
          </div>

          <div className="space-y-3">
            <p
              className="font-inter text-xs tracking-[0.4em] uppercase"
              style={{ color: "rgba(139,0,0,0.9)" }}
            >
              — A Morbid Historical Reckoning —
            </p>
            <h1
              className="font-cinzel font-black text-5xl md:text-7xl leading-none"
              style={{
                color: "#e8dcc8",
                textShadow:
                  "0 0 40px rgba(139,0,0,0.6), 0 2px 30px rgba(0,0,0,0.9)",
              }}
            >
              Will I
              <br />
              <span
                className="animate-glow-red"
                style={{ color: "#cc2222" }}
              >
                Survive
              </span>
              <br />
              This?
            </h1>
          </div>

          <p
            className="font-crimson text-xl italic max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(200,185,165,0.65)" }}
          >
            Enter a year from history and your modern profession. Discover, in
            gloriously morbid detail, exactly how swiftly you would have perished.
          </p>

          <SkullDivider />
        </header>

        {/* ── Form ─────────────────────────────────────────────── */}
        <section aria-label="Fate calculator form" className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div
            className="glass-dark rounded-2xl p-8 md:p-10 space-y-8"
            style={{
              boxShadow:
                "0 0 80px rgba(139,0,0,0.15), 0 4px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" id="fate-form">
              {/* Year */}
              <div className="space-y-2">
                <label
                  htmlFor="historical-year"
                  className="block font-cinzel text-xs tracking-[0.25em] uppercase"
                  style={{ color: "rgba(200,185,165,0.7)" }}
                >
                  ☩ Historical Year
                </label>
                <input
                  id="historical-year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 1347 (Black Death), 79 (Pompeii), 1918…"
                  min="-3000"
                  max="2024"
                  required
                  disabled={loading}
                  className="dark-input w-full rounded-lg px-5 py-4"
                  aria-describedby="year-hint"
                />
                <div id="year-hint" className="flex flex-wrap gap-2 pt-1">
                  {exampleYears.map((y) => (
                    <button
                      type="button"
                      key={y}
                      onClick={() => setYear(y)}
                      disabled={loading}
                      className="font-inter text-xs px-2 py-1 rounded transition-all hover:scale-105"
                      style={{
                        background: "rgba(139,0,0,0.15)",
                        border: "1px solid rgba(139,0,0,0.3)",
                        color: "rgba(200,185,165,0.55)",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profession */}
              <div className="space-y-2">
                <label
                  htmlFor="modern-profession"
                  className="block font-cinzel text-xs tracking-[0.25em] uppercase"
                  style={{ color: "rgba(200,185,165,0.7)" }}
                >
                  ⚰ Your Modern Profession
                </label>
                <input
                  id="modern-profession"
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Software Engineer, Barista, UX Designer…"
                  maxLength={80}
                  required
                  disabled={loading}
                  className="dark-input w-full rounded-lg px-5 py-4"
                  aria-describedby="profession-hint"
                />
                <div id="profession-hint" className="flex flex-wrap gap-2 pt-1">
                  {exampleProfessions.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setProfession(p)}
                      disabled={loading}
                      className="font-inter text-xs px-2 py-1 rounded transition-all hover:scale-105"
                      style={{
                        background: "rgba(139,0,0,0.15)",
                        border: "1px solid rgba(139,0,0,0.3)",
                        color: "rgba(200,185,165,0.55)",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="calculate-fate-btn"
                disabled={loading || !year || !profession}
                className="btn-fate w-full rounded-xl py-5 text-base font-bold tracking-widest"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="animate-spin text-lg">⚙</span>
                    Consulting The Abyss…
                  </span>
                ) : (
                  "⚔ Calculate My Fate"
                )}
              </button>
            </form>
          </div>
        </section>

        {/* ── Error ────────────────────────────────────────────── */}
        {error && (
          <div
            className="glass-dark rounded-xl p-6 text-center space-y-2 animate-fade-in-up"
            style={{ borderColor: "rgba(180,0,0,0.5)" }}
            role="alert"
          >
            <div className="text-3xl">⚠</div>
            <p className="font-cinzel text-sm tracking-wider uppercase" style={{ color: "#cc4444" }}>
              The Oracle Speaks of Failure
            </p>
            <p className="font-crimson text-base italic" style={{ color: "rgba(200,185,165,0.7)" }}>
              {error}
            </p>
          </div>
        )}

        {/* ── Loading ───────────────────────────────────────────── */}
        {loading && <LoadingState />}

        {/* ── Result ───────────────────────────────────────────── */}
        {result && !loading && (
          <div ref={resultRef}>
            <ResultPanel result={result} />
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="text-center space-y-3 pb-8">
          <SkullDivider />
          <p
            className="font-inter text-xs"
            style={{ color: "rgba(200,185,165,0.25)" }}
          >
            Historical data sourced from Wikipedia · Story generated by GPT-4o-mini
            <br />
            For morbid entertainment purposes only · No actual fatalities recorded
          </p>
          <p
            className="font-cinzel text-xs tracking-widest uppercase"
            style={{ color: "rgba(139,0,0,0.4)" }}
          >
            Memento Mori
          </p>
        </footer>
      </div>
    </main>
  );
}
