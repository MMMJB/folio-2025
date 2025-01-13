import "../styles/reset.css";
import "../styles/globals.css";

import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Michael Beck",
  description:
    "I'm Michael Beck, a 17-year-old frontend developer from East Brunswick, New Jersey. Here's my personal website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`text-text h-full bg-background ${instrumentSerif.className}`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="MJB" />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
