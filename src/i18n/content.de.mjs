// German version of src/data/content.mjs. Only the text that changes is
// here; everything else (links, images, stacks, names) comes from the
// English file. Lists are matched by position, or by slug / file / short
// name where the English item has one.

export default {
  site: {
    description:
      "Mohamed Ali Mellah baut Kubernetes-Plattformen und sichert sie ab: Operatoren in Go, GitOps-Delivery, Cloud-Identitäten und eBPF-Erkennung zur Laufzeit. CKA, CKAD, RHCSA.",
    jobTitle: "Cloud-Native- und Kubernetes-Engineer",
    location: { label: "München, Deutschland", country: "Deutschland", note: "Offen für einen Umzug" },
    now: { text: "Ich suche eine Stelle im Bereich DevSecOps oder Cloud Engineering." },
  },

  intro: {
    headline: ["Ich baue Kubernetes-Plattformen und versuche dann, sie zu ", "knacken", "."],
    afterName:
      "Cloud-Native- und Kubernetes-Engineer. Ich arbeite an Plattformen, Cloud-Identitäten und Laufzeit-Security: Operatoren in Go, GitOps-Delivery und eBPF-Erkennung mit Tetragon. Zertifiziert als CKA, CKAD und RHCSA, das CKS ist in Arbeit.",
    paragraphs: [
      "Ich bin Cloud-Native- und Kubernetes-Engineer und arbeite an Plattformen, Cloud-Identitäten und Laufzeit-Security: Operatoren in Go, GitOps-Delivery und eBPF-Erkennung mit Tetragon. Zertifiziert als CKA, CKAD und RHCSA, das CKS ist in Arbeit.",
      "2026 habe ich auf den ContainerDays Hamburg und dem Cloud Identity Summit gesprochen und in Shenzhen den globalen 1. Platz beim Huawei ICT Competition gewonnen, unter mehr als 220.000 Teilnehmenden von über 2.000 Hochschulen aus über 100 Ländern. Ich suche eine Stelle in DevOps, DevSecOps oder Platform Engineering.",
    ],
    notice: "Sie möchten mich erreichen? Schreiben Sie mir einfach über das Formular unten.",
  },

  pillars: [
    { title: "Plattformen", text: "Kubernetes- und OpenShift-Cluster, Operatoren in Go, Helm und Argo CD für GitOps-Delivery." },
    { title: "Security", text: "Laufzeit-Erkennung mit eBPF (Tetragon, Falco), Admission Policies mit Kyverno, Scans in jeder Pipeline." },
    { title: "Automatisierung", text: "Terraform und Ansible über alle Umgebungen, CI/CD, die den Build bei HIGH- oder CRITICAL-Funden stoppt." },
  ],

  talks: {
    "cloud-identity-summit-2026-cicd": {
      date: "3. Nov. 2026",
      location: "Frankfurt am Main",
      description:
        "Pipeline-Identitäten haben oft mehr Zugriff als fast alles andere im Unternehmen und werden trotzdem am wenigsten kontrolliert. Wie sie kompromittiert werden, wie man sie mit fünf Fragen prüft und wie man sie mit Mitteln behebt, die man schon hat.",
      abstract: `Die meisten Unternehmen stecken viel Arbeit in menschliche Identitäten: MFA, Conditional Access, PIM, Access Reviews. Die Pipeline, die in Produktion deployt, bekommt davon meistens nichts ab. Sie läuft mit einem Service Principal mit Owner-Rechten, einem Client Secret, das nie jemand rotiert hat, und manchmal mit dem persönlichen Token eines Entwicklers, der die Arbeit einer Maschine erledigt. Angreifer wissen das, und geleakte Secrets bleiben oft jahrelang gültig.

Der Vortrag hat sechs Teile. Erstens: warum Angreifer es auf Pipelines abgesehen haben, mit aktuellen Zahlen zu Vorfällen mit nicht-menschlichen Identitäten und zu geleakten Secrets. Zweitens: warum Identitätsprogramme, die für Menschen gebaut sind, Maschinen aus den Augen verlieren. Es gibt kein HR-System, das einem sagt, wem eine Deploy-Identität gehört oder wann sie gelöscht werden sollte. Drittens: was schiefgeht, ausgehend von den zwei Fragen, die jede Pipeline-Identität hat (welcher Workflow darf Zugangsdaten bekommen, und was darf er damit tun), dann statische Secrets, zu weit gefasste Service Accounts und Workflows ohne Einschränkung, und wie eine ganz normale Pipeline die meisten Punkte der OWASP Non-Human Identities Top 10 erfüllt.

Viertens: die Prüfung. Hunderte Identitäten auf eine kurze Liste eingrenzen und jeder davon fünf Fragen stellen: Wem gehört sie, was darf sie, wann ist sie aktiv, von wo aus kann sie genutzt werden, und warum gibt es sie. Fünftens: die Behebung mit Mitteln, die man schon hat. Managed Identities und Workload Identity Federation statt gespeicherter Secrets, eng gefasstes OIDC-Vertrauen, Rollen nach dem Least-Privilege-Prinzip, Conditional Access für Workload-Identitäten, ein paar Erkennungsabfragen, die man einplanen sollte, und CI mit GitOps aus dem Cluster herausholen.

Zum Schluss geht es um KI-Agenten, die inzwischen mit dem Token des Jobs in Pipelines laufen, und um eine kurze Liste mit Dingen für Montag.`,
    },
    "containerdays-2026-ebpf": {
      date: "2.-4. Sep. 2026",
      location: "Hamburg",
      description:
        "Ein Praxisbericht über echte Angriffsmuster gegen Kubernetes-Cluster und wie eBPF-Signale zur Laufzeit sie sichtbar machen, bevor daraus Vorfälle werden.",
      abstract: `Die Pipeline ist grün. Jeder Image-Scan ist durchgelaufen, jede Policy-Prüfung auch, der Admission Controller hat alles abgesegnet. Und trotzdem wird der Cluster zur Laufzeit übernommen. Diese Session begleitet Dev, einen Platform Engineer, dessen Kontrollen beim Build alles richtig gemacht und trotzdem das Entscheidende übersehen haben. Wir schauen uns an, wie Cluster unter einem Angriff wirklich versagen: Reverse Shells aus einem laufenden Container, Privilege Escalation, die nie den API-Server berührt, und Prozessausführungen, für die niemand eine Policy geschrieben hat. Dann sehen wir zu, wie eBPF sie erwischt. Mit Tetragon zeigen wir eine Live-Demo in zwei Akten: zuerst eine Reverse Shell und eine Privilege Escalation erkennen, während sie passieren, dann genau diese Erkennungen in Enforcement umwandeln, damit der nächste Versuch gar nicht erst durchkommt. Die Botschaft ist nicht, dass präventive Kontrollen nutzlos sind, sondern dass sie nur die halbe Geschichte erzählen. Erst die Signale zur Laufzeit zeigen den Unterschied zwischen einem Cluster, der sicher ist, und einem, der bloß noch nicht angegriffen wurde.`,
      venue: { note: "Ein denkmalgeschützter ehemaliger Kaischuppen im Hamburger Hafen, gebaut zwischen 1908 und 1912." },
    },
  },

  highlights: [
    {
      mark: "1.",
      meta: "2025-26 · Shenzhen, China",
      title: "Globaler 1. Platz, Huawei ICT Competition",
      text: "Computing Track. Platz eins unter mehr als 220.000 Teilnehmenden von über 2.000 Hochschulen aus über 100 Ländern, nach dem Sieg im nationalen Finale in Tunesien und im regionalen MENA-Finale.",
      cta: "Zu den Fotos",
    },
    {
      meta: "2.-4. Sep. 2026 · ContainerDays Hamburg",
      title: "Wie Cluster unter Angriff versagen und wie wir es zur Laufzeit erkennen",
      text: "Eine Live-Demo mit Tetragon in zwei Akten: eine Reverse Shell und eine Privilege Escalation erkennen, dann die Erkennungen in Enforcement umwandeln.",
      cta: "Alle 56 Folien lesen",
    },
    {
      meta: "3. Nov. 2026 · Cloud Identity Summit, Frankfurt",
      title: "Ihre CI/CD-Pipeline hat zu viele Rechte",
      text: "Wie Pipeline-Identitäten kompromittiert werden, wie man sie mit fünf Fragen prüft und wie man sie mit Mitteln behebt, die man schon hat.",
      cta: "Alle 73 Folien lesen",
    },
  ],

  projects: {
    projectclaim: {
      highlight: "Operator von Grund auf",
      description:
        "Ein Kubernetes-Operator für mandantenfähige Namespaces als Self-Service auf OpenShift und Kubernetes. Ein ProjectClaim rein, ein geregelter Namespace raus: Jedes Team bekommt Quota, RBAC und Netzwerkisolation. Von Grund auf gebaut, mit eigenen CRDs, Finalizern und CEL-Regeln für unveränderliche Felder.",
    },
    "container-networking": {
      highlight: "14 Tests",
      description:
        "Was docker0 automatisch erledigt, von Hand nachgebaut mit Linux-Grundbausteinen: Namespaces, veth-Paare, eine Bridge und iptables-NAT. Geprüft mit einer pytest-Suite aus 14 Fällen und mit tcpdump Hop für Hop nachverfolgt.",
    },
    "cloudstack-dc": {
      highlight: "Cluster mit 4 Knoten",
      description:
        "Komplette CloudStack-Umgebungen auf einer Zeichenfläche entwerfen: Netzwerke, Maschinen, Firewalls, Load Balancer. Das Portal erzeugt das Terraform, zeigt den Plan und wendet ihn nach Freigabe an, mit Live-Logs und VNC-Konsole. Getestet auf einem echten physischen Cluster mit 4 Knoten.",
    },
    kubeaudit: {
      description:
        "Ein Audit-Tool, das Sicherheitslücken in Kubernetes-Clustern findet, Best Practices durchsetzt und die Einhaltung von Sicherheitsstandards prüft.",
    },
    "devsecops-suite": {
      description: "Security über die gesamte Delivery-Kette: Scans in der CI/CD-Pipeline, Prüfung von Infrastructure as Code und Überwachung zur Laufzeit.",
    },
    guardianx: {
      description: "Cloud-native Erkennung von und Reaktion auf Bedrohungen in AWS, mit Security-Einblicken in Echtzeit und Alarmierung.",
    },
    securediscord: {
      description:
        "Ein Discord-Bot mit Security-Funktionen: Threat Intelligence, Link-Prüfung und Echtzeit-Warnungen, damit Communities sicher bleiben.",
    },
  },

  experience: [
    {
      title: "Praktikant DevSecOps / Cloud Engineering",
      start: "Nov. 2025",
      end: "Mai 2026",
      location: "Remote",
      points: [
        "Abschlussprojekt des Ingenieurstudiums: Aufbau einer DevSecOps-Plattform auf AWS für eine containerisierte Drei-Schichten-Anwendung (React, Backend-API, MongoDB).",
        "VPC und EC2-Jump-Host mit Terraform bereitgestellt (Remote State in S3, über GitHub Actions angewendet), dazu ein automatisch skalierender Amazon-EKS-Cluster (2-4 Knoten) mit eksctl, IRSA und dem AWS Load Balancer Controller.",
        "GitHub-Actions-Pipeline mit SonarCloud (SAST), Snyk (Abhängigkeiten) und Trivy (Images) gebaut, die jeden Build mit HIGH- oder CRITICAL-Funden stoppt, bevor das Image gepusht wird.",
        "GitOps-Deployment mit Argo CD eingerichtet: Die Pipeline committet den neuen Image-Tag, Argo CD synchronisiert den Cluster, erreichbar über einen ALB und Route 53.",
        "Dev, Test und Prod als Namespaces in einem einzigen EKS-Cluster, um die AWS-Kosten nicht zu verdreifachen; Prometheus und Grafana mit Helm ausgerollt.",
        "Prototypen für Härtung zur Laufzeit und per Policy: Falco mit Slack-Alerts, Kyverno-Admission-Policies und External Secrets Operator mit AWS Secrets Manager.",
      ],
    },
    {
      company: "Freiberuflich",
      title: "DevOps Engineer (Teilzeit)",
      start: "Nov. 2022",
      end: "Mai 2025",
      location: "Tunis, Tunesien / Remote",
      points: [
        "DevOps-Aufträge für kleine Unternehmen und Agenturen (rund 8 Kunden).",
        "CI/CD-Pipelines in GitLab CI und Jenkins aufgebaut und betreut (Build, Tests, Image-Scans mit Trivy, Deployment), anstelle manueller Deployments.",
        "An zwei Migrationen von On-Premise nach Azure mitgearbeitet, mit getrennten Umgebungen für Entwicklung und Produktion.",
        "Monitoring mit Prometheus und Grafana samt Alerting eingerichtet, dazu ELK für zentrales Logging.",
        "Support-Tickets bearbeitet sowie Runbooks und Übergabedokumentation für jeden Kunden geschrieben.",
      ],
    },
    {
      title: "Praktikant Systemadministration",
      start: "Jul. 2024",
      end: "Aug. 2024",
      points: ["Zweimonatiges Praktikum mit Schwerpunkt auf RHCSA, RHCE und Kubernetes, praktisch mit Linux und Containern."],
    },
    {
      title: "Praktikant Softwareentwicklung",
      start: "Jul. 2023",
      end: "Sep. 2023",
      points: [
        "Backend-Funktionen für eine Immobilien-Website entwickelt (Node.js, MySQL), Transaktionen dadurch 20 % schneller.",
        "Deployments auf AWS mit Terraform, Ansible und Jenkins entworfen und betrieben, manuelle Deployments um die Hälfte reduziert.",
      ],
    },
    {
      title: "4 frühere Praktika",
      points: [
        "Netzwerksicherheit, Infrastruktur und IT-Support: VPN und OSPF-Routing, Aufbau eines sicheren WLANs, Betrieb eines Serverraums.",
      ],
    },
  ],

  education: [
    { degree: "Austauschstudium ohne Abschluss, Informatik", school: "HS Schmalkalden, Uni Marburg, Uni Passau · Deutschland", period: "Apr. 2025 - Okt. 2027" },
    { degree: "Ingenieurdiplom (Master-Niveau), Netzwerk- und Systemsicherheit", school: "TEK-UP University · Tunesien", period: "Sep. 2022 - Jun. 2026" },
    { degree: "Bachelor, Netzwerk- und Systemadministration", school: "ISET Radès · Tunesien", period: "Sep. 2019 - Jun. 2022" },
  ],

  languages: [
    { name: "Arabisch", level: "Muttersprache" },
    { name: "Englisch", level: "C1+" },
    { name: "Französisch", level: "C1" },
    { name: "Deutsch", level: "A2, lerne ich gerade" },
  ],

  awards: [
    { title: "Globaler 1. Platz, Huawei ICT Competition, Computing Track (Shenzhen): über 220.000 Teilnehmende, 2.000 Hochschulen, 100 Länder" },
    { title: "Internationaler Speaker, ContainerDays Hamburg und Cloud Identity Summit" },
    { title: "Nationaler Sieger, Huawei ICT Competition, Network Track, Tunesien" },
    { title: "Mehrere Hochschul-Hackathons gewonnen; leitende Rollen in Studierendenclubs" },
  ],

  figures: [
    { suffix: ".", label: "Platz weltweit, Huawei ICT Competition: über 220.000 Teilnehmende, 2.000 Hochschulen, 100 Länder" },
    { label: "Internationale Konferenzvorträge 2026" },
    { label: "Zertifikate, darunter CKA, CKAD und RHCSA" },
    { label: "Platzierung auf TryHackMe" },
  ],

  stack: [
    { group: "Kubernetes & Plattformen" },
    { group: "Cloud" },
    { group: "Security" },
    { group: "IaC & CI/CD" },
    { group: "Observability" },
    { group: "Sprachen" },
  ],

  certifications: {
    Kubestronaut: { name: "Kubestronaut (alle fünf Kubernetes-Zertifikate)" },
  },

  moments: {
    "containerdays-audience": "Vor vollem Saal auf den ContainerDays Hamburg 2026",
    "containerdays-stage": "Auf der Bühne der ContainerDays Hamburg mit meinem Vortrag zu eBPF-Laufzeit-Security",
    "containerdays-session-screen": "Raum 4 auf den ContainerDays: How Clusters Fail Under Attack and How We Detect It at Runtime with eBPF Signals",
    "cloud-identity-summit-talk": "Mein Vortrag „Your CI/CD Pipeline Is Over-Privileged“ auf dem Cloud Identity Summit 2026 in Frankfurt",
    "cloud-identity-summit-speaker": "Speaker-Vorstellung auf dem Cloud Identity Summit 2026",
    "huawei-global-first-prize": "Goldmedaille und tunesische Flagge beim globalen Finale der Huawei ICT Competition 2025-26 in Shenzhen",
    "huawei-computing-track-first-prize": "Auf der Bühne, als der erste Platz im Computing Track verkündet wird",
    "huawei-award-ceremony-stage": "Bei der Medaillenübergabe, mit dem Teamnamen TEK-UP auf der Leinwand",
    "huawei-global-final-shenzhen": "Vor der Kulisse des globalen Finales in Shenzhen",
    "huawei-tunisia-team": "Die tunesische Delegation bei der Abschlussfeier",
    "huawei-medals": "Das TEK-UP-Team mit seinen Medaillen",
    "tekup-graduation": "Abschlussfeier an der TEK-UP University",
    "tekup-graduation-team": "Abschlussfeier mit Freunden",
    "huawei-2022-prize": "Preis bei der Huawei ICT Competition 2022-23",
    "certificate-handover": "Bei einer Zertifikatsübergabe",
    "jci-panel": "Podiumsdiskussion mit der JCI (Jeune Chambre Économique) Centre Urbain Nord",
    "enactus-make-it-real": "Mit dem Enactus-Team bei Make It Real",
    "ost-family-gathering": "Treffen der OST-Familie",
    "conference-badge": "Konferenztag",
    "portrait-badge": "Veranstaltungstag",
    "group-photo-1": "Hochschulclub",
    "group-photo-2": "Hochschulclub",
    "group-photo-3": "Ausflug mit dem Hochschulclub",
  },
};
