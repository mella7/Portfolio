import { Icons } from "@/components/icons";
import type { ResumeData } from "./types";

// Deutsche Inhalte - strukturell identisch mit en.tsx halten.
export const de: ResumeData = {
  name: "Mohamed Ali Mellah",
  firstName: "Mohamed Ali",
  initials: "MM",
  title: "Cloud-Native & Kubernetes Engineer · DevSecOps Practitioner",
  tagline: "Top 2 % Ranking, TryHackMe",
  description: "Cloud-Native & Kubernetes Engineer · DevSecOps Practitioner",
  summary:
    "Cloud-Native- und Kubernetes-Spezialist mit Expertise in Design, Deployment und Betrieb von Kubernetes-Clustern, Containerisierung und Microservices-Architekturen. Praktische Erfahrung in Cloud-Architektur, Deployment-Automatisierung und Infrastructure as Code, ergänzt durch Kenntnisse in Go-Programmierung und DevOps-Praxis.",
  avatarUrl: "/me.jpg",
  location: "München, Deutschland",
  email: "mellah.mohamedali@outlook.com",
  phone: "+49 1521 1781941",
  url: "https://mella7.me",
  social: {
    github: "https://github.com/mella7",
    linkedin: "https://www.linkedin.com/in/MellahMedAli/",
  },

  awards: [
    {
      period: "2025-2026",
      title: "Globaler 1. Platz, Huawei ICT Competition, Computing Track (Shenzhen, China)",
      description: "Sieg nach dem nationalen Finale in Tunesien und dem MENA-Regionalfinale.",
    },
    {
      period: "2026",
      title: "Internationaler Speaker, ContainerDays Hamburg 2026",
      description: "\u201cHow Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals\u201d",
    },
    {
      period: "2026",
      title: "Internationaler Speaker, Cloud Identity Summit (Frankfurt, 3. Nov 2026)",
      description: "\u201cYour CI/CD Pipeline Is Over-Privileged: Identity Risks in Modern Cloud Platforms\u201d",
    },
    {
      period: "2023",
      title: "Nationaler Sieger, Huawei ICT Competition, Network Track, Tunesien",
    },
    {
      period: "2019-2025",
      title: "Hackathons & Leadership",
      description:
        "Sieger mehrerer Hochschul-Hackathons und Technik-Wettbewerbe; Führungspositionen in studentischen Clubs und Organisationen.",
    },
  ],

  education: [
    {
      school: "Philipps-Universität Marburg / Hochschule Schmalkalden, Deutschland",
      degree: "Austauschprogramm, Informatik",
      start: "2024",
      end: "2026",
      logoUrl: "/hsm.png",
      href: "https://www.hs-schmalkalden.de/",
    },
    {
      school: "TEK-UP University, Tunesien",
      degree: "Ingenieurdiplom, Netzwerk- und Systemsicherheit",
      start: "2022",
      end: "Juni 2026",
      logoUrl: "/TEK-UP.png",
      href: "https://tek-up.de/",
    },
    {
      school: "Higher Institute of Technological Studies of Radès (ISET Radès), Tunesien",
      degree: "Lizenziat (Bachelor), Netzwerk- und Systemadministration",
      start: "2019",
      end: "Juni 2022",
      logoUrl: "/ISET-Logo.png",
      href: "http://www.isetr.rnu.tn/",
    },
  ],

  certifications: [
    { name: "Red Hat Certified System Administrator (RHCSA)", logo: "/certs/rhcsa.png" },
    { name: "Certified Kubernetes Administrator (CKA)", logo: "/certs/cka.png" },
    { name: "Certified Kubernetes Application Developer (CKAD)", logo: "/certs/ckad.png" },
    { name: "AWS Certified Cloud Practitioner (AWS CCP)", logo: "/certs/aws-ccp.png" },
    { name: "eLearnSecurity Junior Penetration Tester (eJPT)", logo: "/certs/ejpt.png" },
    { name: "Cisco Network Security", logo: "/certs/cisco-security.png" },
    { name: "Cisco DevNet Associate", logo: "/certs/devnet.png" },
    { name: "Cisco Routing & Switching", logo: "/certs/routing-switching.png" },
    {
      name: "Certified Kubernetes Security Specialist (CKS) - Prüfung steht kurz bevor",
      logo: "/certs/cks.png",
      inProgress: true,
    },
    {
      name: "Nächstes Ziel: Kubestronaut-Titel (alle fünf Kubernetes-Zertifizierungen)",
      logo: "/certs/kubestronaut.png",
      inProgress: true,
    },
  ],
  certificationsFootnote:
    "Nächstes Ziel: der Kubestronaut-Titel - alle fünf Kubernetes-Zertifizierungen bis zum Ende des nächsten Trimesters.",

  skillCategories: [
    {
      label: "Infrastruktur & Cloud",
      skills: [
        "AWS", "Azure", "Google Cloud Platform (GCP)", "Unix/Linux", "Windows Server",
        "VMware", "OpenStack", "ProxMox",
      ],
    },
    {
      label: "DevOps & Platform Engineering",
      skills: [
        "Git", "GitLab", "Jenkins", "Docker", "Kubernetes",
        "Kubernetes Operators (CRDs, Controller)", "OpenShift/OKD", "Helm", "Kustomize",
        "GitOps", "ArgoCD", "Terraform", "Ansible", "Puppet", "Chef",
        "HashiCorp Vault", "Nexus", "Vagrant", "npm",
      ],
    },
    {
      label: "Cloud-Native Security",
      skills: [
        "Kyverno", "Falco", "Trivy", "Snyk", "OWASP ZAP", "SonarQube", "Splunk",
        "Wazuh", "TheHive", "Suricata", "AlienVault", "Nessus", "pfSense",
        "AWS IAM/WAF", "Azure AD", "Okta",
      ],
    },
    {
      label: "Monitoring & Logging",
      skills: [
        "Grafana", "Prometheus", "ELK Stack (Elasticsearch, Logstash, Kibana)",
        "Zabbix", "Datadog", "NodeExporter", "Nagios", "Wireshark",
      ],
    },
    {
      label: "Netzwerke",
      skills: ["VLAN", "Routing", "DNS", "DHCP", "VPN", "BGP", "OSPF"],
    },
    {
      label: "Dokumentation & Reporting",
      skills: ["LaTeX (Overleaf, TeXShop)", "Microsoft Word", "PowerPoint", "Excel"],
    },
    {
      label: "Sprachen & Scripting",
      skills: ["Python", "Go", "C", "Java", "Bash", "PowerShell", "SQL", "YAML", "HCL", "Jsonnet"],
    },
  ],

  work: [
    {
      company: "NoLimits Embedded",
      title: "DevSecOps- / Cloud-Engineering-Praktikant",
      start: "Nov 2025",
      end: "Mai 2026",
      logoUrl: "/Freelance.png",
      description: [
        "Produktionsnahe Kubernetes-DevSecOps-Plattform auf AWS aufgebaut - mit Infrastructure as Code, automatisierten CI/CD-Pipelines, GitOps-Deployment, integrierten Security-Kontrollen und Observability.",
      ],
    },
    {
      company: "Freelance",
      title: "Freiberuflicher DevSecOps Engineer",
      location: "Tunis, Tunesien",
      start: "2022",
      end: "Mai 2025",
      logoUrl: "/Freelance.png",
      description: [
        "DevOps-, Cloud-, Security- und Netzwerklösungen für 15+ Kunden umgesetzt und damit Effizienz und Sicherheit der Infrastruktur projektübergreifend gesteigert.",
        "10+ CI/CD-Pipelines optimiert, Deployments automatisiert und Release-Zeiten um 30 % verkürzt.",
        "50+ Windows-Server und IIS-Systeme sowie Router, Switches und Firewalls konfiguriert und so Netzwerkstabilität und -sicherheit sichergestellt.",
        "Monitoring-Stack (Grafana, Prometheus, Elasticsearch) administriert und die System-Observability um 40 % verbessert.",
        "SOC und Bitwarden eingeführt und damit Event-Monitoring und Passwortverwaltung für 5 Kunden zentralisiert.",
        "2 Azure-Hybrid-Migrationsprojekte über Entwicklungs-, Pre-Production- und Produktionsumgebungen geleitet.",
        "95 % SLA-Lösungsquote im Support gehalten und vollständige Dokumentation, Benutzerhandbücher und Runbooks erstellt.",
      ],
    },
    {
      company: "TEK-UP University",
      title: "Praktikant Systemadministration",
      location: "Ariana, Tunesien",
      start: "Jul 2024",
      end: "Aug 2024",
      logoUrl: "/TEK-UP.png",
      href: "https://tek-up.de/",
      description: [
        "Zweimonatiges Praktikum mit Fokus auf RHCSA-, RHCE- und Kubernetes-Training; praktische Erfahrung mit Linux und Container-Management.",
      ],
    },
    {
      company: "Taskin Enterprise",
      title: "Praktikant Softwareentwicklung",
      location: "Korba, Tunesien",
      start: "Jul 2023",
      end: "Sep 2023",
      logoUrl: "/Taskin.png",
      description: [
        "Backend-Funktionen für eine Immobilien-Website entwickelt (NodeJS, MySQL) und die Transaktionsgeschwindigkeit um 20 % erhöht.",
        "Deployment-Strategien auf AWS mit Terraform, Ansible und Jenkins konzipiert und umgesetzt; manuelle Deployments um 50 % reduziert.",
      ],
    },
    {
      company: "Blue IT",
      title: "Praktikant Netzwerksicherheit - Abschlussprojekt",
      location: "Tunis, Tunesien",
      start: "Jan 2022",
      end: "Jul 2022",
      logoUrl: "/BlueIT.png",
      description: [
        "Sicheres WLAN-Netzwerk mit Huawei-Equipment aufgebaut; Captive-Portal-Authentifizierung und VLAN-Segmentierung implementiert.",
      ],
    },
    {
      company: "Tunesische Post (La Poste Tunisienne)",
      title: "Praktikant Netzwerktechnik",
      location: "Tunis, Tunesien",
      start: "Jul 2022",
      end: "Aug 2022",
      logoUrl: "/Poste.jpg",
      href: "https://www.poste.tn/",
      description: [
        "Prototyp einer Core-Netzwerkarchitektur mit VPN- und OSPF-Integration für sicheres, effizientes Routing entwickelt.",
      ],
    },
    {
      company: "Tunisie Telecom",
      title: "Praktikant IT-Infrastruktur",
      location: "Ben Arous, Tunesien",
      start: "Feb 2021",
      end: "Mär 2021",
      logoUrl: "/TT.png",
      href: "https://www.tunisietelecom.tn/",
      description: [
        "Serverraum betreut und die Einrichtung von 100+ neuen Kunden-Internetanschlüssen koordiniert.",
      ],
    },
    {
      company: "SOFIA Technology",
      title: "Praktikant IT-Support",
      location: "Ariana, Tunesien",
      start: "Feb 2020",
      end: "Mär 2020",
      logoUrl: "/Sofia-tech.png",
      href: "https://sofia-technologies.com/",
      description: [
        "Täglichen IT-Betrieb unterstützt, inklusive Desktop- und Netzwerk-Troubleshooting.",
      ],
    },
  ],

  projects: [
    {
      title: "ProjectClaim",
      href: "https://github.com/mella7/ProjectClaim",
      dates: "2026",
      description:
        "Ein von Grund auf entwickelter Kubernetes-Operator auf OKD/OpenShift: eigene CRDs, Reconciler, Finalizer-basierte Löschung, CEL-Immutability-Regeln und idempotente CreateOrUpdate-Logik.",
      technologies: ["Go", "Kubernetes", "controller-runtime", "CRDs", "OpenShift/OKD", "Operators"],
      image: "",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/ProjectClaim", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "container-networking-from-scratch",
      href: "https://github.com/mella7/container-networking-from-scratch",
      dates: "2026",
      description:
        "Eine Reimplementierung der Grundlagen von Container-Networking: Linux-Namespaces, veth-Paare, Bridges und iptables-NAT, abgesichert durch eine Testsuite mit 14 pytest-Fällen.",
      technologies: ["Python", "Linux-Namespaces", "veth", "iptables", "Networking", "pytest"],
      image: "",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/container-networking-from-scratch", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "cloudstack-dc",
      href: "https://github.com/mella7/cloudstack-dc",
      dates: "2026",
      description:
        "Ein Full-Stack-CloudStack-Provisioning-Portal: React-Flow-Canvas mit Drag-and-Drop, FastAPI-Backend, Terraform-Generierung, SSE-Log-Streaming und VNC-Konsole, End-to-End getestet auf einem echten physischen 4-Knoten-Cluster.",
      technologies: ["FastAPI", "React", "TypeScript", "Terraform", "CloudStack", "SSE"],
      image: "",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/cloudstack-dc", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "KubeAudit",
      href: "https://github.com/mella7/KubeAudit",
      dates: "Mai 2024",
      description:
        "Ein Audit-Tool für Kubernetes-Cluster, das Sicherheitslücken identifiziert, Best Practices durchsetzt und die Einhaltung von Sicherheitsstandards sicherstellt.",
      technologies: ["Kubernetes", "Ansible", "Go", "YAML", "Bash", "Kind", "Docker", "ELK"],
      image: "/Projects/KubeAudit.png",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/KubeAudit", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "DevSecOps Security Suite",
      href: "https://github.com/mella7/DevSecOps-Security-Suite",
      dates: "Jun 2024 - Jul 2024",
      description:
        "Eine umfassende Security-Suite für DevSecOps-Workflows, die die Sicherheit in CI/CD-Pipelines, Infrastructure as Code und zur Laufzeit erhöht.",
      technologies: ["Docker", "Kubernetes", "Ansible", "OWASP ZAP", "Grafana", "Prometheus", "ELK Stack"],
      image: "/Projects/DevsecopsSuite.png",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/DevSecOps-Security-Suite", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "GuardianX",
      href: "https://github.com/mella7/GuardianX",
      dates: "Mai - Jun 2023",
      description:
        "Ein cloud-natives Tool zur Bedrohungserkennung und -abwehr mit Echtzeit-Sicherheitseinblicken und Alerting für Cloud-Infrastrukturen.",
      technologies: ["Python", "AWS Lambda", "CloudFormation", "VirusTotal API", "ElasticSearch", "Flask"],
      image: "/Projects/GuardianX.jpeg",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/GuardianX", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "SecureDiscord",
      href: "https://github.com/mella7/SecureDiscord",
      dates: "Sep - Nov 2023",
      description:
        "Ein Discord-Bot mit Security-Fokus: Threat Intelligence, Link-Scanning und Echtzeit-Alerting, um Communities zu schützen.",
      technologies: ["Git", "LDAP", "RabbitMQ", "SQLite", "Kubernetes", "Docker", "Flask"],
      image: "/Projects/SecureDiscord.jpeg",
      links: [
        {
          type: "Demo-Video",
          href: "https://drive.google.com/file/d/14F_p5ilFHMwQH_J1iZx6fMqxDoPqW62D/view?usp=sharing",
          icon: <Icons.globe className="size-3" />,
        },
        { type: "GitHub", href: "https://github.com/mella7/SecureDiscord", icon: <Icons.github className="size-3" /> },
      ],
    },
  ],

  talks: [
    {
      slug: "containerdays-2026-ebpf",
      event: "ContainerDays Hamburg 2026",
      date: "2026",
      location: "Hamburg, Deutschland",
      talkTitle: "How Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals",
      description:
        "Ein Praxisbericht über reale Angriffsmuster auf Kubernetes-Cluster und darüber, wie eBPF-basierte Runtime-Signale sie sichtbar machen, bevor daraus Vorfälle werden.",
      abstract:
        "Die Pipeline ist grün. Jeder Image-Scan bestanden, jede Policy-Prüfung durchgelaufen, der Admission Controller hat freigegeben. Und der Cluster wird trotzdem zur Laufzeit übernommen. Diese Session begleitet Alex, einen Platform Engineer, dessen Build-Time-Kontrollen alles richtig gemacht und das Entscheidende trotzdem übersehen haben. Wir sehen uns an, wie Cluster unter Angriff tatsächlich versagen: Reverse Shells aus einem laufenden Container, Privilege Escalation ohne jeden Kontakt zum API-Server und Prozessausführung, für die niemand eine Policy geschrieben hat. Anschliessend fängt eBPF genau das ab. Mit Tetragon zeigen wir eine Live-Demo in zwei Akten: zuerst die Erkennung von Reverse Shell und Privilege Escalation in Echtzeit, dann die Überführung derselben Erkennungen in Enforcement, sodass der nächste Versuch gar nicht mehr durchkommt. Die Botschaft ist nicht, dass präventive Kontrollen nutzlos wären, sondern dass sie nur die halbe Geschichte sind. Runtime-Signale zeigen den Unterschied zwischen einem Cluster, der sicher ist, und einem, der schlicht noch nicht angegriffen wurde.",
      href: "https://www.containerdays.io/",
      upcoming: true,
      slidesDir: "/talks/slides/containerdays-2026-ebpf",
      slideCount: 56,
      slidesUrl: "/talks/slides/containerdays-2026-ebpf.pdf",
      venue: {
        name: "Schuppen 52",
        description:
          "Ein denkmalgeschützter ehemaliger Lagerschuppen im Hamburger Hafen, zwischen 1908 und 1912 erbaut und heute eine der grössten Eventlocations der Stadt.",
        address: "Schuppen 52, Australiastrasse 52, 20457 Hamburg, Deutschland",
      },
    },
    {
      slug: "cloud-identity-summit-2026-cicd",
      event: "Cloud Identity Summit",
      date: "3. Nov. 2026",
      location: "Frankfurt, Deutschland",
      talkTitle: "Your CI/CD Pipeline Is Over-Privileged: Identity Risks in Modern Cloud Platforms",
      description:
        "Warum Pipeline-Identitäten in den meisten Organisationen die am stärksten überprivilegierten Konten sind und wie sich der Schadensradius von CI/CD-Zugangsdaten begrenzen lässt.",
      abstract:
        "Die meisten Organisationen investieren enorm viel in menschliche Identitäten: SSO, MFA, Least Privilege, quartalsweise Zugriffsprüfungen. Gleichzeitig hält der CI/CD-Service-Account still und leise cluster-admin, einen langlebigen Cloud-Key und Push-Rechte auf Produktion. Niemand prüft das, weil niemand eine Pipeline als Identität begreift. Dieser Vortrag zeigt: Ihre Pipeline ist das am stärksten überprivilegierte Principal Ihrer Plattform und zugleich das am wenigsten überwachte. Wir gehen durch, wie sich diese Berechtigungen ansammeln, was ein Angreifer mit einem kompromittierten Runner anstellt und warum blosse Secret-Rotation das Problem nicht löst. Danach schauen wir auf das, was den Schadensradius wirklich verkleinert: kurzlebige Workload Identity statt statischer Keys, Zugangsdaten pro Umgebung statt pro Pipeline und Pipeline-Identität als etwas, das im selben Rhythmus auditiert wird wie menschliche Zugriffe.",
      upcoming: true,
    },
  ],

  languages: [
    { name: "Englisch", level: "C1+, zertifiziert per onSET-Prüfung" },
    { name: "Französisch", level: "B2+ (fließend)" },
    { name: "Deutsch", level: "A2 (wird aktuell gelernt)" },
    { name: "Arabisch", level: "Muttersprache" },
  ],

  interests: ["Sport", "Technologie & Computing", "Reisen", "Ehrenamtliches Engagement", "Hackathons"],
};
