import type { ReactNode } from "react";

export interface ResumeData {
  name: string;
  firstName: string;
  initials: string;
  title: string;
  tagline: string;
  description: string;
  summary: string;
  avatarUrl: string;
  /**
   * Optional wide banner photo for the top of the homepage - a conference
   * stage shot works well. Put the file in /public and set the path here.
   * Leave it out and the homepage simply starts with the solid header.
   */
  heroImage?: string;
  location: string;
  email: string;
  phone: string;
  url: string;
  social: {
    github: string;
    linkedin: string;
  };
  awards: {
    period: string;
    title: string;
    description?: string;
  }[];
  education: {
    school: string;
    degree: string;
    start: string;
    end: string;
    logoUrl: string;
    href: string;
  }[];
  certifications: {
    name: string;
    logo: string;
    inProgress?: boolean;
  }[];
  certificationsFootnote: string;
  skillCategories: {
    label: string;
    skills: string[];
  }[];
  work: {
    company: string;
    title: string;
    location?: string;
    start: string;
    end: string;
    logoUrl: string;
    href?: string;
    badges?: string[];
    description: string[];
  }[];
  projects: {
    title: string;
    href?: string;
    dates: string;
    description: string;
    technologies: string[];
    image?: string;
    video?: string;
    links: {
      type: string;
      href: string;
      icon: ReactNode;
    }[];
  }[];
  talks: {
    /** URL segment for the talk's own page, e.g. "containerdays-2026-ebpf". */
    slug: string;
    event: string;
    date: string;
    location: string;
    talkTitle: string;
    description: string;
    href?: string;
    upcoming?: boolean;
    /**
     * Link to the slide deck. Either a file you host yourself
     * ("/talks/slides/my-deck.pdf", placed in public/talks/slides/)
     * or an external URL (Speaker Deck, etc.).
     */
    slidesUrl?: string;
    /**
     * Optional inline embed for the deck - paste the `src` from a Speaker Deck
     * or YouTube embed code. Renders the deck directly in the page.
     */
    slidesEmbed?: string;
    /** Link to the talk recording, once the video is published. */
    videoUrl?: string;
    /**
     * Live slide deck: pre-rendered page images. Point `slidesDir` at a folder
     * under /public holding 01.webp, 02.webp, ... and set `slideCount`.
     * See the README for the one-line conversion command.
     */
    slidesDir?: string;
    slideCount?: number;
    /** Long-form abstract shown on the talk's own page. */
    abstract?: string;
    /** Venue details, rendered with a map on the talk page. */
    venue?: {
      name: string;
      description?: string;
      /** Free-text address used for the embedded map. */
      address: string;
    };
  }[];
  languages: {
    name: string;
    level: string;
  }[];
  interests: string[];
}
