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
  title: "CASE SEARCH",
  description: "Semantic search for U.S. Case Law.",
  openGraph: {
    title: "CASE SEARCH",
    description: "Semantic search for U.S. Case Law.",
    url: "https://casesearch.vercel.app",
    siteName: "CASE SEARCH",
    images: [
      {
        url: "https://casesearch.vercel.app/static/macro.jpeg",
        width: 1500,
        height: 500,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CASE SEARCH",
    description: "Semantic search for U.S. Case Law.",
    creator: "@khomie_",
    images: ["https://casesearch.vercel.app/static/macro.jpeg"],
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
