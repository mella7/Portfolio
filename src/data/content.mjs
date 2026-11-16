// Everything the site says about you. Edit here; the pages read from it.
// Facts follow the current resume (public/resume/Resume_Mohamed_Ali_Mellah_EN.pdf).

import { readFileSync } from "node:fs";

const abstracts = JSON.parse(readFileSync(new URL("./talk-abstracts.json", import.meta.url), "utf8"));
const abstractFor = (slug) => abstracts.find((a) => a.slug === slug) ?? { description: "", abstract: "" };

// ------------------------------------------------------------------ intro

export const intro = {
  headline: ["I build Kubernetes platforms, then try to ", "break", " them."],
  paragraphs: [
    "I'm a cloud-native and Kubernetes engineer working across platforms, cloud identity and runtime security: operators in Go, GitOps delivery, and eBPF detection with Tetragon. CKA, CKAD and RHCSA certified, CKS in progress.",
    "In 2026 I spoke at ContainerDays Hamburg and Cloud Identity Summit, and won the Global 1st Prize at the Huawei ICT Competition in Shenzhen, out of 220,000+ participants from 2,000+ universities in 100+ countries. I'm looking for DevOps, DevSecOps and Platform Engineering roles.",
  ],
  // Shown at the very top of the homepage.
  notice: "Want to reach me? Send me anything through the form below.",
};

export const pillars = [
  { command: "kubectl apply", title: "Platforms", text: "Kubernetes and OpenShift clusters, operators in Go, Helm and Argo CD for GitOps delivery." },
  { command: "tetra getevents", title: "Security", text: "Runtime detection with eBPF (Tetragon, Falco), admission policy with Kyverno, scanning in every pipeline." },
  { command: "terraform plan", title: "Automation", text: "Terraform and Ansible across environments, CI/CD that stops a build on HIGH or CRITICAL findings." },
];

// ------------------------------------------------------------------ talks
// Slides live in public/talks/slides/<slug>/NN-<width>.avif|webp (scripts/images.py).

export const talks = [
  {
    slug: "cloud-identity-summit-2026-cicd",
    event: "Cloud Identity Summit 2026",
    date: "3 Nov 2026",
    isoDate: "2026-11-03",
    location: "Frankfurt, Germany",
    title: "Your CI/CD Pipeline Is Over-Privileged: Identity Risks in Modern Cloud Platforms",
    shortTitle: "Your CI/CD pipeline is over-privileged",
    ...abstractFor("cloud-identity-summit-2026-cicd"),
    eventUrl: "https://www.identitysummit.cloud/",
    slidesDir: "/talks/slides/cloud-identity-summit-2026-cicd",
    slideCount: 73,
    pdf: "/talks/slides/cloud-identity-summit-2026-cicd.pdf",
    tags: ["Identity", "CI/CD", "Workload identity", "Entra ID"],
    photo: "moments/cloud-identity-summit-talk",
    thumbs: [1, 4, 9, 14, 22, 31, 40, 52],
  },
  {
    slug: "containerdays-2026-ebpf",
    event: "ContainerDays Hamburg 2026",
    date: "2-4 Sep 2026",
    isoDate: "2026-09-02",
    location: "Hamburg, Germany",
    title: "How Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals",
    shortTitle: "How clusters fail under attack",
    ...abstractFor("containerdays-2026-ebpf"),
    eventUrl: "https://www.containerdays.io/",
    slidesDir: "/talks/slides/containerdays-2026-ebpf",
    slideCount: 56,
    pdf: "/talks/slides/containerdays-2026-ebpf.pdf",
    tags: ["eBPF", "Tetragon", "Runtime security", "Kubernetes"],
    photo: "moments/containerdays-stage",
    thumbs: [1, 3, 8, 14, 20, 27, 35, 44],
    venue: {
      name: "Schuppen 52",
      address: "Australiastrasse 52, 20457 Hamburg, Germany",
      note: "A heritage-protected former cargo shed in the Port of Hamburg, built between 1908 and 1912.",
    },
  },
];

// ------------------------------------------------------------- highlights
// The pinned section on the homepage. `href` is where each one leads.

export const highlights = [
  {
    mark: "1st",
    meta: "2025-26 · Shenzhen, China",
    title: "Global 1st Prize, Huawei ICT Competition",
    text: "Computing Track. First out of 220,000+ participants from 2,000+ universities in 100+ countries, after winning Tunisia's National Final and the MENA Regional Final.",
    photo: "moments/huawei-global-first-prize",
    place: "Shenzhen",
    href: "/moments/#huawei",
    cta: "See the photos",
    tags: [],
  },
  {
    mark: "eBPF",
    meta: "2-4 Sep 2026 · ContainerDays Hamburg",
    title: "How clusters fail under attack, and how we detect it at runtime",
    text: "A live two-act Tetragon demo: detect a reverse shell and a privilege escalation, then turn the detections into enforcement.",
    photo: "moments/containerdays-stage",
    place: "Hamburg",
    href: "/talks/containerdays-2026-ebpf/",
    cta: "Read the 56 slides",
    tags: ["eBPF", "Tetragon", "Runtime security"],
  },
  {
    mark: "CI/CD",
    meta: "3 Nov 2026 · Cloud Identity Summit, Frankfurt",
    title: "Your CI/CD pipeline is over-privileged",
    text: "How pipeline identities get compromised, how to audit them with five questions, and how to fix them with controls you already own.",
    photo: "moments/cloud-identity-summit-talk",
    place: "Frankfurt",
    href: "/talks/cloud-identity-summit-2026-cicd/",
    cta: "Read the 73 slides",
    tags: ["Identity", "CI/CD", "Workload identity"],
  },
];

// --------------------------------------------------------------- projects
// cover: { art: "<name>" } draws one of the diagrams in src/views/covers.mjs,
//        { image: "projects/<name>" } uses a screenshot built by scripts/images.py.

export const projects = [
  {
    slug: "projectclaim",
    name: "project-claim",
    year: "2026",
    highlight: "Operator from scratch",
    description:
      "A Kubernetes operator for self-service, multi-tenant namespaces on OpenShift and Kubernetes. One ProjectClaim in, one governed namespace out: each team gets quota, RBAC and network isolation. Built from scratch with custom CRDs, finalizers and CEL immutability rules.",
    stack: ["Go", "controller-runtime", "CRDs", "OpenShift/OKD"],
    repo: "https://github.com/mella7/project-claim",
    cover: { art: "operator" },
  },
  {
    slug: "container-networking",
    name: "container-networking-from-scratch",
    year: "2026",
    highlight: "14 tests",
    description:
      "What docker0 does automatically, built by hand with raw Linux primitives: namespaces, veth pairs, a bridge and iptables NAT. Verified with a 14-case pytest suite and traced hop by hop with tcpdump.",
    stack: ["Shell", "Linux namespaces", "iptables", "pytest"],
    repo: "https://github.com/mella7/container-networking-from-scratch",
    cover: { art: "networking" },
  },
  {
    slug: "cloudstack-dc",
    name: "cloudstack-dc",
    year: "2026",
    highlight: "4-node cluster",
    description:
      "Design whole CloudStack environments on a canvas: networks, machines, firewalls, load balancers. The portal generates the Terraform, shows the plan and applies it after approval, with live log streaming and a VNC console. Tested on a real 4-node physical cluster.",
    stack: ["FastAPI", "React", "Terraform", "CloudStack"],
    repo: "https://github.com/mella7/cloudstack-dc",
    cover: { art: "datacenter" },
  },
  {
    slug: "kubeaudit",
    name: "KubeAudit",
    year: "2024",
    description:
      "An auditing tool that finds security gaps in Kubernetes clusters, enforces best practices and checks compliance with security standards.",
    stack: ["Kubernetes", "Go", "Ansible", "ELK"],
    repo: "https://github.com/mella7/KubeAudit",
    cover: { art: "audit" },
  },
  {
    slug: "devsecops-suite",
    name: "DevSecOps Security Suite",
    year: "2024",
    description:
      "Security across the whole delivery chain: CI/CD pipeline scanning, infrastructure-as-code checks and runtime monitoring.",
    stack: ["Kubernetes", "OWASP ZAP", "Prometheus", "Grafana"],
    repo: "https://github.com/mella7/DevSecOps-Security-Suite",
    cover: { art: "pipeline" },
  },
  {
    slug: "guardianx",
    name: "GuardianX",
    year: "2023",
    description: "Cloud-native threat detection and response for AWS, with real-time security insights and alerting.",
    stack: ["Python", "AWS Lambda", "CloudFormation", "Elasticsearch"],
    repo: "https://github.com/mella7/GuardianX",
    cover: { image: "projects/guardianx" },
  },
  {
    slug: "securediscord",
    name: "SecureDiscord",
    year: "2023",
    description:
      "A Discord bot with security features: threat intelligence, link scanning and real-time alerting to keep communities safe.",
    stack: ["Flask", "RabbitMQ", "Kubernetes", "Docker"],
    repo: "https://github.com/mella7/SecureDiscord",
    demo: "https://drive.google.com/file/d/14F_p5ilFHMwQH_J1iZx6fMqxDoPqW62D/view?usp=sharing",
    cover: { art: "bot" },
  },
];

// ------------------------------------------------------------- experience

export const experience = [
  {
    company: "NoLimits Embedded",
    title: "DevSecOps / Cloud Engineering Intern",
    start: "Nov 2025",
    end: "May 2026",
    location: "Remote",
    points: [
      "Engineering thesis project: built a DevSecOps platform on AWS for a three-tier containerised app (React, backend API, MongoDB).",
      "Provisioned the VPC and EC2 jump host with Terraform (S3 remote state, applied through GitHub Actions) and an auto-scaling Amazon EKS cluster (2-4 nodes) with eksctl, IRSA and the AWS Load Balancer Controller.",
      "Built a GitHub Actions pipeline with SonarCloud (SAST), Snyk (dependencies) and Trivy (images) that stops any build with HIGH or CRITICAL findings before the image is pushed.",
      "Set up GitOps deployment with Argo CD: the pipeline commits the new image tag and Argo CD syncs the cluster, exposed through an ALB and Route 53.",
      "Ran dev, test and prod as namespaces in a single EKS cluster to avoid tripling AWS costs; deployed Prometheus and Grafana with Helm.",
      "Prototyped runtime and policy hardening: Falco with Slack alerts, Kyverno admission policies, and External Secrets Operator with AWS Secrets Manager.",
    ],
  },
  {
    company: "Freelance",
    title: "DevOps Engineer (part-time)",
    start: "Nov 2022",
    end: "May 2025",
    location: "Tunis, Tunisia / Remote",
    points: [
      "Delivered DevOps work for small businesses and agencies (around 8 clients).",
      "Built and maintained CI/CD pipelines in GitLab CI and Jenkins (build, test, Trivy image scanning, deployment), replacing manual deployments.",
      "Contributed to two on-premise to Azure migrations, setting up separate dev and production environments.",
      "Set up Prometheus and Grafana monitoring with alerting, plus ELK for centralised logging.",
      "Handled support tickets and wrote runbooks and handover documentation for each client.",
    ],
  },
  {
    company: "TEK-UP University",
    title: "Systems Administration Intern",
    start: "Jul 2024",
    end: "Aug 2024",
    points: ["Two-month internship focused on RHCSA, RHCE and Kubernetes training, hands-on with Linux and containers."],
  },
  {
    company: "Taskin Enterprise",
    title: "Software Engineering Intern",
    start: "Jul 2023",
    end: "Sep 2023",
    points: [
      "Developed backend features for a real estate website (Node.js, MySQL), increasing transaction speed by 20%.",
      "Designed and ran deployments on AWS with Terraform, Ansible and Jenkins, reducing manual deployments by 50%.",
    ],
  },
  {
    company: "Blue IT · Tunisia's National Post · Tunisie Telecom · SOFIA Technology",
    title: "4 earlier internships",
    start: "2020",
    end: "2022",
    points: [
      "Network security, infrastructure and IT support: VPN and OSPF routing, a secure Wi-Fi deployment, server room operations.",
    ],
  },
];

export const education = [
  {
    degree: "Non-degree exchange studies, Computer Science",
    school: "HS Schmalkalden, Uni Marburg, Uni Passau · Germany",
    period: "Apr 2025 - Oct 2027",
  },
  {
    degree: "Engineering degree (Master's equivalent), Networks and Systems Security",
    school: "TEK-UP University · Tunisia",
    period: "Sep 2022 - Jun 2026",
  },
  {
    degree: "Bachelor's degree, Networks and Systems Administration",
    school: "ISET Radès · Tunisia",
    period: "Sep 2019 - Jun 2022",
  },
];

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "C1+" },
  { name: "French", level: "C1" },
  { name: "German", level: "A2, learning" },
];

export const awards = [
  { period: "2025-26", title: "Global 1st Prize, Huawei ICT Competition, Computing Track (Shenzhen): 220,000+ participants, 2,000+ universities, 100+ countries" },
  { period: "2026", title: "International speaker, ContainerDays Hamburg and Cloud Identity Summit" },
  { period: "2023", title: "National winner, Huawei ICT Competition, Network Track, Tunisia" },
  { period: "2019-25", title: "Winner of several university hackathons; leadership roles in university clubs" },
];

// Homepage counters.
export const figures = [
  { value: 1, suffix: "st", label: "Global prize, Huawei ICT Competition: 220,000+ participants, 2,000+ universities, 100+ countries" },
  { value: 2, suffix: "", label: "International conference talks in 2026" },
  { value: 8, suffix: "", label: "Certifications, including CKA, CKAD and RHCSA" },
  { value: 2, suffix: "%", prefix: "Top ", label: "Ranked on TryHackMe" },
];

// ------------------------------------------------------------------ stack

export const stack = [
  { group: "Kubernetes & platforms", items: ["Kubernetes", "OpenShift/OKD", "Operators", "Helm", "Kustomize", "Argo CD", "Crossplane", "Backstage", "Cilium"] },
  { group: "Cloud", items: ["AWS", "Azure", "GCP", "OpenStack", "Proxmox"] },
  { group: "Security", items: ["Tetragon / eBPF", "Falco", "Kyverno", "Trivy", "Snyk", "SonarQube", "Sigstore / Cosign", "Vault", "OWASP ZAP", "Wazuh"] },
  { group: "IaC & CI/CD", items: ["Terraform", "OpenTofu", "Ansible", "GitHub Actions", "GitLab CI", "Jenkins"] },
  { group: "Observability", items: ["Prometheus", "Grafana", "OpenTelemetry", "ELK"] },
  { group: "Languages", items: ["Go", "Python", "Bash", "HCL", "Jsonnet"] },
];

// --------------------------------------------------------- certifications

export const certifications = [
  { name: "Certified Kubernetes Administrator", short: "CKA", issuer: "CNCF", logo: "/certs/cka.webp", status: "passed" },
  { name: "Certified Kubernetes Application Developer", short: "CKAD", issuer: "CNCF", logo: "/certs/ckad.webp", status: "passed" },
  { name: "Red Hat Certified System Administrator", short: "RHCSA", issuer: "Red Hat", logo: "/certs/rhcsa.webp", status: "passed" },
  { name: "eLearnSecurity Junior Penetration Tester", short: "eJPT", issuer: "INE", logo: "/certs/ejpt.webp", status: "passed" },
  { name: "AWS Certified Cloud Practitioner", short: "AWS CCP", issuer: "Amazon Web Services", logo: "/certs/aws-ccp.webp", status: "passed" },
  { name: "Cisco DevNet Associate", short: "DevNet", issuer: "Cisco", logo: "/certs/devnet.webp", status: "passed" },
  { name: "Cisco Network Security", short: "Security", issuer: "Cisco", logo: "/certs/cisco-security.webp", status: "passed" },
  { name: "Cisco Routing & Switching", short: "R&S", issuer: "Cisco", logo: "/certs/routing-switching.webp", status: "passed" },
  { name: "Certified Kubernetes Security Specialist", short: "CKS", issuer: "CNCF", logo: "/certs/cks.webp", status: "in-progress" },
  { name: "Kubestronaut (all five Kubernetes certifications)", short: "Kubestronaut", issuer: "CNCF", logo: "/certs/kubestronaut.webp", status: "goal" },
];

// ---------------------------------------------------------------- moments
// file: original in media/moments/, built by scripts/images.py.

export const moments = [
  { file: "containerdays-audience", caption: "Speaking to a full room at ContainerDays Hamburg 2026", w: 1280, h: 591 },
  { file: "containerdays-stage", caption: "On stage at ContainerDays Hamburg with my eBPF runtime security talk", w: 1280, h: 887 },
  { file: "containerdays-session-screen", caption: "Room 4 at ContainerDays: How Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals", w: 800, h: 1066 },
  { file: "cloud-identity-summit-talk", caption: "Presenting \"Your CI/CD Pipeline Is Over-Privileged\" at Cloud Identity Summit 2026, Frankfurt", w: 1280, h: 960 },
  { file: "cloud-identity-summit-speaker", caption: "Speaker intro at Cloud Identity Summit 2026", w: 480, h: 640 },
  { file: "huawei-global-first-prize", caption: "Gold medal and the Tunisian flag at the Huawei ICT Competition 2025-26 Global Final, Shenzhen", w: 1200, h: 900 },
  { file: "huawei-computing-track-first-prize", caption: "On stage as the Computing Track first prize is announced", w: 1200, h: 900 },
  { file: "huawei-award-ceremony-stage", caption: "Receiving the medal with the TEK-UP team name on screen", w: 1200, h: 900 },
  { file: "huawei-global-final-shenzhen", caption: "At the Global Final backdrop in Shenzhen", w: 1200, h: 900 },
  { file: "huawei-tunisia-team", caption: "The Tunisian delegation at the closing ceremony", w: 1200, h: 900 },
  { file: "huawei-medals", caption: "The TEK-UP team with their medals", w: 1200, h: 900 },
  { file: "tekup-graduation", caption: "Graduation day at TEK-UP University", w: 1200, h: 900 },
  { file: "tekup-graduation-team", caption: "Graduation day with friends", w: 1200, h: 900 },
  { file: "huawei-2022-prize", caption: "Huawei ICT Competition 2022-23 prize", w: 1447, h: 1536 },
  { file: "certificate-handover", caption: "Receiving a certificate", w: 1200, h: 1600 },
  { file: "jci-panel", caption: "Panel with JCI (Jeune Chambre Économique) Centre Urbain Nord", w: 960, h: 470 },
  { file: "enactus-make-it-real", caption: "With the Enactus team at Make It Real", w: 1600, h: 864 },
  { file: "ost-family-gathering", caption: "OST family gathering", w: 1600, h: 1067 },
  { file: "conference-badge", caption: "Conference day", w: 1200, h: 1600 },
  { file: "portrait-badge", caption: "Event day", w: 1200, h: 1500 },
  { file: "group-photo-1", caption: "University club", w: 1278, h: 958 },
  { file: "group-photo-2", caption: "University club", w: 1280, h: 958 },
  { file: "group-photo-3", caption: "University club outing", w: 960, h: 768 },
];

// ----------------------------------------------------------- testimonials
// Photos: public/testimonials/*.webp (96x96).

export const testimonials = [
  {
    name: "Mahdi Zgolli",
    handle: "@Mahdi",
    photo: "/testimonials/mahdi.webp",
    quote:
      "Working with Dali was fantastic! He quickly solved a major issue during a project, saving us a lot of time. His energy is truly impressive.",
  },
  {
    name: "Imem Hamdi",
    handle: "@imem",
    photo: "/testimonials/imem.webp",
    quote:
      "During a hackathon, Mohamed Ali turned a challenging idea into a winning project in no time. He's not only brilliant but also makes work enjoyable. Much love!",
  },
  {
    name: "Manel Yatouji",
    handle: "@yousri",
    photo: "/testimonials/manel.webp",
    quote: "I loved working with Med Ali, he brings a lot of enthusiasm and skill to the table.",
  },
  {
    name: "Hyba Ayesh",
    handle: "@Hyba",
    photo: "/testimonials/hyba.webp",
    quote: "Love the creativity, true team player.",
  },
  {
    name: "Rafika Bel Hadj Alaya",
    handle: "@Rafika",
    photo: "/testimonials/rafika.webp",
    quote: "He's not only talented but also a great person to work with.",
  },
  {
    name: "Ala Eddine Largat",
    handle: "@Alaa",
    photo: "/testimonials/ala.webp",
    quote: "Very impressive work, big thanks for the hard work during our last project.",
  },
];
