import "../styles/reset.css";
import "../styles/globals.css";

import { CSPostHogProvider } from "@/providers/PHProvider";

import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Michael Beck",
  description: "Always building.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full bg-background text-text ${instrumentSerif.className}`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="MJB" />
      </head>
      <CSPostHogProvider>
        <body className="h-full overflow-hidden">{children}</body>
      </CSPostHogProvider>
    </html>
  );
}
