import { Icons } from "@/components/icons";
import type { ResumeData } from "./types";

// English content - source of truth for structure.
// Keep de.tsx and fr.tsx structurally in sync when you edit this file.
export const en: ResumeData = {
  name: "Mohamed Ali Mellah",
  firstName: "Mohamed Ali",
  initials: "MM",
  title: "Cloud-Native & Kubernetes Engineer · DevSecOps Practitioner",
  tagline: "Top 2% Ranked, TryHackMe",
  description: "Cloud-Native & Kubernetes Engineer · DevSecOps Practitioner",
  summary:
    "Cloud-native and Kubernetes specialist with expertise in designing, deploying and managing Kubernetes clusters, containerization and microservices architecture. Hands-on experience in cloud architecture, deployment automation and infrastructure as code, with additional skills in Go programming and DevOps practice.",
  avatarUrl: "/me.jpg",
  location: "Munich, Germany",
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
      title: "Global 1st Prize, Huawei ICT Competition, Computing Track (Shenzhen, China)",
      description: "Won after topping Tunisia's National Final and the MENA Regional Final.",
    },
    {
      period: "2026",
      title: "International Speaker, ContainerDays Hamburg 2026",
      description: "\u201cHow Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals\u201d",
    },
    {
      period: "2026",
      title: "International Speaker, Cloud Identity Summit (Frankfurt, 3 Nov 2026)",
      description: "\u201cYour CI/CD Pipeline Is Over-Privileged: Identity Risks in Modern Cloud Platforms\u201d",
    },
    {
      period: "2023",
      title: "National Winner, Huawei ICT Competition, Network Track, Tunisia",
    },
    {
      period: "2019-2025",
      title: "Hackathons & Leadership",
      description:
        "Winner of multiple university hackathons and technical competitions; held leadership positions in university clubs and organizations.",
    },
  ],

  education: [
    {
      school: "Philipps-Universität Marburg / Hochschule Schmalkalden, Germany",
      degree: "Exchange Program, Computer Science",
      start: "2024",
      end: "2026",
      logoUrl: "/hsm.png",
      href: "https://www.hs-schmalkalden.de/",
    },
    {
      school: "TEK-UP University, Tunisia",
      degree: "Engineering Degree, Networks and Systems Security",
      start: "2022",
      end: "June 2026",
      logoUrl: "/TEK-UP.png",
      href: "https://tek-up.de/",
    },
    {
      school: "Higher Institute of Technological Studies of Radès (ISET Radès), Tunisia",
      degree: "License Degree, Networks and Systems Administration",
      start: "2019",
      end: "June 2022",
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
      name: "Certified Kubernetes Security Specialist (CKS) - sitting exam soon",
      logo: "/certs/cks.png",
      inProgress: true,
    },
    {
      name: "Next goal: Kubestronaut title (all five Kubernetes certifications)",
      logo: "/certs/kubestronaut.png",
      inProgress: true,
    },
  ],
  certificationsFootnote:
    "Next goal: Kubestronaut title - all five Kubernetes certifications by the end of the next trimester.",

  skillCategories: [
    {
      label: "Infrastructure & Cloud",
      skills: [
        "AWS", "Azure", "Google Cloud Platform (GCP)", "Unix/Linux", "Windows Server",
        "VMware", "OpenStack", "ProxMox",
      ],
    },
    {
      label: "DevOps & Platform Engineering",
      skills: [
        "Git", "GitLab", "Jenkins", "Docker", "Kubernetes",
        "Kubernetes Operators (CRDs, controllers)", "OpenShift/OKD", "Helm", "Kustomize",
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
      label: "Networking",
      skills: ["VLAN", "Routing", "DNS", "DHCP", "VPN", "BGP", "OSPF"],
    },
    {
      label: "Documentation & Reporting",
      skills: ["LaTeX (Overleaf, TeXShop)", "Microsoft Word", "PowerPoint", "Excel"],
    },
    {
      label: "Languages & Scripting",
      skills: ["Python", "Go", "C", "Java", "Bash", "PowerShell", "SQL", "YAML", "HCL", "Jsonnet"],
    },
  ],

  work: [
    {
      company: "NoLimits Embedded",
      title: "DevSecOps / Cloud Engineering Intern",
      start: "Nov 2025",
      end: "May 2026",
      logoUrl: "/Freelance.png",
      description: [
        "Built a production-style Kubernetes DevSecOps platform on AWS, using infrastructure as code, automated CI/CD, GitOps deployment, integrated security controls and observability.",
      ],
    },
    {
      company: "Freelance",
      title: "Freelance DevSecOps Engineer",
      location: "Tunis, Tunisia",
      start: "2022",
      end: "May 2025",
      logoUrl: "/Freelance.png",
      description: [
        "Delivered DevOps, cloud, security and networking solutions for 15+ clients, driving infrastructure efficiency and security across projects.",
        "Optimized 10+ CI/CD pipelines, automating deployment and reducing release times by 30%.",
        "Configured 50+ Windows servers and IIS systems, along with routers, switches and firewalls, ensuring network stability and security.",
        "Administered a monitoring stack (Grafana, Prometheus, Elasticsearch), improving system observability by 40%.",
        "Implemented SOC and Bitwarden, centralizing event monitoring and password management for 5 clients.",
        "Led 2 Azure Hybrid migration projects across development, pre-production and production environments.",
        "Maintained a 95% SLA resolution rate for support tickets while producing full documentation, user manuals and runbooks.",
      ],
    },
    {
      company: "TEK-UP University",
      title: "Systems Administration Intern",
      location: "Ariana, Tunisia",
      start: "Jul 2024",
      end: "Aug 2024",
      logoUrl: "/TEK-UP.png",
      href: "https://tek-up.de/",
      description: [
        "Two-month internship focused on RHCSA, RHCE and Kubernetes training, resulting in practical experience with Linux and container management.",
      ],
    },
    {
      company: "Taskin Enterprise",
      title: "Software Engineering Intern",
      location: "Korba, Tunisia",
      start: "Jul 2023",
      end: "Sep 2023",
      logoUrl: "/Taskin.png",
      description: [
        "Developed backend features for a real estate website (NodeJS, MySQL), increasing transaction speed by 20%.",
        "Designed and executed deployment strategies on AWS using Terraform, Ansible and Jenkins, reducing manual deployments by 50%.",
      ],
    },
    {
      company: "Blue IT",
      title: "Network Security Intern - End-of-Study Project",
      location: "Tunis, Tunisia",
      start: "Jan 2022",
      end: "Jul 2022",
      logoUrl: "/BlueIT.png",
      description: [
        "Deployed a secure Wi-Fi network with Huawei equipment; implemented captive portal authentication and VLAN segmentation.",
      ],
    },
    {
      company: "Tunisia's National Post",
      title: "Network Engineering Intern",
      location: "Tunis, Tunisia",
      start: "Jul 2022",
      end: "Aug 2022",
      logoUrl: "/Poste.jpg",
      href: "https://www.poste.tn/",
      description: [
        "Engineered a core network architecture prototype integrating VPN and OSPF for secure, efficient routing.",
      ],
    },
    {
      company: "Tunisie Telecom",
      title: "IT Infrastructure Intern",
      location: "Ben Arous, Tunisia",
      start: "Feb 2021",
      end: "Mar 2021",
      logoUrl: "/TT.png",
      href: "https://www.tunisietelecom.tn/",
      description: [
        "Maintained the server room and coordinated 100+ new client internet connections.",
      ],
    },
    {
      company: "SOFIA Technology",
      title: "IT Support Intern",
      location: "Ariana, Tunisia",
      start: "Feb 2020",
      end: "Mar 2020",
      logoUrl: "/Sofia-tech.png",
      href: "https://sofia-technologies.com/",
      description: [
        "Supported daily IT operations, including desktop and network troubleshooting.",
      ],
    },
  ],

  projects: [
    {
      title: "ProjectClaim",
      href: "https://github.com/mella7/ProjectClaim",
      dates: "2026",
      description:
        "A Kubernetes operator built from scratch on OKD/OpenShift: custom CRDs, a reconciler, finalizer-based deletion, CEL immutability rules and idempotent CreateOrUpdate logic.",
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
        "A ground-up reimplementation of container networking fundamentals: Linux namespaces, veth pairs, bridges and iptables NAT, covered by a 14-case pytest suite.",
      technologies: ["Python", "Linux namespaces", "veth", "iptables", "Networking", "pytest"],
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
        "A full-stack CloudStack provisioning portal: a drag-and-drop React Flow canvas, FastAPI backend, Terraform generation, SSE log streaming and a VNC console, tested end to end on a real 4-node physical cluster.",
      technologies: ["FastAPI", "React", "TypeScript", "Terraform", "CloudStack", "SSE"],
      image: "",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/cloudstack-dc", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "KubeAudit",
      href: "https://github.com/mella7/KubeAudit",
      dates: "May 2024",
      description:
        "An auditing tool for Kubernetes clusters to identify security gaps, enforce best practices, and ensure compliance with security standards.",
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
        "A comprehensive security suite designed for DevSecOps workflows, enhancing security in CI/CD pipelines, infrastructure as code, and application runtime.",
      technologies: ["Docker", "Kubernetes", "Ansible", "OWASP ZAP", "Grafana", "Prometheus", "ELK Stack"],
      image: "/Projects/DevsecopsSuite.png",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/DevSecOps-Security-Suite", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "GuardianX",
      href: "https://github.com/mella7/GuardianX",
      dates: "May - Jun 2023",
      description:
        "A cloud-native threat detection and response tool, providing real-time security insights and alerting for cloud infrastructures.",
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
        "A Discord bot with security-focused features like threat intelligence, link scanning, and real-time alerting, helping keep communities safe.",
      technologies: ["Git", "LDAP", "RabbitMQ", "SQLite", "Kubernetes", "Docker", "Flask"],
      image: "/Projects/SecureDiscord.jpeg",
      links: [
        {
          type: "Demo video",
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
      location: "Hamburg, Germany",
      talkTitle: "How Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals",
      description:
        "A practitioner's walkthrough of real attack patterns against Kubernetes clusters, and how eBPF-based runtime signals expose them before they become incidents.",
      abstract:
        "Your pipeline is green. Every image scan passed, every policy check went through, the admission controller signed off. And your cluster still gets owned at runtime. This session follows Alex, a platform engineer whose build-time controls did everything right and still missed what mattered. We look at how clusters actually fail under attack: reverse shells opened from a running container, privilege escalation that never touches the API server, and process execution nobody wrote a policy for. Then we watch eBPF catch it. Using Tetragon, we run a live two-act demo: first detecting a reverse shell and a privilege escalation as they happen, then promoting those same detections into enforcement so the next attempt never completes. The takeaway is not that preventive controls are useless, it is that they are half the story. Runtime signals are what tell you the difference between a cluster that is secure and a cluster that has simply not been attacked yet.",
      href: "https://www.containerdays.io/",
      upcoming: true,
      slidesDir: "/talks/slides/containerdays-2026-ebpf",
      slideCount: 56,
      slidesUrl: "/talks/slides/containerdays-2026-ebpf.pdf",
      // After the recording is published:
      //   videoUrl: "https://www.youtube.com/watch?v=..."
      venue: {
        name: "Schuppen 52",
        description:
          "A heritage-protected former cargo shed in the Port of Hamburg, built between 1908 and 1912, and now one of the city's largest event venues.",
        address: "Schuppen 52, Australiastrasse 52, 20457 Hamburg, Germany",
      },
    },
    {
      slug: "cloud-identity-summit-2026-cicd",
      event: "Cloud Identity Summit",
      date: "3 Nov 2026",
      location: "Frankfurt, Germany",
      talkTitle: "Your CI/CD Pipeline Is Over-Privileged: Identity Risks in Modern Cloud Platforms",
      description:
        "Why pipeline identities are the most over-privileged accounts in most organizations, and how to reduce the blast radius of CI/CD credentials in modern cloud platforms.",
      abstract:
        "Most organizations spend enormous effort on human identity: SSO, MFA, least privilege, quarterly access reviews. Meanwhile the CI/CD service account quietly holds cluster-admin, a long-lived cloud key, and push access to production. Nobody reviews it, because nobody thinks of a pipeline as an identity. This talk makes the case that your pipeline is the most over-privileged principal in your platform, and the least monitored. We walk through how these permissions accumulate, what an attacker does with a compromised runner, and why secret rotation alone does not fix it. Then we look at what actually reduces the blast radius: short-lived workload identity instead of static keys, scoping credentials per environment rather than per pipeline, and treating pipeline identity as something you audit on the same cadence as human access.",
      // TODO: add the official event URL when it is published
      upcoming: true,
    },
  ],

  languages: [
    { name: "English", level: "C1+, certified via onSET exam" },
    { name: "French", level: "B2+ (Proficient)" },
    { name: "German", level: "A2 (currently learning)" },
    { name: "Arabic", level: "Native" },
  ],

  interests: ["Sports", "Technology & Computing", "Traveling", "Community Service", "Hackathons"],
};
