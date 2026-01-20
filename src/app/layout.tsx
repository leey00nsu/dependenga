import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Jua } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jua = Jua({
  variable: "--font-jua",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Dependenga",
  description: "의존성 취약점을 3D 젠가로 시각화",
  openGraph: {
    title: "Dependenga",
    description: "의존성 취약점을 3D 젠가로 시각화",
    type: "website",
    locale: "ko_KR",
    siteName: "Dependenga",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Dependenga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dependenga",
    description: "의존성 취약점을 3D 젠가로 시각화",
    images: ["/icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${jua.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
