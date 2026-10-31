import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { plainTitle } from "@/lib/title";

export const shareImageSize = { width: 1200, height: 630 };

let logoDataUrl: Promise<string> | null = null;

function getLogo() {
  logoDataUrl ??= readFile(join(process.cwd(), "public", "codewithshreya-logo-final.png")).then(
    (buffer) => `data:image/png;base64,${buffer.toString("base64")}`,
  );
  return logoDataUrl;
}

// Social preview card shared by articles and quizzes. ImageResponse (Satori)
// only supports flexbox layout, so every multi-child element sets display: flex.
export async function renderShareImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const logo = await getLogo();
  title = plainTitle(title);
  const titleSize = title.length > 90 ? 52 : title.length > 60 ? 60 : 68;
  const shortSubtitle = subtitle && subtitle.length > 150 ? `${subtitle.slice(0, 147).trimEnd()}…` : subtitle;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0b0f1a 0%, #1a1240 55%, #3b1d7a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 76,
              height: 76,
              borderRadius: 38,
              background: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={logo} width={64} height={64} alt="" />
          </div>
          <span style={{ fontSize: 34, fontWeight: 700 }}>Code with Shreya</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#c4b5fd",
            }}
          >
            {eyebrow}
          </span>
          <span style={{ fontSize: titleSize, fontWeight: 800, lineHeight: 1.12 }}>{title}</span>
          {shortSubtitle ? (
            <span style={{ fontSize: 28, color: "#cbd5e1", lineHeight: 1.35 }}>{shortSubtitle}</span>
          ) : null}
        </div>

        <span style={{ fontSize: 24, color: "#a5b4fc" }}>codewithshreya.com</span>
      </div>
    ),
    shareImageSize,
  );
}
