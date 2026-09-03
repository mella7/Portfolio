import { Dock, DockIcon } from "@/components/magicui/dock";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { AwardIcon, FolderGit2Icon, HomeIcon, MicIcon, NotebookIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar({
  locale,
  labels,
  social,
}: {
  locale: Locale;
  labels: { home: string; projects: string; blog: string; talks: string; certifications: string; theme: string };
  social: { github: string; linkedin: string };
}) {
  const navItems = [
    { href: `/${locale}`, icon: HomeIcon, label: labels.home },
    { href: `/${locale}/projects`, icon: FolderGit2Icon, label: labels.projects },
    { href: `/${locale}/blog`, icon: NotebookIcon, label: labels.blog },
    { href: `/${locale}/talks`, icon: MicIcon, label: labels.talks },
    { href: `/${locale}/certifications`, icon: AwardIcon, label: labels.certifications },
  ];

  const socialItems = [
    { name: "GitHub", url: social.github, icon: Icons.github },
    { name: "LinkedIn", url: social.linkedin, icon: Icons.linkedin },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
        {navItems.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {socialItems.map((item) => (
          <DockIcon key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <LanguageSwitcher currentLocale={locale} />
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>{labels.theme}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}
