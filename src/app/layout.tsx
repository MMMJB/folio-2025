import "../styles/reset.css";
import "../styles/globals.css";

import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

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
      <body className="h-full">{children}</body>
    </html>
  );
}
