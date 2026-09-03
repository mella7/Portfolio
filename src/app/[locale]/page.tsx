import { ContactForm } from "@/components/contact-form";
import { HeroBanner } from "@/components/hero-banner";
import { Terminal } from "@/components/terminal";
import { LanguageResumeButtons } from "@/components/language-resume-buttons";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { gallery, getResume, testimonials, type ResumeData } from "@/data";
import type { Locale } from "@/i18n/config";
import { getUI } from "@/i18n/ui";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

type UI = ReturnType<typeof getUI>;

export default function Page({ params }: { params: { locale: Locale } }) {
  const data = getResume(params.locale);
  const t = getUI(params.locale);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      {data.heroImage && (
        <HeroBanner src={data.heroImage} alt={`${data.name} speaking`} />
      )}
      <HeroSection data={data} />
      <ResumeSection locale={params.locale} t={t} />
      <TerminalSection data={data} t={t} />
      <AboutSection data={data} t={t} />
      <AwardsSection data={data} t={t} />
      <GallerySection />
      <EducationSection data={data} t={t} />
      <CertificationsSection data={data} t={t} />
      <WorkSection data={data} t={t} />
      <SkillsSection data={data} t={t} />
      <ProjectsSection data={data} t={t} locale={params.locale} />
      <LanguagesSection data={data} t={t} />
      <TestimonialsSection t={t} />
      <ContactSection data={data} t={t} />
    </main>
  );
}

function HeroSection({ data }: { data: ResumeData }) {
  return (
    <section id="hero">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="gap-2 flex justify-between">
          <div className="flex-col flex flex-1 space-y-1.5">
            <BlurFadeText
              delay={BLUR_FADE_DELAY}
              className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
              yOffset={8}
              text={`Hi, I'm ${data.firstName}`}
            />
            <BlurFadeText
              className="max-w-[600px] md:text-xl"
              delay={BLUR_FADE_DELAY}
              text={data.description}
            />
            <BlurFade delay={BLUR_FADE_DELAY * 2}>
              <p className="text-sm text-muted-foreground">{data.tagline}</p>
            </BlurFade>
          </div>
          <BlurFade delay={BLUR_FADE_DELAY}>
            <Avatar className="size-28 border">
              <AvatarImage alt={data.firstName} src={data.avatarUrl} />
              <AvatarFallback>{data.initials}</AvatarFallback>
            </Avatar>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

function TerminalSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="terminal">
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <Terminal data={data} strings={t.terminal} />
      </BlurFade>
    </section>
  );
}

function ResumeSection({ locale, t }: { locale: Locale; t: UI }) {
  return (
    <section id="resume-downloads" className="w-full flex flex-col items-center gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">{t.resume.heading}</h3>
      <LanguageResumeButtons
        labels={{ en: t.resume.en, de: t.resume.de, fr: t.resume.fr }}
        currentLocale={locale}
      />
    </section>
  );
}

function AboutSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="about">
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <h2 className="text-xl font-bold">{t.sections.about}</h2>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
          {data.summary}
        </Markdown>
      </BlurFade>
    </section>
  );
}

function AwardsSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="awards">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <h2 className="text-xl font-bold">{t.sections.awards}</h2>
        </BlurFade>
        <ul className="mb-2 ml-1 divide-y divide-dashed border-l">
          {data.awards.map((award, id) => (
            <BlurFade key={award.title} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
              <li className="relative ml-6 py-3">
                <span className="absolute -left-[27px] top-5 size-2 rounded-full bg-foreground" />
                <p className="text-xs text-muted-foreground">{award.period}</p>
                <h3 className="text-sm font-semibold">{award.title}</h3>
                {award.description && (
                  <p className="text-sm text-muted-foreground">{award.description}</p>
                )}
              </li>
            </BlurFade>
          ))}
        </ul>
      </div>
    </section>
  );
}

function GallerySection() {
  // Render the strip twice back-to-back so the CSS marquee (translateX -50%)
  // always has a matching second half to scroll into - otherwise the track
  // runs out of images partway through and the loop visibly jumps/empties.
  const strip = [...gallery, ...gallery];
  return (
    <section id="photo-slideshow" className="slideshow-container">
      <div
        className="slideshow-track"
        style={{ ["--slide-count" as string]: gallery.length }}
      >
        {strip.map((slide, id) => (
          <div className="slide" key={`${slide.src}-${id}`}>
            <Image
              src={slide.src}
              alt={slide.alt}
              width={480}
              height={320}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="education">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <h2 className="text-xl font-bold">{t.sections.education}</h2>
        </BlurFade>
        {data.education.map((education, id) => (
          <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
            <ResumeCard
              href={education.href}
              logoUrl={education.logoUrl}
              altText={education.school}
              title={education.school}
              subtitle={education.degree}
              period={`${education.start} - ${education.end}`}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="certifications">
      <div className="flex flex-col gap-y-4">
        <BlurFade delay={BLUR_FADE_DELAY * 8}>
          <h2 className="text-xl font-bold">{t.sections.certifications}</h2>
        </BlurFade>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          {data.certifications.map((cert, id) => (
            <BlurFade key={cert.name} delay={BLUR_FADE_DELAY * 9 + id * 0.05}>
              <div className="flex items-center gap-4">
                <Image
                  src={cert.logo}
                  alt={cert.name}
                  width={48}
                  height={48}
                  className={`rounded ${cert.inProgress ? "opacity-50" : ""}`}
                />
                <span className="text-sm text-muted-foreground">{cert.name}</span>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="work">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <h2 className="text-xl font-bold">{t.sections.work}</h2>
        </BlurFade>
        {data.work.map((work, id) => (
          <BlurFade key={`${work.company}-${work.start}`} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
            <ResumeCard
              logoUrl={work.logoUrl}
              altText={work.company}
              title={work.company}
              subtitle={work.title}
              href={work.href}
              badges={work.badges}
              period={`${work.start} - ${work.end}`}
              description={work.description}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="skills">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 9}>
          <h2 className="text-xl font-bold">{t.sections.skills}</h2>
        </BlurFade>
        {data.skillCategories.map((category, catId) => (
          <div key={category.label} className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 9 + catId * 0.05}>
              <h4 className="text-xl">• {category.label}:</h4>
            </BlurFade>
            <div className="flex flex-wrap gap-1">
              {category.skills.map((skill, id) => (
                <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                  <Badge>{skill}</Badge>
                </BlurFade>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ data, t, locale }: { data: ResumeData; t: UI; locale: Locale }) {
  const preview = data.projects.slice(0, 4);
  return (
    <section id="projects">
      <div className="space-y-12 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                {t.sections.projects}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {t.sections.projectsTitle}
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.sections.projectsBlurb}
              </p>
            </div>
          </div>
        </BlurFade>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
          {preview.map((project, id) => (
            <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 12 + id * 0.05}>
              <ProjectCard
                href={project.href}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
              />
            </BlurFade>
          ))}
        </div>
        {data.projects.length > preview.length && (
          <BlurFade delay={BLUR_FADE_DELAY * 13} className="flex justify-center">
            <Link
              href={`/${locale}/projects`}
              className="text-sm font-medium underline underline-offset-4 hover:text-foreground text-muted-foreground transition-colors"
            >
              {t.sections.projectsCta} →
            </Link>
          </BlurFade>
        )}
      </div>
    </section>
  );
}

function LanguagesSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="languages">
      <div className="flex flex-col gap-y-6">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">{t.sections.languages}</h2>
          </BlurFade>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.languages.map((language, id) => (
              <BlurFade key={language.name} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <p className="text-sm">
                  <span className="font-semibold">{language.name}</span>{" "}
                  <span className="text-muted-foreground">- {language.level}</span>
                </p>
              </BlurFade>
            ))}
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">{t.sections.interests}</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {data.interests.map((interest, id) => (
              <BlurFade key={interest} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge variant="secondary">{interest}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ t }: { t: UI }) {
  return (
    <section id="testimonials" className="my-10">
      <h2 className="text-xl font-bold text-center mb-4">{t.sections.testimonials}</h2>
      <div className="slideshow-container">
        <div className="slideshow-track">
          {testimonials.map((testimonial, id) => (
            <BlurFade key={testimonial.name} delay={BLUR_FADE_DELAY * (id + 1)}>
              <div className="testimonial-card">
                <div className="avatar-container">
                  <Image
                    src={testimonial.imgSrc}
                    alt={`Profile photo of ${testimonial.name}`}
                    className="avatar"
                    width={100}
                    height={100}
                  />
                  <div>
                    <h3>{testimonial.name}</h3>
                    <p className="username">{testimonial.username}</p>
                  </div>
                </div>
                <blockquote>{testimonial.quote}</blockquote>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data, t }: { data: ResumeData; t: UI }) {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="text-section">
          <h2 className="contact-title">{t.sections.contact}</h2>
          <p className="contact-description">{t.sections.contactBlurb}</p>
          <p className="contact-email">
            <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            {data.location} · {data.phone}
          </p>
          <ContactForm labels={t.contactForm} email={data.email} />
        </div>

        <div className="map-container">
          <div className="map-wrapper">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                data.location
              )}&output=embed`}
              title={`Map of ${data.location}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
