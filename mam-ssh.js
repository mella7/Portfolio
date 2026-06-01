#!/usr/bin/env node
// mam-ssh.js — same as mam.js but sends images as base64 in JSON body.
// Use this when running mam directly on the Hetzner server via SSH.
// Images must be uploaded to the server first (scp / sftp), then referenced by path.
import readline from "readline";
import fs from "fs";
import path from "path";
import Conf from "conf";
import chalk from "chalk";
import ora from "ora";
import fetch from "node-fetch";

const config = new Conf({ projectName: "mam" }); // shares config with mam.js
const cfg = (k, d = "") => config.get(k, d);
const set = (k, v)       => config.set(k, v);

function getSettings() {
  return {
    url:   cfg("relay_url"),
    key:   cfg("relay_key"),
    model: cfg("relay_model", "gpt-4o"),
  };
}

const c = {
  accent: chalk.hex("#7c6ff7"),
  dim:    chalk.gray,
  ok:     chalk.green,
  warn:   chalk.yellow,
  err:    chalk.red,
  img:    chalk.hex("#f0a500"),
};

async function ping(url) {
  const res = await fetch(`${url.replace(/\/$/, "")}/health`, { signal: AbortSignal.timeout(5000) });
  return (await res.json()).ok === true;
}

async function send(text, imageFile, history, s) {
  const base = s.url.replace(/\/$/, "");
  const body = { message: text, history, model: s.model };

  if (imageFile) {
    const buf  = fs.readFileSync(imageFile);
    const ext  = path.extname(imageFile).toLowerCase();
    const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
               : ext === ".gif"  ? "image/gif"
               : ext === ".webp" ? "image/webp"
               : "image/png";
    body.image_b64  = buf.toString("base64");
    body.image_mime = mime;
  }

  const response = await fetch(`${base}/chat`, {
    method: "POST",
    headers: { "x-api-key": s.key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

const ask = (rl, q) => new Promise(res => rl.question(q, res));

function printBanner() {
  console.log();
  console.log(c.accent.bold("  mam") + c.dim("  [ssh mode] — AI chat via local relay"));
  console.log();
}

function printHelp() {
  console.log(c.dim("  ────────────────────────────────────────────────"));
  console.log(chalk.bold("  Commands"));
  console.log(`  ${c.accent("/img <path>")}   attach image (server-side path)`);
  console.log(`  ${c.accent("/model")}        switch model`);
  console.log(`  ${c.accent("/clear")}        clear conversation history`);
  console.log(`  ${c.accent("/ping")}         test relay connection`);
  console.log(`  ${c.accent("/config")}       view / update settings`);
  console.log(`  ${c.accent("/help")}         this screen`);
  console.log(`  ${c.accent("/exit")}         quit`);
  console.log(c.dim("  ────────────────────────────────────────────────\n"));
}

function printPrompt(pendingImage) {
  const s      = getSettings();
  const imgTag = pendingImage ? c.img(` [img: ${path.basename(pendingImage)}]`) : "";
  process.stdout.write(c.accent("  mam") + imgTag + c.dim(` (${s.model}) › `));
}

async function runSetup(rl) {
  console.log(c.accent("\n  First-time setup\n"));
  const url   = (await ask(rl, `  ${c.dim("Relay URL")}   [default: http://localhost:3000] : `)).trim() || "http://localhost:3000";
  const key   = (await ask(rl, `  ${c.dim("OpenAI key")}  sk-...                           : `)).trim();
  const model = (await ask(rl, `  ${c.dim("Model")}       [Enter for gpt-4o]               : `)).trim() || "gpt-4o";
  set("relay_url",   url);
  set("relay_key",   key);
  set("relay_model", model);
  console.log(c.ok("\n  ✓ Settings saved.\n"));
}

async function configCommand(rl) {
  const s = getSettings();
  console.log();
  console.log(`  ${c.dim("url")}    ${s.url   || c.warn("(not set)")}`);
  console.log(`  ${c.dim("key")}    ${s.key   ? "sk-…" + s.key.slice(-4) : c.warn("(not set)")}`);
  console.log(`  ${c.dim("model")}  ${s.model}`);
  console.log();
  const change = (await ask(rl, "  Update? (y/N): ")).trim().toLowerCase();
  if (change !== "y") return;
  const url   = (await ask(rl, `  New URL    [${s.url}]: `)).trim()   || s.url;
  const key   = (await ask(rl, `  New key    [Enter to keep]: `)).trim() || s.key;
  const model = (await ask(rl, `  New model  [${s.model}]: `)).trim() || s.model;
  set("relay_url", url); set("relay_key", key); set("relay_model", model);
  console.log(c.ok("  ✓ Updated.\n"));
}

async function modelCommand(rl) {
  const models = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];
  console.log();
  models.forEach((m, i) => console.log(`  ${c.dim(`${i + 1}.`)} ${m}`));
  const n = parseInt((await ask(rl, "\n  Pick: ")).trim()) - 1;
  if (n >= 0 && n < models.length) { set("relay_model", models[n]); console.log(c.ok(`  ✓ Model → ${models[n]}\n`)); }
  else console.log(c.err("  Invalid.\n"));
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  rl.on("SIGINT", () => { console.log(c.dim("\n\n  bye.\n")); process.exit(0); });

  printBanner();
  const s = getSettings();
  if (!s.url || !s.key) await runSetup(rl);
  printHelp();

  let history = [], pendingImage = null;
  printPrompt(pendingImage);

  rl.on("line", async (line) => {
    const input = line.trim();
    if (!input) { printPrompt(pendingImage); return; }

    if (input === "/exit" || input === "/quit") { console.log(c.dim("\n  bye.\n")); process.exit(0); }
    if (input === "/help")  { printHelp(); printPrompt(pendingImage); return; }
    if (input === "/clear") { history = []; console.log(c.ok("  ✓ Cleared.\n")); printPrompt(pendingImage); return; }

    if (input === "/config") { rl.pause(); await configCommand(rl); rl.resume(); printPrompt(pendingImage); return; }
    if (input === "/model")  { rl.pause(); await modelCommand(rl);  rl.resume(); printPrompt(pendingImage); return; }

    if (input === "/ping") {
      const sp = ora({ text: c.dim("  pinging…"), color: "gray" }).start();
      try {
        (await ping(getSettings().url))
          ? sp.succeed(c.ok("  relay online\n"))
          : sp.fail(c.err("  unreachable\n"));
      } catch (e) { sp.fail(c.err(`  ${e.message}\n`)); }
      printPrompt(pendingImage); return;
    }

    if (input.startsWith("/img ")) {
      const resolved = path.resolve(input.slice(5).trim().replace(/^["']|["']$/g, ""));
      if (!fs.existsSync(resolved)) {
        console.log(c.err(`  File not found: ${resolved}\n`));
      } else {
        pendingImage = resolved;
        console.log(c.ok(`  ✓ Queued: ${path.basename(resolved)}`));
        console.log(c.dim("  Will be sent with your next message.\n"));
      }
      printPrompt(pendingImage); return;
    }

    if (input.startsWith("/")) { console.log(c.warn(`  Unknown: ${input}\n`)); printPrompt(pendingImage); return; }

    const settings = getSettings();
    if (!settings.url || !settings.key) { console.log(c.err("  Run /config first.\n")); printPrompt(pendingImage); return; }

    const imageToSend = pendingImage;
    pendingImage = null;
    history.push({ role: "user", content: input });

    const sp = ora({ text: c.dim("  thinking…"), color: "gray" }).start();
    try {
      const data = await send(input, imageToSend, history.slice(0, -1), settings);
      sp.stop();
      history.push({ role: "assistant", content: data.reply });
      console.log();
      console.log(c.accent("  ai") + c.dim(` (${data.model})`));
      data.reply.split("\n").forEach(l => console.log("  " + l));
      console.log();
    } catch (e) {
      sp.fail(c.err(`  Error: ${e.message}\n`));
      history.pop();
    }
    printPrompt(pendingImage);
  });
}

main().catch(e => { console.error(chalk.red("Fatal: " + e.message)); process.exit(1); });
