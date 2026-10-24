import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Karla, VT323 } from "next/font/google";
import SiteNav from "@/components/nav/SiteNav";
import RelicToast from "@/components/game/RelicToast";
import DiscoverySheet from "@/components/ui/DiscoverySheet";
import InkDefs from "@/components/art/InkDefs";
import { site } from "@/content/site";
import { motionBootScript } from "@/lib/motionBoot";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});
const karla = Karla({ subsets: ["latin"], variable: "--font-karla", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });
const vt323 = VT323({ subsets: ["latin"], weight: "400", variable: "--font-vt323", display: "swap" });

export const metadata: Metadata = {
  // The domain isn't confirmed yet; set site.url to make preview URLs absolute.
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "A golden moon over the turquoise world of What Up World" }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1b1024",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-motion="full"
      suppressHydrationWarning
      className={`${fraunces.variable} ${karla.variable} ${caveat.variable} ${vt323.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <InkDefs />
        <SiteNav />
        <div id="main" tabIndex={-1}>
          {children}
        </div>
        <RelicToast />
        <DiscoverySheet />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
