#!/usr/bin/env node
import readline from "readline";
import fs from "fs";
import path from "path";
import Conf from "conf";
import chalk from "chalk";
import ora from "ora";
import FormData from "form-data";
import fetch from "node-fetch";

// ── Config (persists between sessions) ───────────────────────────────────────
const config = new Conf({ projectName: "mam" });
const cfg = (k, d = "") => config.get(k, d);
const set = (k, v)       => config.set(k, v);

function getSettings() {
  return {
    url:   cfg("relay_url"),
    key:   cfg("relay_key"),
    model: cfg("relay_model", "gpt-4o"),
  };
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const c = {
  accent: chalk.hex("#7c6ff7"),
  dim:    chalk.gray,
  ok:     chalk.green,
  warn:   chalk.yellow,
  err:    chalk.red,
  img:    chalk.hex("#f0a500"),
};

// ── Network ───────────────────────────────────────────────────────────────────
async function ping(url) {
  const res = await fetch(`${url.replace(/\/$/, "")}/health`, {
    signal: AbortSignal.timeout(5000),
  });
  return (await res.json()).ok === true;
}

async function send(text, imageFile, history, s) {
  const base = s.url.replace(/\/$/, "");
  let response;

  if (imageFile) {
    const form = new FormData();
    form.append("image", fs.createReadStream(imageFile));
    form.append("data", JSON.stringify({ message: text, history, model: s.model }));
    response = await fetch(`${base}/chat`, {
      method: "POST",
      headers: { "x-api-key": s.key, ...form.getHeaders() },
      body: form,
    });
  } else {
    response = await fetch(`${base}/chat`, {
      method: "POST",
      headers: { "x-api-key": s.key, "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history, model: s.model }),
    });
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const ask = (rl, q) => new Promise(res => rl.question(q, res));

function printBanner() {
  console.log();
  console.log(c.accent.bold("  mam") + c.dim("  AI chat via Hetzner relay"));
  console.log();
}

function printHelp() {
  console.log(c.dim("  ────────────────────────────────────────────────"));
  console.log(chalk.bold("  Commands"));
  console.log(`  ${c.accent("/img <path>")}   attach image to next message`);
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
  const model  = c.dim(` (${s.model})`);
  process.stdout.write(c.accent("  mam") + imgTag + model + c.dim(" › "));
}

// ── Setup wizard (first run) ──────────────────────────────────────────────────
async function runSetup(rl) {
  console.log(c.accent("\n  First-time setup\n"));
  const url   = (await ask(rl, `  ${c.dim("Relay URL")}   e.g. http://1.2.3.4:3000 : `)).trim();
  const key   = (await ask(rl, `  ${c.dim("OpenAI key")}  sk-...                    : `)).trim();
  const model = (await ask(rl, `  ${c.dim("Model")}       [Enter for gpt-4o]        : `)).trim() || "gpt-4o";
  set("relay_url",   url);
  set("relay_key",   key);
  set("relay_model", model);
  console.log(c.ok("\n  ✓ Settings saved.\n"));
}

// ── /config ───────────────────────────────────────────────────────────────────
async function configCommand(rl) {
  const s = getSettings();
  console.log();
  console.log(`  ${c.dim("url")}    ${s.url   || c.warn("(not set)")}`);
  console.log(`  ${c.dim("key")}    ${s.key   ? "sk-…" + s.key.slice(-4) : c.warn("(not set)")}`);
  console.log(`  ${c.dim("model")}  ${s.model}`);
  console.log();
  const change = (await ask(rl, "  Update? (y/N): ")).trim().toLowerCase();
  if (change !== "y") return;
  const url   = (await ask(rl, `  New URL    [${s.url   || "blank"}]: `)).trim() || s.url;
  const key   = (await ask(rl, `  New key    [Enter to keep]: `)).trim()         || s.key;
  const model = (await ask(rl, `  New model  [${s.model}]: `)).trim()            || s.model;
  set("relay_url",   url);
  set("relay_key",   key);
  set("relay_model", model);
  console.log(c.ok("  ✓ Updated.\n"));
}

// ── /model ────────────────────────────────────────────────────────────────────
async function modelCommand(rl) {
  const models = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];
  console.log();
  models.forEach((m, i) => console.log(`  ${c.dim(`${i + 1}.`)} ${m}`));
  const n = parseInt((await ask(rl, "\n  Pick: ")).trim()) - 1;
  if (n >= 0 && n < models.length) {
    set("relay_model", models[n]);
    console.log(c.ok(`  ✓ Model → ${models[n]}\n`));
  } else {
    console.log(c.err("  Invalid.\n"));
  }
}

// ── Main REPL ─────────────────────────────────────────────────────────────────
async function main() {
  const rl = readline.createInterface({
    input: process.stdin, output: process.stdout, terminal: true,
  });

  rl.on("SIGINT", () => { console.log(c.dim("\n\n  bye.\n")); process.exit(0); });

  printBanner();

  const s = getSettings();
  if (!s.url || !s.key) await runSetup(rl);

  printHelp();

  let history      = [];
  let pendingImage = null;

  printPrompt(pendingImage);

  rl.on("line", async (line) => {
    const input = line.trim();
    if (!input) { printPrompt(pendingImage); return; }

    // ── Commands ───────────────────────────────────────────────────────────
    if (input === "/exit" || input === "/quit") {
      console.log(c.dim("\n  bye.\n")); process.exit(0);
    }

    if (input === "/help") {
      printHelp(); printPrompt(pendingImage); return;
    }

    if (input === "/clear") {
      history = [];
      console.log(c.ok("  ✓ History cleared.\n"));
      printPrompt(pendingImage); return;
    }

    if (input === "/config") {
      rl.pause(); await configCommand(rl); rl.resume();
      printPrompt(pendingImage); return;
    }

    if (input === "/model") {
      rl.pause(); await modelCommand(rl); rl.resume();
      printPrompt(pendingImage); return;
    }

    if (input === "/ping") {
      const spinner = ora({ text: c.dim("  pinging…"), color: "gray" }).start();
      try {
        const alive = await ping(getSettings().url);
        alive
          ? spinner.succeed(c.ok("  relay online\n"))
          : spinner.fail(c.err("  unreachable — check URL and firewall\n"));
      } catch (e) {
        spinner.fail(c.err(`  ${e.message}\n`));
      }
      printPrompt(pendingImage); return;
    }

    if (input.startsWith("/img ")) {
      const imgPath  = input.slice(5).trim().replace(/^["']|["']$/g, "");
      const resolved = path.resolve(imgPath);
      if (!fs.existsSync(resolved)) {
        console.log(c.err(`  File not found: ${resolved}\n`));
      } else {
        pendingImage = resolved;
        console.log(c.ok(`  ✓ Queued: ${path.basename(resolved)}`));
        console.log(c.dim("  Will be sent with your next message.\n"));
      }
      printPrompt(pendingImage); return;
    }

    if (input.startsWith("/")) {
      console.log(c.warn(`  Unknown command: ${input}\n`));
      printPrompt(pendingImage); return;
    }

    // ── Send ───────────────────────────────────────────────────────────────
    const settings = getSettings();
    if (!settings.url || !settings.key) {
      console.log(c.err("  Run /config to set relay URL and API key.\n"));
      printPrompt(pendingImage); return;
    }

    const imageToSend = pendingImage;
    pendingImage = null;
    history.push({ role: "user", content: input });

    const spinner = ora({ text: c.dim("  thinking…"), color: "gray" }).start();
    try {
      const data = await send(input, imageToSend, history.slice(0, -1), settings);
      spinner.stop();
      history.push({ role: "assistant", content: data.reply });
      console.log();
      console.log(c.accent("  ai") + c.dim(` (${data.model})`));
      data.reply.split("\n").forEach(l => console.log("  " + l));
      console.log();
    } catch (e) {
      spinner.fail(c.err(`  Error: ${e.message}\n`));
      history.pop();
    }

    printPrompt(pendingImage);
  });
}

main().catch(e => { console.error(chalk.red("Fatal: " + e.message)); process.exit(1); });
