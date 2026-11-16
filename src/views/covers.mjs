// Project cover art: small schematic diagrams drawn as inline SVG, so they
// follow the accent colour and need no image files. Each one only shows what
// the project description says the project does.

import { html, raw } from "../lib/html.mjs";

const box = (x, y, w, h, label, accent = false) =>
  `<rect class="cv-box${accent ? " cv-box--a" : ""}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>` +
  `<text class="cv-text${accent ? " cv-text--a" : ""}" x="${x + w / 2}" y="${y + h / 2 + 3.5}" text-anchor="middle">${label}</text>`;

const line = (d, accent = false, dashed = false) =>
  `<path class="cv-line${accent ? " cv-line--a" : ""}${dashed ? " cv-line--dash" : ""}" d="${d}"/>`;

const note = (x, y, label, anchor = "start") => `<text class="cv-note" x="${x}" y="${y}" text-anchor="${anchor}">${label}</text>`;

const ART = {
  // project-claim: one claim in, a governed namespace (quota, RBAC, isolation) out.
  operator: () =>
    box(22, 92, 104, 40, "ProjectClaim CR", true) +
    line("M126 112H160", true) +
    `<circle class="cv-ring" cx="200" cy="112" r="38"/>` +
    `<path class="cv-line cv-line--a cv-spin" d="M200 74a38 38 0 0 1 38 38M200 150a38 38 0 0 1-38-38"/>` +
    `<path class="cv-head" d="m238 112-5-8h10zM162 112l5 8h-10z"/>` +
    `<text class="cv-text" x="200" y="109" text-anchor="middle">reconcile</text>` +
    `<text class="cv-note" x="200" y="122" text-anchor="middle">loop</text>` +
    line("M240 112H262M262 52V172M262 52H276M262 112H276M262 172H276") +
    box(276, 36, 104, 32, "quota") +
    box(276, 96, 104, 32, "RBAC") +
    box(276, 156, 104, 32, "network isolation") +
    note(22, 30, "one claim in") +
    note(380, 206, "one governed namespace out", "end") +
    note(22, 206, "OpenShift / K8s"),

  // container-networking-from-scratch: namespaces, veth pairs, a bridge, NAT.
  networking: () =>
    box(40, 26, 120, 44, "netns blue", true) +
    box(240, 26, 120, 44, "netns red", true) +
    line("M100 70V112M300 70V112", true, true) +
    note(108, 95, "veth") +
    note(308, 95, "veth") +
    box(60, 112, 280, 28, "bridge br0") +
    line("M200 140V160") +
    box(130, 160, 140, 28, "iptables NAT") +
    line("M200 188V204") +
    note(200, 216, "host network", "middle") +
    note(360, 216, "14 tests passed", "end"),

  // cloudstack-dc: a canvas becomes Terraform, applied to a 4-node cluster.
  datacenter: () =>
    `<rect class="cv-box" x="22" y="34" width="150" height="124" rx="3"/>` +
    note(30, 48, "canvas") +
    box(38, 62, 46, 24, "zone", true) +
    box(108, 62, 46, 24, "pod") +
    box(72, 116, 60, 24, "cluster") +
    line("M84 74H108M131 86 110 116M61 86 92 116", false, true) +
    line("M172 96H232", true) +
    `<path class="cv-head" d="m236 96-8-5v10z"/>` +
    note(202, 88, "Terraform", "middle") +
    box(244, 34, 62, 50, "node 1") +
    box(318, 34, 62, 50, "node 2") +
    box(244, 108, 62, 50, "node 3") +
    box(318, 108, 62, 50, "node 4") +
    note(22, 190, "SSE log stream") +
    note(22, 206, "VNC console") +
    note(380, 206, "CloudStack", "end"),

  // KubeAudit: audit a cluster, ship the findings through the ELK stack.
  audit: () =>
    box(22, 30, 96, 40, "cluster") +
    line("M118 50H150", true) +
    `<path class="cv-head" d="m154 50-8-5v10z"/>` +
    box(156, 30, 110, 40, "KubeAudit (Go)", true) +
    line("M266 50H296") +
    box(296, 30, 84, 40, "findings") +
    line("M338 70V104", false, true) +
    box(22, 104, 104, 34, "Logstash") +
    box(148, 104, 104, 34, "Elasticsearch") +
    box(276, 104, 104, 34, "Kibana") +
    line("M276 121H252M148 121H126", false, true) +
    note(22, 176, "best practices") +
    note(22, 192, "compliance checks") +
    note(380, 192, "report", "end"),

  // DevSecOps Security Suite: checks at each stage of delivery.
  pipeline: () =>
    box(22, 40, 76, 34, "commit") +
    box(118, 40, 76, 34, "SAST", true) +
    box(214, 40, 76, 34, "image scan", true) +
    box(310, 40, 70, 34, "deploy") +
    line("M98 57H118M194 57H214M290 57H310", true) +
    line("M156 74V112M252 74V112M345 74V112", false, true) +
    box(118, 112, 76, 30, "IaC checks") +
    box(214, 112, 76, 30, "OWASP ZAP") +
    box(310, 112, 70, 30, "runtime") +
    line("M345 142V166") +
    box(244, 166, 136, 30, "Prometheus + Grafana") +
    note(22, 190, "scan, check, monitor"),

  // SecureDiscord: messages go through a queue to the scanners.
  bot: () =>
    box(22, 92, 84, 40, "Discord") +
    line("M106 112H130", true) +
    box(130, 92, 84, 40, "bot (Flask)", true) +
    line("M214 112H238", true) +
    box(238, 92, 76, 40, "RabbitMQ") +
    line("M314 112H330M330 52V172M330 52H340M330 112H340M330 172H340") +
    `<rect class="cv-box" x="340" y="38" width="44" height="28" rx="3"/><text class="cv-text" x="362" y="56" text-anchor="middle">links</text>` +
    `<rect class="cv-box" x="340" y="98" width="44" height="28" rx="3"/><text class="cv-text" x="362" y="116" text-anchor="middle">intel</text>` +
    `<rect class="cv-box cv-box--a" x="340" y="158" width="44" height="28" rx="3"/><text class="cv-text cv-text--a" x="362" y="176" text-anchor="middle">alert</text>` +
    note(22, 30, "link scanning") +
    note(22, 206, "real-time alerts"),
};

export function coverArt(name) {
  const draw = ART[name];
  if (!draw) throw new Error(`Unknown cover art "${name}"`);
  return html`<svg class="cover-art" viewBox="0 0 400 225" role="img" aria-label="Diagram">${raw(draw())}</svg>`;
}
