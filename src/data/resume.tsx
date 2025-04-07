import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Mohamed Ali Mellah",
  title: "DevSecOps Engineer / Junior Entrepreneur",
  email: "mella.mellah@gmail.com",
  phone: "+216 21 223 3456",
  phoneLink: "https://www.google.com/search?q=+216+21+223+3456",
  first_name: "Mohamed Ali",
  last_name: "Mellah",
  initials: "DV",
  url: "https://dillion.io",
  location: "Tunisia, TN",
  locationLink: "https://www.google.com/maps/place/tunis",
  description:
    "DevSecOps Engineer / Junior entrepreneur",
  summary:
    "it's me mella7 from Tunisia. I’m a final-year engineering student (Night Classes) specializing in Cloud-Native and Kubernetes technologies. Throughout my career, i’ve built a solid foundation in designing, deploying, and managing Kubernetes clusters, containerization, and microservices architecture. Currently, I’m looking for an end-of-study internship where I can apply my skills and continue contributing to innovative cloud and DevOps projects.",
  //"At the end of 2022, I quit my job as a software engineer to go fulltime into building and scaling my own SaaS businesses. In the past, [I pursued a double degree in computer science and business](/#education), [interned at big tech companies in Silicon Valley](https://www.youtube.com/watch?v=d-LJ2e5qKdE), and [competed in over 21 hackathons for fun](/#hackathons). I also had the pleasure of being a part of the first ever in-person cohort of buildspace called [buildspace sf1](https://buildspace.so/sf1).",
  vision:
    "I plan to relocate to Germany/Europe in February through the Schmalkaden University exchange program.",
  avatarUrl: "/me.jpg",
  skills1: [
    "AWS",
    "Azure",
    "Google Cloud Platform (GCP)",
    "Unix/Linux",
    "Windows Server",
    "VMware",
    "OpenStack",
    "ProxMox",
  ], // Infrastructure & Cloud
  
  skills2: [
    "Kubernetes",
    "Docker",
    "Jenkins",
    "Git",
    "GitLab",
    "Terraform",
    "Ansible",
    "Puppet",
    "Chef",
    "HashiCorp Vault",
    "Nexus",
    "Jenkins Pipelines",
    "ArgoCD",
    "Vagrant",
    "Synk",
    "Trivy",
    "OWASP ZAP",
    "npm",
  ], // DevOps & Automation
  
  skills3: [
    "Grafana",
    "Prometheus",
    "ELK Stack (Elasticsearch, Logstash, Kibana)",
    "Zabbix",
    "Datadog",
    "NodeExporter",
    "Nagios",
    "Wireshark",
  ], // Monitoring & Logging
  
  skills4: [
    "pfSense",
    "SonarQube",
    "Splunk",
    "Wazuh",
    "TheHive",
    "Suricata",
    "AlienVault",
    "Nessus",
    "AWS IAM",
    "Azure AD",
    "Okta",
    "AWS WAF",
  ], // Security & Compliance
  
  skills5: [
    "VLAN",
    "Routing",
    "DNS",
    "DHCP",
    "VPN",
    "BGP",
    "OSPF",
  ], // Networking
  
  skills6: [
    "LaTeX (Overleaf, TeXShop)",
    "Microsoft Word",
    "PowerPoint",
    "Microsoft Excel",
  ], // Documentation & Reporting
  
  skills7: [
    "Python",
    "Go",
    "C",
    "Java",
    "Bash",
    "PowerShell",
    "SQL",
    "YAML",
    "HCL",
  ], // Languages & Scripting

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    //{ href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "mellah.mohamedali@outlook.com",
    tel: "+216 94 24 74 11",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/mella7",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/MellahMedAli/",
        icon: Icons.linkedin,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  certifications: [
    {
      name: "Red Hat Certified System Administrator (RHCSA)",
      logo: "/certs/rhcsa.png",
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      logo: "/certs/cka.png",
    },
    {
      name: "Certified Kubernetes Application Developer (CKAD)",
      logo: "/certs/ckad.png",
    },
    {
      name: "AWS Certified Cloud Practitioner (AWS CCP)",
      logo: "/certs/aws-ccp.png",
    },
    {
      name: "eLearnSecurity Junior Penetration Tester (eJPT)",
      logo: "/certs/ejpt.png",
    },
    {
      name: "Cisco Network Security",
      logo: "/certs/cisco-security.png",
    },
    {
      name: "Cisco DevNet Associate",
      logo: "/certs/devnet.png",
    },
    {
      name: "Cisco Routing & Switching",
      logo: "/certs/routing-switching.png",
    },
    {
      name: "Certified Kubernetes Security Specialist (CKS) - In Progress",
      logo: "/certs/cks.png",
    },
    {
      name: "Next goal: Kubestronaut title (All 5 Kubernetes certs)",
      logo: "/certs/kubestronaut.png",
    },
  ],

  education: [
    {
      school: "Hochschule Schmalkalden, Germany",
      degree: "Exchange Program in Computer Science",
      start: "2024",  
      end: "2025",    
      logoUrl: "/hsm.png", 
      href: "https://www.hs-schmalkalden.de/",
    },
    {
      school: "TEK-UP University • Part-Time Evening Program",
      href: "https://tek-up.de/",
      degree: "Engineering Degree in Computer Systems and Network Security",
      logoUrl: "/TEK-UP.png",
      start: "2022",
      end: "2025",
    },
    {
      school: "Higher Institute of Technological Studies of Rades (ISET Rades)",
      href: "http://www.isetr.rnu.tn/",
      degree: "Bachelor's Degree in Computer Systems and Network Administration",
      logoUrl: "/ISET-Logo.png",
      start: "2019",
      end: "2022",
    }
  ],

  work: [
    {
      company: "Freelance missions",
      href: "",
      badges: [],
      location: "Remote",
      title: "Freelance DevSecOps Engineer",
      logoUrl: "/Freelance.png",
      start: "2022",
      end: "Present",
      description: [
        "• As a freelancer over the past 2.5 years, I’ve contributed to various DevOps, cloud, security, and networking projects, while also specializing in writing reports and creating presentations.",
        "• Responsibilities and Tasks Accomplished:",
        "> Implement Continuous Integration and Continuous Deployment (CI/CD) pipeline.",
        ">  Deploy and configure monitoring tools (Grafana, Prometheus, Elasticsearch).",
        "> Create Dockerfiles and Jenkinsfiles for custom images.",
        "> Configure Windows servers with IIS.",
        "> Install prerequisites using Terraform.",
        "> Configure network devices (routers, switches, firewalls).",
        "> Manage routing protocols (OSPF, BGP, EIGRP).",
        "> Establish a Security Information and Event Management (SIEM) system.",
        "> Implement the Bitwarden password management tool.",
        "> Deploy a Security Operations Center (SOC).",
        "> Conduct analysis of project-specific instance needs and costs (AWS, Azure, VMware, VPS).",
        "> Manage project migrations to Azure Hybrid.",
        "> Deploy and manage development, pre-production, and production environments.",
        "> Include incident configuration and management.",
        "> Maintain the backup schedule.",
        "> Draft and update support documentation, including procedures and user manuals.",
        "> Handle tickets and assistance requests via OTRS.",
        "> Provide technical support and assistance to users.",
        "> Prepare and deliver professional reports and presentations."
      ]
    },
    {
      company: "TEK UP University",
      href: "https://tek-up.de/",
      badges: [],
      location: "Ariana, Tunisia",
      title: "Internship - Summer Training",
      logoUrl: "/TEK-UP.png",
      start: "July",
      end: "Augest 2024",
      description: [
        "• Completed a two-month internship focused on RHCSA, RHCE, and Kubernetes training, resulting in practical experience with Linux and container management.",
      ]
    },
    {
      company: "Taskin Enterprise",
      href: "",
      badges: [],
      location: "Korba, Tunisia",
      title: "Internship",
      logoUrl: "/Taskin.png",
      start: "July",
      end: "September 2023",
      description: [
        "• Developed backend features for a real estate website using NodeJS and MySQL, increasing transaction speed by 20%.",
        "• Spearheaded the design and execution of deployment strategies on AWS using Terraform for IaC, Ansible for configuration management, and Jenkins for CI/CD, reducing manual deployments by 50%.",
      ]
    },
    {
      company: "Blue IT",
      href: "",
      badges: [],
      location: "Tunis, Tunisia",
      title: "Internship - End of study project",
      logoUrl: "/BlueIT.png",
      start: "January",
      end: "July 2022",
      description: [
        "• Researched, configured, and deployed a secure Wi-Fi network with Huawei equipment and firewalls.",
        "• Enhanced network performance by customizing AP settings and implemented captive portal authentication and VLAN segmentation, boosting security by 30%.",
      ]
    },
    {
      company: "Tunisia’s national Post",
      href: "https://www.poste.tn/",
      badges: [],
      location: "Tunis, Tunisia",
      title: "Internship",
      logoUrl: "/Poste.jpg",
      start: "July",
      end: "Augest 2022",
      description: [
        "• Designed and implemented a prototype for the core network architecture at Tunisia’s National Post, integrating VPN and OSPF for secure and efficient network routing.National",
      ]
    },
    {
      company: "Tunisie Telecom ",
      href: "https://www.tunisietelecom.tn/",
      badges: [],
      location: "Ben Arous, Tunisia",
      title: "Internship",
      logoUrl: "/TT.png",
      start: "February",
      end: "Mars 2021",
      description: [
        "• Assisted in maintaining the server room and coordinated the installation and configuration of 100+ new internet connections for clients.",
      ]
    },
    {
      company: "SOFIA Technology",
      href: "https://sofia-technologies.com/",
      badges: [],
      location: "Ariana, Tunisia",
      title: "Internship",
      logoUrl: "/Sofia-tech.png",
      start: "February",
      end: "Mars 2020",
      description: [
        "• Participated in daily IT operations, including troubleshooting and support for desktop and network systems.",
      ]
    },
  ],

  projects: [
    {
      title: "KubeAudit",
      href: "https://github.com/mella7/KubeAudit",
      dates: "May 2024",
      active: false,
      description:
        "An auditing tool for Kubernetes clusters to identify security gaps, enforce best practices, and ensure compliance with security standards.",
      technologies: [
        "Kubernetes",
        "Ansible",
        "Go",
        "YAML",
        "Bash",
        "Kind",
        "Docker",
        "Docker Compose",
        "ElasticSearch",
        "Logstash",
        "Kibana",
      ],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/mella7/KubeAudit",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/Projects/KubeAudit.png", // Replace with an actual image path
      video: "",
    },
    {
      title: "DevSecOps Security Suite",
      href: "https://github.com/mella7/DevSecOps-Security-Suite",
      dates: "Jun 2024 - Jul 2024",
      active: true,
      description:
        "A comprehensive security suite designed for DevSecOps workflows, enhancing security in CI/CD pipelines, infrastructure as code, and application runtime.",
      technologies: [
        "Docker",
        "Kubernetes",
        "Ansible",
        "OWASP ZAP",
        "Grafana",
        "Prometheus",
        "ELK Stack",
      ],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/mella7/DevSecOps-Security-Suite",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/Projects/DevsecopsSuite.png", // Replace with an actual image path
      video: "", // Add a video URL if available
    },
    {
      title: "GuardianX",
      href: "https://github.com/mella7/GuardianX",
      dates: "May - Jun 2023",
      active: false,
      description:
        "A cloud-native threat detection and response tool, providing real-time security insights and alerting for cloud infrastructures.",
      technologies: [
        "Python",
        "AWS Lambda",
        "CloudFormation",
        "VirusTotal API",
        "ElasticSearch",
        "Flask",
      ],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/mella7/GuardianX",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/Projects/GuardianX.jpeg", // Replace with an actual image path
      video: "",
    },
    {
      title: "SecureDiscord",
      href: "https://github.com/mella7/SecureDiscord",
      dates: "Sep - Nov 2023",
      active: false,
      description:
        "A Discord bot with security-focused features like threat intelligence, link scanning, and real-time alerting, helping keep communities safe.",
      technologies: [
        "Git",
        "LDAP",
        "RabbitMQ",
        "SQLite",
        "Kubernetes",
        "Docker",
        "Docker Compose",
        "Flask",
      ],
      links: [
        {
          type: "Demonstartive video",
          href: "https://drive.google.com/file/d/14F_p5ilFHMwQH_J1iZx6fMqxDoPqW62D/view?usp=sharing",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "GitHub",
          href: "https://github.com/mella7/SecureDiscord",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/Projects/SecureDiscord.jpeg", // Replace with an actual image path
      video: "",
    },
  ],

  hackathons: [
    {
      title: "AI4Africa Hackathon",
      location: "Tunis, Tunisia",
      dates: "March 2023",
      image: "/Projects/ai4africa.png",
      description: "Built an AI-powered chatbot to help local farmers...",
      links: [
        {
          type: "GitHub",
          href: "https://github.com/mella7/AI4Africa",
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
  ], // Make sure this array closes without a trailing comma

  testimonials: [
    {
      name: "Mahdi Zgolli",
      username: "@Mahdi",
      imgSrc:
        "/public/Testimonials/Mahdi.jpeg",
      quote:
        "Working with Dali was fantastic! He quickly solved a major issue during a project, saving us a lot of time. His energy is truly IMPRESSIVE.",
    },
    {
      name: "Imem Hamdi",
      username: "@imem",
      imgSrc: "/da.jpg",
      quote:
        "During a hackathon, Mohamed Ali turned a challenging idea into a winning project in no time. He’s not only brilliant but also makes work enjoyable. Much Love!",
    },
    {
      name: "Manel Yatouji",
      username: "@yousri",
      imgSrc:
        "https://media.licdn.com/dms/image/v2/D4D03AQHeBnrYF0ojDQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707048728617?e=1729728000&amp;v=beta&amp;t=WjbusZL6LpW81ONOpP6gcWb8oQ47RiiPhFaWP8LUhNI",
      quote:
        "I loved working with Med Ali, he brings a lot of enthusiasm and skill to the table.",
    },
    {
      name: "Hyba Ayesh",
      username: "@Hyba",
      imgSrc:
        "https://media.licdn.com/dms/image/v2/D4D03AQFF8LBBXYqnQw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715549520205?e=1729728000&amp;v=beta&amp;t=1q4Vbgo15sdGFE6E_FxNXyyg4V2h4SWMMV2hVLXG9q4",
      quote: "Love the creativity, true team player.",
    },
    {
      name: "Ala Eddine Largat",
      username: "@Alaa",
      imgSrc:
        "/public/Testimonials/Mahdi.jpeg",
      quote:
        "Very impressive work, big thanks for the hard work during our last project.",
    },
    {
      name: "Rafika Bel Hadj Alaya",
      username: "@Rafika",
      imgSrc:
        "https://media.licdn.com/dms/image/v2/D4E03AQEsilSBOP4qdA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724248539200?e=1729728000&amp;v=beta&amp;t=4PtEzPxZFrfr-713qMPG6ScKekRVWx9nGEbuhojq6Y4",
      quote: "He’s not only talented but also a great person to work with.",
    },
  ],
} as const;