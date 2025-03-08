import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { Space_Grotesk } from "next/font/google";
import { Grandstander } from "next/font/google";
import { ImageView } from "@/components/ImageGrid/imageView";
import { Toaster } from "@/components/ui/toaster";


const urbanStarblues = localFont({
  src: "./fonts/urban.woff2",
  variable: "--font-urban",
  weight: "100 900",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const grandstander = Grandstander({
  subsets: ["latin"],
  variable: "--font-grandstander",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Griddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanStarblues.variable} ${spaceGrotesk.variable} ${grandstander.variable}  antialiased `}
      >
        <Providers>
          {children}
          <ImageView />
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}
