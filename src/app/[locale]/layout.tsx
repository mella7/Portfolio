import { Analytics } from "@/components/analytics";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getResume } from "@/data";
import { locales, type Locale } from "@/i18n/config";
import { getUI } from "@/i18n/ui";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const data = getResume(params.locale);
  return {
    metadataBase: new URL(data.url),
    title: {
      default: data.name,
      template: `%s | ${data.name}`,
    },
    description: data.description,
    alternates: {
      languages: {
        en: "/en",
        de: "/de",
        fr: "/fr",
      },
    },
    openGraph: {
      title: data.name,
      description: data.description,
      url: data.url,
      siteName: data.name,
      locale: params.locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!locales.includes(params.locale as Locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  const t = getUI(locale);
  const data = getResume(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            <SiteHeader
              locale={locale}
              labels={t.nav}
              social={data.social}
              name={data.name}
              avatarUrl={data.avatarUrl}
              overlay={Boolean(data.heroImage)}
            />
            <div className="mx-auto max-w-2xl px-6 pb-24 pt-10">{children}</div>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
