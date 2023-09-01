import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const ABCSocial = localFont({
  src: "../../public/fonts/ABCSocialPlusVariableEdu.woff2",
  display: "swap",
  variable: "--font-abc-social",
});

const BerkeleyMono = localFont({
  src: "../../public/fonts/BerkeleyMonoVariable-Regular.woff2",
  display: "swap",
  variable: "--font-berkeley-mono",
});

export const metadata = {
  title: "CASEARCH",
  description: "Semantic search for U.S. Case Law.",
  openGraph: {
    title: "CASEARCH",
    description: "Semantic search for U.S. Case Law.",
    url: "https://casearch.vercel.app",
    siteName: "CASEARCH",
    images: [
      {
        url: "https://casearch.vercel.app/static/macro.jpeg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CASEARCH",
    description: "Semantic search for U.S. Case Law.",
    siteId: "1515531815594864640",
    creator: "@macrocosmcorp",
    creatorId: "1515531815594864640",
    images: ["https://casearch.vercel.app/static/macro.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${ABCSocial.variable} ${BerkeleyMono.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
