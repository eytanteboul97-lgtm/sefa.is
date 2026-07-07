const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#EDE1CE" offset="20%" />
      <stop stop-color="#F6EFE4" offset="50%" />
      <stop stop-color="#EDE1CE" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#EDE1CE" />
  <rect width="${w}" height="${h}" fill="url(#g)" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

export const shimmerDataUrl = (w: number, h: number) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
