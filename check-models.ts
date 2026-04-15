import fs from "fs";

const envStr = fs.readFileSync(".env.local", "utf8");
const match = envStr.match(/GEMINI_API_KEY=(.*)/);
const key = match ? match[1].trim() : "";

async function checkModels() {
  if (!key) {
    console.error("No key found");
    return;
  }
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + key);
    const data = await response.json();
    if (data.models) {
      console.log(data.models.map((m: any) => m.name));
    } else {
      console.log("Error:", data);
    }
  } catch (err) {
    console.error(err);
  }
}

checkModels();
