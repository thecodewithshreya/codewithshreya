import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { I18nProvider } from "@/components/i18n-provider";
import { Navbar } from "@/components/navbar";

const themeScript = `
  try {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.classList.add("dark");
  }
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://codewithshreya.com"),
  title: {
    default: "CodeWithShreya - Learn Computer Science & Programming",
    template: "%s | CodeWithShreya",
  },
  description:
    "Learn Computer Science, Programming, DSA, DBMS, Operating Systems, Computer Networks, AI, and interview preparation with CodeWithShreya.",
  keywords: [
    "CodeWithShreya",
    "Computer Science",
    "Programming",
    "DSA",
    "DBMS",
    "Operating System",
    "Computer Networks",
    "GATE CS",
    "Interview Preparation",
  ],
  openGraph: {
    title: "CodeWithShreya",
    description:
      "Learn Computer Science, Programming, AI, DSA, DBMS, OS, CN and interview preparation.",
    url: "https://codewithshreya.com",
    siteName: "CodeWithShreya",
    type: "website",
    images: [
      {
        url: "/codewithshreya-logo-final.png",
        width: 512,
        height: 512,
        alt: "CodeWithShreya",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <I18nProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
      <GoogleAnalytics gaId="G-VQM236MCCS" />
    </html>
  );
}
