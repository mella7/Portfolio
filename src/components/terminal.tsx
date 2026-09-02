"use client";

import type { ResumeData } from "@/data/types";
import { useCallback, useEffect, useRef, useState } from "react";

// An interactive shell on the homepage. Visitors can explore the CV by typing
// real commands - on-brand for a Kubernetes/DevSecOps engineer and far more
// memorable than another scroll-through page.
//
// Deliberately hydration-safe: the initial render is a fixed banner with no
// timestamps, no randomness and no browser-only APIs, so server and client
// markup match exactly. Everything dynamic happens after mount.

type Line = { kind: "in" | "out" | "err" | "sys"; text: string };

const PROMPT = "visitor@mella7.me:~$";

export function Terminal({
  data,
  strings,
}: {
  data: ResumeData;
  strings: {
    banner: string;
    hint: string;
    notFound: string;
    help: string;
    minimize: string;
  };
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, { desc: string; run: (args?: string) => string[] }> = {
    help: {
      desc: strings.help,
      run: () =>
        Object.entries(commands).map(
          ([name, cmd]) => `  ${name.padEnd(14)} ${cmd.desc}`
        ),
    },
    whoami: {
      desc: "who is this guy",
      run: () => [
        data.name,
        data.title,
        "",
        data.summary,
      ],
    },
    skills: {
      desc: "list technical skills",
      run: () =>
        data.skillCategories.flatMap((cat) => [
          `${cat.label}:`,
          `  ${cat.skills.join(", ")}`,
          "",
        ]),
    },
    projects: {
      desc: "list projects",
      run: () =>
        data.projects.flatMap((p) => [
          `${p.title}  (${p.dates})`,
          `  ${p.description}`,
          `  ${p.technologies.slice(0, 6).join(" · ")}`,
          p.href ? `  ${p.href}` : "",
          "",
        ]),
    },
    talks: {
      desc: "upcoming conference talks",
      run: () =>
        data.talks.flatMap((t) => [
          `${t.event} - ${t.location} (${t.date})`,
          `  "${t.talkTitle}"`,
          "",
        ]),
    },
    certs: {
      desc: "professional certifications",
      run: () => data.certifications.map((c) => `  [x] ${c.name}`),
    },
    awards: {
      desc: "awards and recognition",
      run: () =>
        data.awards.flatMap((a) => [`${a.period}  ${a.title}`, ""]),
    },
    contact: {
      desc: "how to reach me",
      run: () => [
        `email     ${data.email}`,
        `location  ${data.location}`,
        `github    ${data.social.github}`,
        `linkedin  ${data.social.linkedin}`,
      ],
    },
    resume: {
      desc: "open my resume (PDF)",
      run: () => {
        if (typeof window !== "undefined") {
          window.open("/resume/Resume_Mohamed_Ali_Mellah_EN.pdf", "_blank");
        }
        return ["Opening resume in a new tab..."];
      },
    },
    languages: {
      desc: "spoken languages",
      run: () => data.languages.map((l) => `  ${l.name.padEnd(10)} ${l.level}`),
    },
    ls: {
      desc: "list site sections",
      run: () => [
        "  projects/   blog/   talks/   certifications/",
      ],
    },
    // --- easter eggs, for the people who will actually get them ---
    "kubectl": {
      desc: "you know what this does",
      run: (args = "") => {
        if (args.includes("hire-me")) {
          return [
            "NAME                       READY   STATUS    RESTARTS   AGE",
            "available-for-hire-0        1/1     Running   0          1d",
            "work-permit-eu             1/1     Running   0          1d",
            "relocation-ready           1/1     Running   0          1d",
            "",
            `Contact the maintainer: ${data.email}`,
          ];
        }
        return [
          "NAME                          READY   STATUS      RESTARTS   AGE",
          "portfolio-frontend-7d4b        1/1     Running     0          42d",
          "falco-runtime-monitor-x9k2     1/1     Running     0          42d",
          "job-search-controller-1a7f     1/1     Running     97         3y",
          "sleep-deployment-0             0/1     Pending     0          42d",
          "",
          "tip: try 'kubectl get pods -n hire-me'",
        ];
      },
    },
    sudo: {
      desc: "nice try",
      run: () => [
        `${PROMPT.split(":")[0]} is not in the sudoers file.`,
        "This incident has been reported. 🙂",
      ],
    },
    neofetch: {
      desc: "system info",
      run: () => [
        `        ▄▄▄▄▄        ${data.firstName}@munich`,
        `      ▄█████████▄    ─────────────────────`,
        `     ██  ▀███▀  ██   Role     ${data.title.split("·")[0].trim()}`,
        `    ███   ███   ███  Location ${data.location}`,
        `     ██▄  ███  ▄██   Shell    zsh`,
        `      ▀█████████▀    Uptime   too many hours`,
        `        ▀▀▀▀▀        Coffee   ${"█".repeat(9)}░ 90%`,
      ],
    },
    clear: {
      desc: "clear the screen",
      run: () => [],
    },
  };

  const push = useCallback((newLines: Line[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  function execute(raw: string) {
    const trimmed = raw.trim();
    push([{ kind: "in", text: trimmed }]);
    if (!trimmed) return;

    setHistory((h) => [trimmed, ...h]);
    setHistoryIdx(-1);

    // Match on the first word so `kubectl get pods` still resolves.
    const name = trimmed.split(/\s+/)[0].toLowerCase();

    if (name === "clear") {
      setLines([]);
      return;
    }

    const cmd = commands[name];
    if (!cmd) {
      push([
        { kind: "err", text: `${strings.notFound}: ${name}` },
        { kind: "sys", text: strings.hint },
      ]);
      return;
    }

    const args = trimmed.slice(name.length).trim();
    push(cmd.run(args).map((text) => ({ kind: "out" as const, text })));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
      return;
    }

    // Tab completion across command names.
    if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;
      const match = Object.keys(commands).find((c) => c.startsWith(partial));
      if (match) setInput(match);
      return;
    }

    // Up/down through command history, like a real shell.
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      if (next >= 0 && history[next]) {
        setHistoryIdx(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIdx - 1;
      setHistoryIdx(next);
      setInput(next >= 0 && history[next] ? history[next] : "");
    }
  }

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-border bg-[#1e1e2e] shadow-lg font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#181825] border-b border-black/40">
        <span className="size-3 rounded-full bg-[#f38ba8]" />
        <span className="size-3 rounded-full bg-[#f9e2af]" />
        <span className="size-3 rounded-full bg-[#a6e3a1]" />
        <span className="ml-2 text-xs text-[#a6adc8] select-none">
          {PROMPT.replace("$", "")} - zsh
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto px-4 py-3 text-[#cdd6f4] scroll-smooth"
      >
        <p className="text-[#a6e3a1] whitespace-pre-wrap">{strings.banner}</p>
        <p className="text-[#6c7086] mb-2">{strings.hint}</p>

        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {line.kind === "in" && (
              <span>
                <span className="text-[#89b4fa]">{PROMPT}</span>{" "}
                <span className="text-[#cdd6f4]">{line.text}</span>
              </span>
            )}
            {line.kind === "out" && <span>{line.text || "\u00a0"}</span>}
            {line.kind === "err" && (
              <span className="text-[#f38ba8]">{line.text}</span>
            )}
            {line.kind === "sys" && (
              <span className="text-[#6c7086]">{line.text}</span>
            )}
          </div>
        ))}

        {/* live prompt */}
        <div className="flex items-center gap-2">
          <span className="text-[#89b4fa] shrink-0">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
            className="flex-1 bg-transparent outline-none text-[#cdd6f4] caret-[#a6e3a1] min-w-0"
          />
        </div>
      </div>
    </div>
  );
}
