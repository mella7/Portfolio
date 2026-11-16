#!/usr/bin/env node
// Helps connect the Telegram bot.   npm run telegram
//
//   1. Put TELEGRAM_BOT_TOKEN in .env (the token @BotFather gave you).
//   2. Open your bot in Telegram and send it any message, for example /start.
//   3. Run this script. It prints the chat id to put in TELEGRAM_CHAT_ID.
//   4. Run it again with TELEGRAM_CHAT_ID set to receive a test message.

import { loadEnv } from "./env.mjs";
import { sendTelegram, telegramConfig } from "./notify.mjs";

loadEnv();
const token = process.env.TELEGRAM_BOT_TOKEN || "";
if (!/^\d+:[\w-]{20,}$/.test(token)) {
  console.error("TELEGRAM_BOT_TOKEN is missing or does not look like a bot token. Add it to .env first.");
  process.exit(1);
}

const config = telegramConfig();
if (config) {
  const ok = await sendTelegram(config, "Test message from your portfolio's statistics server. The connection works.");
  console.log(ok ? "Test message sent. Check Telegram." : "The message was not accepted. Check TELEGRAM_CHAT_ID.");
  process.exit(ok ? 0 : 1);
}

const api = (process.env.TELEGRAM_API_BASE || "https://api.telegram.org").replace(/\/+$/, "");
try {
  const response = await fetch(`${api}/bot${token}/getUpdates`, { signal: AbortSignal.timeout(10_000) });
  const data = await response.json();
  if (!data.ok) throw new Error(data.description || `HTTP ${response.status}`);
  const chats = new Map();
  for (const update of data.result) {
    const chat = (update.message || update.channel_post || update.my_chat_member)?.chat;
    if (chat) chats.set(chat.id, chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(" ") || chat.username || "");
  }
  if (!chats.size) {
    console.log("No messages yet. Open your bot in Telegram, send it /start, then run this again.");
  } else {
    console.log("Chats that have written to the bot:\n");
    for (const [id, name] of chats) console.log(`  TELEGRAM_CHAT_ID=${id}    (${name})`);
    console.log("\nCopy your line into .env, then run this script again for a test message.");
  }
} catch (error) {
  console.error(`Could not ask Telegram: ${error.message}`);
  process.exit(1);
}
