import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import Image from 'next/image';

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.first_name}`}
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.first_name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="navbar">
        
      </section>

      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
        </BlurFade>
      </section>
      

      <section id="vision">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">vision</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.vision}
          </Markdown>
        </BlurFade>
      </section>




      <section id="photo-slideshow" className="slideshow-container">
        <div className="slideshow-track">
          {[ 
            { src: "/Slides/Robograf_ost_07-27-2023_0008 (2).JPG", alt: "Slide 9" },
            { src: "/Slides/IMG_2244.jpg", alt: "Slide 8" },
            { src: "/Slides/1699914731406.jpeg", alt: "Slide 2" },
            { src: "/Slides/285639964_3541363806090192_4099727266731152384_n.jpg", alt: "Slide 6" },
            { src: "/Slides/437473116_453584250537534_3567375388878140822_n.jpg", alt: "Slide 7" },
            { src: "/Slides/263463585_5067540496612999_6175899699427580007_n.jpg", alt: "Slide 3" },
            { src: "/Slides/272899300_1224929181367505_1869064406776830708_n.jpg", alt: "Slide 4" },
            { src: "/Slides/167A1223_0005_167A1204.png", alt: "Slide 1" },
            { src: "/Slides/283608751_1723772474643176_8997501017855656483_n.jpg", alt: "Slide 5" },
          ].map((slide, index) => (
            <BlurFade key={slide.alt} delay={BLUR_FADE_DELAY * (index + 1)}>
              <div className="slide">
                <Image 
                  src={slide.src} 
                  alt={slide.alt} 
                  width={2400} 
                  height={2000} 
                  style={{ objectFit: 'contain', width: '100%', height: 'auto' }} 
                />
              </div>
            </BlurFade>
          ))}
          <div style={{ width: '1900px' }}></div>
        </div>
      </section>









      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Education</h2>
          </BlurFade>
          {DATA.education.map((education, id) => (
            <BlurFade
              key={education.school}
              delay={BLUR_FADE_DELAY * 8 + id * 0.05}
            >
              <ResumeCard
                key={education.school}
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


      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <ResumeCard
                key={work.company}
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>


      <h2 className="text-xl font-bold">Skills</h2>
      <section id="skills1">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="text-xl">• Infrastructure & Cloud: </h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills1.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="skills2">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="text-xl">• DevOps & Automation:</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills2.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="skills3">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="text-xl">• Monitoring & Logging:</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills3.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="skills4">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="text-xl">• Security & Compliance:</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills4.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="skills5">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="text-xl">• Networking: </h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills5.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="skills6">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="text-xl">• Documentation & Reporting:</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills6.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="skills7">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h4 className="text-xl">• Languages & Scripting:</h4>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills7.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  My Projects
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Check out my latest work
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Here&apos;s a look at some of my favorite projects in cybersecurity, cloud, and DevSecOps. I’ve worked on everything from secure automation to cloud architecture and threat detection. Check them out!
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {DATA.projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <ProjectCard
                  href={project.href}
                  key={project.title}
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
        </div>
      </section>
      


 





      <section id="testimonials" className="my-10">
  <h2 className="text-xl font-bold text-center mb-4">What People Say</h2>
  <div className="slideshow-container">
    <div className="slideshow-track">
      {[
        { 
          src: "/Testimonials/Mahdi.jpeg", 
          name: "Mahdi Zgolli", 
          username: "@Mahdi", 
          testimonial: "Working with Dali was fantastic! He quickly solved a major issue during a project, saving us a lot of time. His energy is truly IMPRESSIVE." 
        },
        { 
          src: "/Testimonials/Imem.jpg", 
          name: "Imem Hamdi", 
          username: "@imem", 
          testimonial: "During a hackathon, Mohamed Ali turned a challenging idea into a winning project in no time. He’s not only brilliant but also makes work enjoyable. Much Love!" 
        },
        { 
          src: "/Testimonials/Manel.png", 
          name: "Manel Yatouji", 
          username: "@yousri", 
          testimonial: "I loved working with Med Ali, he brings a lot of enthusiasm and skill to the table." 
        },
        { 
          src: "/Testimonials/profile.jpg", 
          name: "Hyba Ayesh", 
          username: "@Hyba", 
          testimonial: "Love the creativity, true team player." 
        },
        { 
          src: "/Testimonials/Rafika.png", 
          name: "Rafika Bel Hadj Alaya", 
          username: "@Rafika", 
          testimonial: "He’s not only talented but also a great person to work with." 
        },
        { 
          src: "/Testimonials/Ala.jpeg", 
          name: "Ala Eddine Largat", 
          username: "@Alaa", 
          testimonial: "Very impressive work, big thanks for the hard work during our last project." 
        },
      ].map((testimonial, index) => (
        <BlurFade key={testimonial.name} delay={BLUR_FADE_DELAY * (index + 1)}>
          <div className="testimonial-card">
            <div className="avatar-container">
              <Image 
                src={testimonial.src} 
                alt={`Profile Image of ${testimonial.name}`} 
                className="avatar" 
                width={100} 
                height={100} 
              />
              <div>
                <h3>{testimonial.name}</h3>
                <p className="username">{testimonial.username}</p>
              </div>
            </div>
            <blockquote>{testimonial.testimonial}</blockquote>
          </div>
        </BlurFade>
      ))}
    </div>
  </div>
</section>







      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="text-section">
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-description">
              I&apos;m currently looking for new opportunities, my inbox is always open.
            </p>
            <p className="contact-email">
              <a href="mailto:mellah.mohamedali@outlook.com">mellah.mohamedali@outlook.com</a>
            </p>
          </div>

          <div className="map-container">
            <div className="map-wrapper">
              <Image src="/location.jpg" alt="Map of Tunis" className="map-image" width={100} height={100} />
              <div className="tooltip-container">
                <div className="phone-number">+216 95 092 609</div>
                <div className="connecting-line"></div>
              </div>
            </div>
          </div>
          
        </div>
      </section>






    </main>
  );
}

