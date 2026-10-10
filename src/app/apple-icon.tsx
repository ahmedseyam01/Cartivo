import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a" }}>
        <svg viewBox="0 0 40 40" width="180" height="180">
          <g fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.5 16.5v-2.5a4.5 4.5 0 0 1 9 0v2.5" />
            <path d="M26.2 19.2A8.2 8.2 0 1 0 26.2 29.8" />
          </g>
          <circle cx="26.5" cy="24.5" r="2" fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
