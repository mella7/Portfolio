// Data that is identical across all languages: images, real quotes, links.

// Resume PDFs per language, all bundled in /public/resume.
export const resumeLinks = {
  en: "/resume/Resume_Mohamed_Ali_Mellah_EN.pdf",
  de: "/resume/Resume_Mohamed_Ali_Mellah_DE.pdf",
  fr: "/resume/Resume_Mohamed_Ali_Mellah_FR.pdf",
} as const;

// Photo slideshow on the homepage. Newest and strongest first, since the
// strip starts from the left. All pre-cropped to 4:3 so no slide jitters.
export const gallery = [
  { src: "/Slides/huawei-2026-global-first-prize.webp", alt: "Holding the Tunisian flag with the gold medal at the Huawei ICT Competition 2025-2026 Global Final awards ceremony in Shenzhen" },
  { src: "/Slides/huawei-2026-computing-track-first-prize.webp", alt: "On stage as the Computing Track First Prize winners are announced at the Huawei ICT Competition Global Final" },
  { src: "/Slides/huawei-2026-award-ceremony-stage.webp", alt: "Receiving the medal on stage with the TEK-UP team name displayed behind" },
  { src: "/Slides/huawei-2026-tunisia-team.webp", alt: "The Tunisian delegation with the flag at the Huawei ICT Competition closing ceremony" },
  { src: "/Slides/huawei-2026-medals.webp", alt: "The TEK-UP team with their medals after the Computing Track final" },
  { src: "/Slides/huawei-2026-global-final-shenzhen.webp", alt: "At the Huawei ICT Competition 2025-2026 Global Final backdrop in Shenzhen" },
  { src: "/Slides/tekup-graduation.webp", alt: "Graduation day at TEK-UP University" },
  { src: "/Slides/tekup-graduation-team.webp", alt: "Graduation day at TEK-UP University with friends" },
  { src: "/Slides/Robograf_ost_07-27-2023_0008 (2).JPG", alt: "Slide 1" },
  { src: "/Slides/IMG_2244.jpg", alt: "Slide 2" },
  { src: "/Slides/1699914731406.jpeg", alt: "Slide 3" },
  { src: "/Slides/O6H4nycA.jpg", alt: "Slide 4" },
  { src: "/Slides/285639964_3541363806090192_4099727266731152384_n.jpg", alt: "Slide 5" },
  { src: "/Slides/437473116_453584250537534_3567375388878140822_n.jpg", alt: "Slide 6" },
  { src: "/Slides/263463585_5067540496612999_6175899699427580007_n.jpg", alt: "Slide 7" },
  { src: "/Slides/272899300_1224929181367505_1869064406776830708_n.jpg", alt: "Slide 8" },
  { src: "/Slides/167A1223_0005_167A1204.png", alt: "Slide 9" },
  { src: "/Slides/283608751_1723772474643176_8997501017855656483_n.jpg", alt: "Slide 10" },
];

// Real quotes from real people - kept in their original language on purpose,
// so they stay authentic across all site languages.
export const testimonials = [
  {
    name: "Mahdi Zgolli",
    username: "@Mahdi",
    imgSrc: "/Testimonials/Mahdi.jpeg",
    quote:
      "Working with Dali was fantastic! He quickly solved a major issue during a project, saving us a lot of time. His energy is truly impressive.",
  },
  {
    name: "Imem Hamdi",
    username: "@imem",
    imgSrc: "/Testimonials/Imem.jpg",
    quote:
      "During a hackathon, Mohamed Ali turned a challenging idea into a winning project in no time. He's not only brilliant but also makes work enjoyable. Much love!",
  },
  {
    name: "Manel Yatouji",
    username: "@yousri",
    imgSrc: "/Testimonials/Manel.png",
    quote: "I loved working with Med Ali, he brings a lot of enthusiasm and skill to the table.",
  },
  {
    name: "Hyba Ayesh",
    username: "@Hyba",
    imgSrc: "/Testimonials/profile.jpg",
    quote: "Love the creativity, true team player.",
  },
  {
    name: "Rafika Bel Hadj Alaya",
    username: "@Rafika",
    imgSrc: "/Testimonials/Rafika.png",
    quote: "He's not only talented but also a great person to work with.",
  },
  {
    name: "Ala Eddine Largat",
    username: "@Alaa",
    imgSrc: "/Testimonials/Ala.jpeg",
    quote: "Very impressive work, big thanks for the hard work during our last project.",
  },
];
