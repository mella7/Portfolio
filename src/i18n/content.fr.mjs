// French version of src/data/content.mjs. Only the text that changes is
// here; everything else (links, images, stacks, names) comes from the
// English file. Lists are matched by position, or by slug / file / short
// name where the English item has one.

export default {
  site: {
    description:
      "Mohamed Ali Mellah construit des plateformes Kubernetes et les sécurise : opérateurs en Go, livraison GitOps, identité cloud et détection eBPF à l'exécution. CKA, CKAD, RHCSA.",
    jobTitle: "Ingénieur cloud-native et Kubernetes",
    location: { label: "Munich, Allemagne", country: "Allemagne", note: "Ouvert à la mobilité" },
    now: { text: "Je cherche un poste en DevSecOps ou en Cloud Engineering." },
  },

  intro: {
    headline: ["Je construis des plateformes Kubernetes, puis j'essaie de les ", "casser", "."],
    afterName:
      "ingénieur cloud-native et Kubernetes. Je travaille sur les plateformes, l'identité cloud et la sécurité à l'exécution : opérateurs en Go, livraison GitOps et détection eBPF avec Tetragon. Certifié CKA, CKAD et RHCSA, CKS en cours.",
    paragraphs: [
      "Je suis ingénieur cloud-native et Kubernetes. Je travaille sur les plateformes, l'identité cloud et la sécurité à l'exécution : opérateurs en Go, livraison GitOps et détection eBPF avec Tetragon. Certifié CKA, CKAD et RHCSA, CKS en cours.",
      "En 2026, j'ai donné des conférences à ContainerDays Hamburg et au Cloud Identity Summit, et j'ai remporté le 1er prix mondial de la Huawei ICT Competition à Shenzhen, face à plus de 220 000 participants de plus de 2 000 universités dans plus de 100 pays. Je cherche un poste en DevOps, DevSecOps ou Platform Engineering.",
    ],
    notice: "Envie de me contacter ? Écrivez-moi via le formulaire plus bas.",
  },

  pillars: [
    { title: "Plateformes", text: "Clusters Kubernetes et OpenShift, opérateurs en Go, Helm et Argo CD pour la livraison GitOps." },
    { title: "Sécurité", text: "Détection à l'exécution avec eBPF (Tetragon, Falco), politiques d'admission avec Kyverno, scans dans chaque pipeline." },
    { title: "Automatisation", text: "Terraform et Ansible sur tous les environnements, une CI/CD qui bloque le build dès qu'une faille HIGH ou CRITICAL apparaît." },
  ],

  talks: {
    "cloud-identity-summit-2026-cicd": {
      date: "3 nov. 2026",
      location: "Francfort, Allemagne",
      description:
        "Les identités des pipelines ont souvent plus d'accès que n'importe qui dans l'entreprise, et c'est pourtant elles qu'on surveille le moins. Comment elles se font compromettre, comment les auditer avec cinq questions, et comment les corriger avec des outils que vous avez déjà.",
      abstract: `La plupart des entreprises investissent beaucoup dans l'identité des humains : MFA, accès conditionnel, PIM, revues d'accès. Le pipeline qui déploie en production, lui, n'a en général droit à rien de tout ça. Il tourne avec un service principal qui a les droits Owner, un secret client que personne n'a jamais renouvelé, et parfois le jeton personnel d'un développeur qui fait le travail d'une machine. Les attaquants le savent, et les secrets qui fuient restent souvent valides pendant des années.

La conférence se déroule en six parties. D'abord, pourquoi les attaquants visent les pipelines, avec des chiffres récents sur les compromissions d'identités non humaines et les fuites de secrets. Ensuite, pourquoi les programmes d'identité pensés pour les personnes perdent la trace des machines : aucun système RH ne vous dit à qui appartient une identité de déploiement ni quand la supprimer. Troisième partie, ce qui tourne mal, en partant des deux questions que pose toute identité de pipeline (quel workflow peut obtenir des identifiants, et que peut-il en faire), puis les secrets statiques, les comptes de service trop larges et les workflows sans restriction, et comment un pipeline tout à fait ordinaire coche la plupart des cases du Top 10 OWASP des identités non humaines.

Quatrième partie, l'audit : réduire des centaines d'identités à une courte liste, puis poser cinq questions à chacune. À qui appartient-elle, que peut-elle faire, quand est-elle active, d'où peut-elle être utilisée, et pourquoi existe-t-elle. Cinquième partie, les corrections avec des outils que vous avez déjà : identités managées et fédération d'identité de workload au lieu de secrets stockés, une confiance OIDC bien délimitée, des rôles au moindre privilège, l'accès conditionnel pour les identités de workload, quelques requêtes de détection à planifier, et la sortie de la CI du cluster grâce au GitOps.

Pour finir, un regard sur les agents IA qui tournent désormais dans les pipelines avec le jeton du job, et une courte liste de choses à faire dès lundi.`,
    },
    "containerdays-2026-ebpf": {
      date: "2-4 sept. 2026",
      location: "Hambourg, Allemagne",
      description:
        "Un retour de terrain sur de vraies attaques contre des clusters Kubernetes, et comment les signaux eBPF à l'exécution les révèlent avant qu'elles ne deviennent des incidents.",
      abstract: `Votre pipeline est au vert. Chaque scan d'image est passé, chaque contrôle de politique aussi, l'admission controller a tout validé. Et pourtant votre cluster se fait compromettre à l'exécution. Cette session suit Dev, un platform engineer dont les contrôles au build ont tout fait correctement et ont quand même raté l'essentiel. On regarde comment les clusters tombent vraiment sous une attaque : des reverse shells ouverts depuis un conteneur qui tourne, une élévation de privilèges qui ne passe jamais par l'API server, des exécutions de processus pour lesquelles personne n'a écrit de politique. Puis on regarde eBPF les attraper. Avec Tetragon, on déroule une démo en direct en deux actes : d'abord détecter un reverse shell et une élévation de privilèges au moment où ils se produisent, puis transformer ces mêmes détections en blocage pour que la tentative suivante n'aboutisse jamais. Le message n'est pas que les contrôles préventifs ne servent à rien, mais qu'ils ne racontent que la moitié de l'histoire. Ce sont les signaux à l'exécution qui font la différence entre un cluster sécurisé et un cluster qui n'a simplement pas encore été attaqué.`,
      venue: { note: "Un ancien hangar de marchandises classé monument historique, dans le port de Hambourg, construit entre 1908 et 1912." },
    },
  },

  highlights: [
    {
      mark: "1er",
      meta: "2025-26 · Shenzhen, Chine",
      title: "1er prix mondial, Huawei ICT Competition",
      text: "Catégorie Computing. Premier sur plus de 220 000 participants de plus de 2 000 universités dans plus de 100 pays, après avoir remporté la finale nationale en Tunisie et la finale régionale MENA.",
      cta: "Voir les photos",
    },
    {
      meta: "2-4 sept. 2026 · ContainerDays Hamburg",
      title: "Comment les clusters tombent sous une attaque, et comment on le détecte à l'exécution",
      text: "Une démo Tetragon en direct en deux actes : détecter un reverse shell et une élévation de privilèges, puis transformer ces détections en blocage.",
      cta: "Lire les 56 slides",
    },
    {
      meta: "3 nov. 2026 · Cloud Identity Summit, Francfort",
      title: "Votre pipeline CI/CD a trop de droits",
      text: "Comment les identités des pipelines se font compromettre, comment les auditer avec cinq questions, et comment les corriger avec des outils que vous avez déjà.",
      cta: "Lire les 73 slides",
    },
  ],

  projects: {
    projectclaim: {
      highlight: "Opérateur écrit de zéro",
      description:
        "Un opérateur Kubernetes pour des namespaces multi-tenant en libre-service sur OpenShift et Kubernetes. Un ProjectClaim en entrée, un namespace encadré en sortie : chaque équipe reçoit son quota, son RBAC et son isolation réseau. Écrit de zéro avec des CRD, des finalizers et des règles d'immutabilité en CEL.",
    },
    "container-networking": {
      highlight: "14 tests",
      description:
        "Ce que docker0 fait automatiquement, refait à la main avec les briques Linux de base : namespaces, paires veth, un bridge et du NAT iptables. Vérifié par une suite pytest de 14 cas et suivi saut par saut avec tcpdump.",
    },
    "cloudstack-dc": {
      highlight: "Cluster de 4 nœuds",
      description:
        "Concevoir des environnements CloudStack complets sur un canevas : réseaux, machines, pare-feu, load balancers. Le portail génère le Terraform, affiche le plan et l'applique après validation, avec les logs en direct et une console VNC. Testé sur un vrai cluster physique de 4 nœuds.",
    },
    kubeaudit: {
      description:
        "Un outil d'audit qui repère les failles de sécurité dans les clusters Kubernetes, applique les bonnes pratiques et vérifie la conformité aux standards de sécurité.",
    },
    "devsecops-suite": {
      description: "La sécurité sur toute la chaîne de livraison : scans dans le pipeline CI/CD, vérification de l'infrastructure as code et surveillance à l'exécution.",
    },
    guardianx: {
      description: "Détection et réponse aux menaces cloud-native pour AWS, avec une vision sécurité en temps réel et des alertes.",
    },
    securediscord: {
      description:
        "Un bot Discord orienté sécurité : renseignement sur les menaces, analyse des liens et alertes en temps réel pour protéger les communautés.",
    },
  },

  experience: [
    {
      title: "Stagiaire DevSecOps / Cloud Engineering",
      start: "nov. 2025",
      end: "mai 2026",
      location: "À distance",
      points: [
        "Projet de fin d'études d'ingénieur : construction d'une plateforme DevSecOps sur AWS pour une application conteneurisée en trois tiers (React, API backend, MongoDB).",
        "Provisionnement du VPC et d'un bastion EC2 avec Terraform (state distant sur S3, appliqué via GitHub Actions), et d'un cluster Amazon EKS auto-scalable (2 à 4 nœuds) avec eksctl, IRSA et l'AWS Load Balancer Controller.",
        "Mise en place d'un pipeline GitHub Actions avec SonarCloud (SAST), Snyk (dépendances) et Trivy (images), qui bloque tout build avec une faille HIGH ou CRITICAL avant que l'image ne soit poussée.",
        "Déploiement GitOps avec Argo CD : le pipeline commit le nouveau tag d'image et Argo CD synchronise le cluster, exposé via un ALB et Route 53.",
        "Dev, test et prod sous forme de namespaces dans un seul cluster EKS pour ne pas tripler la facture AWS ; Prometheus et Grafana déployés avec Helm.",
        "Prototypes de durcissement à l'exécution et par politique : Falco avec alertes Slack, politiques d'admission Kyverno, et External Secrets Operator avec AWS Secrets Manager.",
      ],
    },
    {
      company: "Freelance",
      title: "Ingénieur DevOps (temps partiel)",
      start: "nov. 2022",
      end: "mai 2025",
      location: "Tunis, Tunisie / À distance",
      points: [
        "Missions DevOps pour des petites entreprises et des agences (environ 8 clients).",
        "Création et maintenance de pipelines CI/CD sous GitLab CI et Jenkins (build, tests, scan des images avec Trivy, déploiement), à la place des déploiements manuels.",
        "Participation à deux migrations d'infrastructures sur site vers Azure, avec des environnements de dev et de production séparés.",
        "Mise en place du monitoring Prometheus et Grafana avec alertes, et d'ELK pour centraliser les logs.",
        "Traitement des tickets de support, rédaction de runbooks et de documentation de passation pour chaque client.",
      ],
    },
    {
      title: "Stagiaire en administration systèmes",
      start: "juil. 2024",
      end: "août 2024",
      points: ["Stage de deux mois centré sur la préparation RHCSA, RHCE et Kubernetes, en pratique sur Linux et les conteneurs."],
    },
    {
      title: "Stagiaire en développement logiciel",
      start: "juil. 2023",
      end: "sept. 2023",
      points: [
        "Développement de fonctionnalités backend pour un site immobilier (Node.js, MySQL), avec des transactions 20 % plus rapides.",
        "Conception et exécution des déploiements sur AWS avec Terraform, Ansible et Jenkins, avec deux fois moins de déploiements manuels.",
      ],
    },
    {
      title: "4 stages précédents",
      points: [
        "Sécurité réseau, infrastructure et support informatique : VPN et routage OSPF, déploiement d'un Wi-Fi sécurisé, exploitation d'une salle serveurs.",
      ],
    },
  ],

  education: [
    { degree: "Études en échange (sans diplôme), informatique", school: "HS Schmalkalden, Uni Marburg, Uni Passau · Allemagne", period: "avr. 2025 - oct. 2027" },
    { degree: "Diplôme d'ingénieur (niveau master), sécurité des réseaux et des systèmes", school: "TEK-UP University · Tunisie", period: "sept. 2022 - juin 2026" },
    { degree: "Licence, administration des réseaux et des systèmes", school: "ISET Radès · Tunisie", period: "sept. 2019 - juin 2022" },
  ],

  languages: [
    { name: "Arabe", level: "Langue maternelle" },
    { name: "Anglais", level: "C1+" },
    { name: "Français", level: "C1" },
    { name: "Allemand", level: "A2, en apprentissage" },
  ],

  awards: [
    { title: "1er prix mondial, Huawei ICT Competition, catégorie Computing (Shenzhen) : plus de 220 000 participants, 2 000 universités, 100 pays" },
    { title: "Speaker international, ContainerDays Hamburg et Cloud Identity Summit" },
    { title: "Vainqueur national, Huawei ICT Competition, catégorie Network, Tunisie" },
    { title: "Plusieurs hackathons universitaires gagnés ; responsabilités dans des clubs étudiants" },
  ],

  figures: [
    { suffix: "er", label: "Prix mondial, Huawei ICT Competition : plus de 220 000 participants, 2 000 universités, 100 pays" },
    { label: "Conférences internationales en 2026" },
    { label: "Certifications, dont CKA, CKAD et RHCSA" },
    { label: "Classement sur TryHackMe" },
  ],

  stack: [
    { group: "Kubernetes et plateformes" },
    { group: "Cloud" },
    { group: "Sécurité" },
    { group: "IaC et CI/CD" },
    { group: "Observabilité" },
    { group: "Langages" },
  ],

  certifications: {
    Kubestronaut: { name: "Kubestronaut (les cinq certifications Kubernetes)" },
  },

  moments: {
    "containerdays-audience": "Devant une salle pleine à ContainerDays Hamburg 2026",
    "containerdays-stage": "Sur scène à ContainerDays Hamburg avec ma conférence sur la sécurité eBPF à l'exécution",
    "containerdays-session-screen": "Salle 4 à ContainerDays : How Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals",
    "cloud-identity-summit-talk": "Présentation de « Your CI/CD Pipeline Is Over-Privileged » au Cloud Identity Summit 2026, Francfort",
    "cloud-identity-summit-speaker": "Présentation du speaker au Cloud Identity Summit 2026",
    "huawei-global-first-prize": "Médaille d'or et drapeau tunisien à la finale mondiale de la Huawei ICT Competition 2025-26, Shenzhen",
    "huawei-computing-track-first-prize": "Sur scène au moment de l'annonce du premier prix de la catégorie Computing",
    "huawei-award-ceremony-stage": "Remise de la médaille, avec le nom de l'équipe TEK-UP à l'écran",
    "huawei-global-final-shenzhen": "Devant le décor de la finale mondiale à Shenzhen",
    "huawei-tunisia-team": "La délégation tunisienne à la cérémonie de clôture",
    "huawei-medals": "L'équipe TEK-UP avec ses médailles",
    "tekup-graduation": "Remise des diplômes à TEK-UP University",
    "tekup-graduation-team": "Remise des diplômes avec les amis",
    "huawei-2022-prize": "Prix de la Huawei ICT Competition 2022-23",
    "certificate-handover": "Remise d'un certificat",
    "jci-panel": "Table ronde avec la JCI (Jeune Chambre Économique) Centre Urbain Nord",
    "enactus-make-it-real": "Avec l'équipe Enactus à Make It Real",
    "ost-family-gathering": "Rencontre de la famille OST",
    "conference-badge": "Jour de conférence",
    "portrait-badge": "Jour d'événement",
    "group-photo-1": "Club universitaire",
    "group-photo-2": "Club universitaire",
    "group-photo-3": "Sortie du club universitaire",
  },
};
