import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Footer } from "@/components/footer";
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
    default: "CodeWithShreya — Learn Computer Science",
    template: "%s | CodeWithShreya",
  },
  description:
    "Learn computer science with practical articles, video lessons, quizzes, coding tools, and previous year questions.",
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-VQM236MCCS" />
    </html>
  );
}
