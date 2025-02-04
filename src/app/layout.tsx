import "../styles/reset.css";
import "../styles/globals.css";

import { CSPostHogProvider } from "@/providers/PHProvider";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Instrument_Sans, Instrument_Serif } from "next/font/google";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const serif = Instrument_Serif({
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
    <html lang="en" className="h-full bg-background text-text">
      <head>
        <meta name="apple-mobile-web-app-title" content="MJB" />
      </head>
      <CSPostHogProvider>
        <body className="h-full overflow-hidden">{children}</body>
      </CSPostHogProvider>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-16987K38P8" />
      )}
    </html>
  );
}
