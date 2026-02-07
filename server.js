import express from "express";
import cors from "cors";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const GAS_URL = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbw73NYBZBNN9i1ZZ0HA1Vr-LrpUASJ5JZ-qad85qSaPGJ2xlssd9lxTyXcmyp9mEtCJ/exec";

// ---- JSON body ----
app.use(express.json({ limit: "1mb" }));

// ---- CORS from ENV (API only) ----
const origins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

if (origins.length) {
  app.use("/api", cors({
    origin: origins,
    methods: ["POST"],
    allowedHeaders: ["Content-Type"]
  }));
}

app.get("/api/test-env", (req, res) => {
  // Only for testing — do NOT expose in production
  res.json(process.env);
});

// ---- API: place order ----
app.post("/api/place-order", async (req, res) => {
  const data = req.body;

  const required = ["name", "phone", "address", "products", "total"];
  for (const k of required) {
    if (!data?.[k]) return res.status(400).json({ error: "Missing field" });
  }

  try {
    const r = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      timeout: 10000
    });

    if (!r.ok) {
      const t = await r.text();
      console.log("GAS error:", r.status, t);
      return res.status(500).json({ error: "Sheet error" });
    }
  } catch (err) {
    console.log("GAS exception:", err);
    return res.status(500).json({ error: "Server error" });
  }

  res.json({ ok: true });
});


// ---- Static site with directory index support ----
app.use(async (req, res, next) => {
  const reqPath = decodeURIComponent(req.path);
  const fsPath = path.join(__dirname, reqPath);

  try {
    const stat = await import("fs/promises").then(fs => fs.stat(fsPath));

    if (stat.isFile()) return res.sendFile(fsPath);

    if (stat.isDirectory()) {
      const indexFile = path.join(fsPath, "index.html");
      return res.sendFile(indexFile);
    }
  } catch (_) {}

  return res.redirect("/");
});

// ---- Start server ----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
