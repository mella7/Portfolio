import express from "express";
import cors from "cors";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";

const app    = express();
const upload = multer({ dest: "/tmp/mam-uploads/" });

app.use(cors());
app.use(express.json({ limit: "20mb" }));

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ ok: true }));

// ── Chat (multipart — local file upload) ─────────────────────────────────────
app.post("/chat", upload.single("image"), async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return res.status(401).json({ error: "Missing x-api-key header" });

  let body;
  try {
    body = req.file ? JSON.parse(req.body.data) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { message, history = [], model = "gpt-4o", image_b64, image_mime } = body;
  if (!message) return res.status(400).json({ error: "Missing message" });

  const client   = new OpenAI({ apiKey });
  const messages = [
    {
      role: "system",
      content: "You are a concise, precise assistant. Reply as briefly as possible — no padding, no filler. Use markdown only when it genuinely helps clarity.",
    },
    ...history,
  ];

  // Image from multipart upload (local use)
  if (req.file) {
    const b64  = fs.readFileSync(req.file.path).toString("base64");
    const mime = req.file.mimetype || "image/jpeg";
    messages.push({
      role: "user",
      content: [
        { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
        { type: "text", text: message },
      ],
    });
    fs.unlinkSync(req.file.path);

  // Image as base64 string in JSON body (SSH use — no file transfer needed)
  } else if (image_b64) {
    const mime = image_mime || "image/png";
    messages.push({
      role: "user",
      content: [
        { type: "image_url", image_url: { url: `data:${mime};base64,${image_b64}` } },
        { type: "text", text: message },
      ],
    });

  } else {
    messages.push({ role: "user", content: message });
  }

  try {
    const completion = await client.chat.completions.create({ model, messages, max_tokens: 1024 });
    res.json({ reply: completion.choices[0].message.content, model: completion.model });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`mam-server running on :${PORT}`));
