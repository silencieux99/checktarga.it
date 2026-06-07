import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
          <path
            d="M24.5 12.5C22.4 10.8 19.8 10 17 10C11.75 10 7.5 14.25 7.5 19.5C7.5 24.75 11.75 29 17 29C19.8 29 22.4 28.2 24.5 26.5"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M27.5 14.5L30.5 17.5L35.5 12"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
