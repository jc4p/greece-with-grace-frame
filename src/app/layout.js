import { Inter, Cinzel_Decorative } from 'next/font/google';
import { FrameInit } from "@/components/FrameInit";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cinzel_decorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-cinzel-decorative'
});

export const metadata = {
  title: "Go to Greece with Grace",
  description: "Apply for a chance to go to Greece with Grace!"
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel_decorative.variable}`}>
        <div>
          {children}
          <FrameInit />
        </div>
      </body>
    </html>
  );
}
