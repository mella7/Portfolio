import { Icons } from "@/components/icons";
import type { ResumeData } from "./types";

// Contenu français - garder la même structure que en.tsx.
export const fr: ResumeData = {
  name: "Mohamed Ali Mellah",
  firstName: "Mohamed Ali",
  initials: "MM",
  title: "Ingénieur Cloud-Native & Kubernetes · Praticien DevSecOps",
  tagline: "Top 2 % du classement TryHackMe",
  description: "Ingénieur Cloud-Native & Kubernetes · Praticien DevSecOps",
  summary:
    "Spécialiste cloud-native et Kubernetes, expert en conception, déploiement et gestion de clusters Kubernetes, en conteneurisation et en architectures microservices. Expérience pratique en architecture cloud, automatisation des déploiements et infrastructure as code, complétée par des compétences en programmation Go et en pratiques DevOps.",
  avatarUrl: "/me.jpg",
  location: "Munich, Allemagne",
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
      title: "1er prix mondial, Huawei ICT Competition, Computing Track (Shenzhen, Chine)",
      description: "Victoire après la finale nationale tunisienne et la finale régionale MENA.",
    },
    {
      period: "2026",
      title: "Conférencier international, ContainerDays Hamburg 2026",
      description: "\u201cHow Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals\u201d",
    },
    {
      period: "2026",
      title: "Conférencier international, Cloud Identity Summit (Francfort, 3 nov. 2026)",
      description: "\u201cYour CI/CD Pipeline Is Over-Privileged: Identity Risks in Modern Cloud Platforms\u201d",
    },
    {
      period: "2023",
      title: "Vainqueur national, Huawei ICT Competition, Network Track, Tunisie",
    },
    {
      period: "2019-2025",
      title: "Hackathons & leadership",
      description:
        "Vainqueur de plusieurs hackathons universitaires et compétitions techniques ; postes de responsabilité dans des clubs et organisations universitaires.",
    },
  ],

  education: [
    {
      school: "Philipps-Universität Marburg / Hochschule Schmalkalden, Allemagne",
      degree: "Programme d'échange, Informatique",
      start: "2024",
      end: "2026",
      logoUrl: "/hsm.png",
      href: "https://www.hs-schmalkalden.de/",
    },
    {
      school: "TEK-UP University, Tunisie",
      degree: "Diplôme d'ingénieur, Sécurité des réseaux et des systèmes",
      start: "2022",
      end: "juin 2026",
      logoUrl: "/TEK-UP.png",
      href: "https://tek-up.de/",
    },
    {
      school: "Institut Supérieur des Études Technologiques de Radès (ISET Radès), Tunisie",
      degree: "Licence, Administration des réseaux et des systèmes",
      start: "2019",
      end: "juin 2022",
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
      name: "Certified Kubernetes Security Specialist (CKS) - examen très prochainement",
      logo: "/certs/cks.png",
      inProgress: true,
    },
    {
      name: "Prochain objectif : titre Kubestronaut (les cinq certifications Kubernetes)",
      logo: "/certs/kubestronaut.png",
      inProgress: true,
    },
  ],
  certificationsFootnote:
    "Prochain objectif : le titre Kubestronaut - les cinq certifications Kubernetes d'ici la fin du prochain trimestre.",

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
        "Kubernetes Operators (CRDs, contrôleurs)", "OpenShift/OKD", "Helm", "Kustomize",
        "GitOps", "ArgoCD", "Terraform", "Ansible", "Puppet", "Chef",
        "HashiCorp Vault", "Nexus", "Vagrant", "npm",
      ],
    },
    {
      label: "Sécurité cloud-native",
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
      label: "Réseaux",
      skills: ["VLAN", "Routage", "DNS", "DHCP", "VPN", "BGP", "OSPF"],
    },
    {
      label: "Documentation & Reporting",
      skills: ["LaTeX (Overleaf, TeXShop)", "Microsoft Word", "PowerPoint", "Excel"],
    },
    {
      label: "Langages & Scripting",
      skills: ["Python", "Go", "C", "Java", "Bash", "PowerShell", "SQL", "YAML", "HCL", "Jsonnet"],
    },
  ],

  work: [
    {
      company: "NoLimits Embedded",
      title: "Stagiaire DevSecOps / Cloud Engineering",
      start: "nov. 2025",
      end: "mai 2026",
      logoUrl: "/Freelance.png",
      description: [
        "Conception d'une plateforme DevSecOps Kubernetes de niveau production sur AWS : infrastructure as code, CI/CD automatisée, déploiement GitOps, contrôles de sécurité intégrés et observabilité.",
      ],
    },
    {
      company: "Freelance",
      title: "Ingénieur DevSecOps freelance",
      location: "Tunis, Tunisie",
      start: "2022",
      end: "mai 2025",
      logoUrl: "/Freelance.png",
      description: [
        "Solutions DevOps, cloud, sécurité et réseau livrées à plus de 15 clients, améliorant l'efficacité et la sécurité des infrastructures.",
        "Optimisation de plus de 10 pipelines CI/CD, automatisation des déploiements et réduction des délais de mise en production de 30 %.",
        "Configuration de plus de 50 serveurs Windows et systèmes IIS, ainsi que de routeurs, switches et pare-feux, garantissant stabilité et sécurité du réseau.",
        "Administration d'une stack de monitoring (Grafana, Prometheus, Elasticsearch), améliorant l'observabilité de 40 %.",
        "Mise en place d'un SOC et de Bitwarden, centralisant la supervision des événements et la gestion des mots de passe pour 5 clients.",
        "Pilotage de 2 projets de migration Azure Hybrid sur les environnements de développement, pré-production et production.",
        "Taux de résolution SLA de 95 % sur les tickets de support, avec production complète de documentation, manuels utilisateur et runbooks.",
      ],
    },
    {
      company: "TEK-UP University",
      title: "Stagiaire administration systèmes",
      location: "Ariana, Tunisie",
      start: "juil. 2024",
      end: "août 2024",
      logoUrl: "/TEK-UP.png",
      href: "https://tek-up.de/",
      description: [
        "Stage de deux mois axé sur les formations RHCSA, RHCE et Kubernetes ; expérience pratique de Linux et de la gestion de conteneurs.",
      ],
    },
    {
      company: "Taskin Enterprise",
      title: "Stagiaire développement logiciel",
      location: "Korba, Tunisie",
      start: "juil. 2023",
      end: "sept. 2023",
      logoUrl: "/Taskin.png",
      description: [
        "Développement de fonctionnalités backend pour un site immobilier (NodeJS, MySQL), augmentant la vitesse des transactions de 20 %.",
        "Conception et exécution de stratégies de déploiement sur AWS avec Terraform, Ansible et Jenkins, réduisant les déploiements manuels de 50 %.",
      ],
    },
    {
      company: "Blue IT",
      title: "Stagiaire sécurité réseau - projet de fin d'études",
      location: "Tunis, Tunisie",
      start: "janv. 2022",
      end: "juil. 2022",
      logoUrl: "/BlueIT.png",
      description: [
        "Déploiement d'un réseau Wi-Fi sécurisé avec des équipements Huawei ; mise en place d'une authentification par portail captif et d'une segmentation VLAN.",
      ],
    },
    {
      company: "La Poste Tunisienne",
      title: "Stagiaire ingénierie réseau",
      location: "Tunis, Tunisie",
      start: "juil. 2022",
      end: "août 2022",
      logoUrl: "/Poste.jpg",
      href: "https://www.poste.tn/",
      description: [
        "Conception d'un prototype d'architecture réseau cœur intégrant VPN et OSPF pour un routage sécurisé et efficace.",
      ],
    },
    {
      company: "Tunisie Telecom",
      title: "Stagiaire infrastructure IT",
      location: "Ben Arous, Tunisie",
      start: "févr. 2021",
      end: "mars 2021",
      logoUrl: "/TT.png",
      href: "https://www.tunisietelecom.tn/",
      description: [
        "Maintenance de la salle serveurs et coordination de l'installation de plus de 100 nouvelles connexions internet clients.",
      ],
    },
    {
      company: "SOFIA Technology",
      title: "Stagiaire support IT",
      location: "Ariana, Tunisie",
      start: "févr. 2020",
      end: "mars 2020",
      logoUrl: "/Sofia-tech.png",
      href: "https://sofia-technologies.com/",
      description: [
        "Participation aux opérations IT quotidiennes, y compris le dépannage des postes de travail et du réseau.",
      ],
    },
  ],

  projects: [
    {
      title: "ProjectClaim",
      href: "https://github.com/mella7/ProjectClaim",
      dates: "2026",
      description:
        "Un opérateur Kubernetes développé de zéro sur OKD/OpenShift : CRD personnalisées, reconciler, suppression par finalizer, règles d'immutabilité CEL et logique CreateOrUpdate idempotente.",
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
        "Une réimplémentation depuis zéro des fondamentaux du réseau conteneurisé : namespaces Linux, paires veth, bridges et NAT iptables, couverte par une suite de 14 tests pytest.",
      technologies: ["Python", "Namespaces Linux", "veth", "iptables", "Réseaux", "pytest"],
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
        "Un portail de provisionnement CloudStack full-stack : canevas React Flow en glisser-déposer, backend FastAPI, génération Terraform, streaming SSE des logs et console VNC, testé de bout en bout sur un cluster physique réel de 4 nœuds.",
      technologies: ["FastAPI", "React", "TypeScript", "Terraform", "CloudStack", "SSE"],
      image: "",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/cloudstack-dc", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "KubeAudit",
      href: "https://github.com/mella7/KubeAudit",
      dates: "mai 2024",
      description:
        "Un outil d'audit pour clusters Kubernetes : identification des failles de sécurité, application des bonnes pratiques et conformité aux standards de sécurité.",
      technologies: ["Kubernetes", "Ansible", "Go", "YAML", "Bash", "Kind", "Docker", "ELK"],
      image: "/Projects/KubeAudit.png",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/KubeAudit", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "DevSecOps Security Suite",
      href: "https://github.com/mella7/DevSecOps-Security-Suite",
      dates: "juin 2024 - juil. 2024",
      description:
        "Une suite de sécurité complète pour les workflows DevSecOps, renforçant la sécurité des pipelines CI/CD, de l'infrastructure as code et de l'exécution applicative.",
      technologies: ["Docker", "Kubernetes", "Ansible", "OWASP ZAP", "Grafana", "Prometheus", "ELK Stack"],
      image: "/Projects/DevsecopsSuite.png",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/DevSecOps-Security-Suite", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "GuardianX",
      href: "https://github.com/mella7/GuardianX",
      dates: "mai - juin 2023",
      description:
        "Un outil cloud-native de détection et de réponse aux menaces, offrant des analyses de sécurité en temps réel et des alertes pour les infrastructures cloud.",
      technologies: ["Python", "AWS Lambda", "CloudFormation", "VirusTotal API", "ElasticSearch", "Flask"],
      image: "/Projects/GuardianX.jpeg",
      links: [
        { type: "GitHub", href: "https://github.com/mella7/GuardianX", icon: <Icons.github className="size-3" /> },
      ],
    },
    {
      title: "SecureDiscord",
      href: "https://github.com/mella7/SecureDiscord",
      dates: "sept. - nov. 2023",
      description:
        "Un bot Discord axé sécurité : threat intelligence, analyse de liens et alertes en temps réel pour protéger les communautés.",
      technologies: ["Git", "LDAP", "RabbitMQ", "SQLite", "Kubernetes", "Docker", "Flask"],
      image: "/Projects/SecureDiscord.jpeg",
      links: [
        {
          type: "Vidéo de démo",
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
      event: "ContainerDays Hambourg 2026",
      date: "2026",
      location: "Hambourg, Allemagne",
      talkTitle: "How Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals",
      description:
        "Un retour de terrain sur les schémas d'attaque réels visant les clusters Kubernetes, et sur la façon dont les signaux runtime issus d'eBPF les révèlent avant qu'ils ne deviennent des incidents.",
      abstract:
        "Votre pipeline est au vert. Tous les scans d'images sont passés, tous les contrôles de politique aussi, l'admission controller a validé. Et votre cluster se fait quand même compromettre à l'exécution. Cette session suit Alex, un platform engineer dont les contrôles au build ont tout fait correctement et ont pourtant laissé passer l'essentiel. Nous examinons comment les clusters échouent réellement sous attaque : reverse shells ouverts depuis un conteneur en cours d'exécution, élévation de privilèges qui ne touche jamais l'API server, exécution de processus pour laquelle personne n'a écrit de politique. Puis nous regardons eBPF les détecter. Avec Tetragon, nous déroulons une démonstration en direct en deux actes : d'abord la détection d'un reverse shell et d'une élévation de privilèges en temps réel, ensuite la transformation de ces mêmes détections en enforcement, pour que la tentative suivante n'aboutisse jamais. Le message n'est pas que les contrôles préventifs sont inutiles, mais qu'ils ne racontent que la moitié de l'histoire. Les signaux runtime sont ce qui distingue un cluster sécurisé d'un cluster qui n'a simplement pas encore été attaqué.",
      href: "https://www.containerdays.io/",
      upcoming: true,
      slidesDir: "/talks/slides/containerdays-2026-ebpf",
      slideCount: 56,
      slidesUrl: "/talks/slides/containerdays-2026-ebpf.pdf",
      venue: {
        name: "Schuppen 52",
        description:
          "Ancien hangar à marchandises classé du port de Hambourg, construit entre 1908 et 1912, aujourd'hui l'un des plus grands lieux événementiels de la ville.",
        address: "Schuppen 52, Australiastrasse 52, 20457 Hambourg, Allemagne",
      },
    },
    {
      slug: "cloud-identity-summit-2026-cicd",
      event: "Cloud Identity Summit",
      date: "3 nov. 2026",
      location: "Francfort, Allemagne",
      talkTitle: "Your CI/CD Pipeline Is Over-Privileged: Identity Risks in Modern Cloud Platforms",
      description:
        "Pourquoi les identités de pipeline sont les comptes les plus sur-privilégiés de la plupart des organisations, et comment réduire le rayon d'impact des identifiants CI/CD.",
      abstract:
        "La plupart des organisations consacrent des efforts considérables à l'identité humaine : SSO, MFA, moindre privilège, revues d'accès trimestrielles. Pendant ce temps, le compte de service CI/CD détient discrètement cluster-admin, une clé cloud à longue durée de vie et un accès en écriture à la production. Personne ne le vérifie, parce que personne ne considère un pipeline comme une identité. Cette conférence défend l'idée que votre pipeline est le principal le plus sur-privilégié de votre plateforme, et le moins surveillé. Nous verrons comment ces permissions s'accumulent, ce qu'un attaquant fait d'un runner compromis, et pourquoi la seule rotation des secrets ne règle pas le problème. Puis nous examinerons ce qui réduit réellement le rayon d'impact : une identité de charge de travail à courte durée de vie plutôt que des clés statiques, des identifiants cloisonnés par environnement plutôt que par pipeline, et une identité de pipeline auditée au même rythme que les accès humains.",
      upcoming: true,
    },
  ],

  languages: [
    { name: "Anglais", level: "C1+, certifié par l'examen onSET" },
    { name: "Français", level: "B2+ (courant)" },
    { name: "Allemand", level: "A2 (en cours d'apprentissage)" },
    { name: "Arabe", level: "Langue maternelle" },
  ],

  interests: ["Sport", "Technologie & informatique", "Voyages", "Engagement associatif", "Hackathons"],
};
