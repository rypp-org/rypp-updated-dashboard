// lucide-react no longer ships brand icons, so the few we need are inlined.
type P = { className?: string };
const base = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

export const LinkedinIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.1c.55-1 1.9-1.8 3.9-1.8 4.1 0 4.7 2.6 4.7 6v5.3h-4v-4.7c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6v4.8h-4v-11Z" />
  </svg>
);
export const InstagramIcon = ({ className }: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const XIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
  </svg>
);
export const FacebookIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.2C16.7 2.1 15.8 2 14.7 2 12.3 2 10.7 3.4 10.7 6.1v2.4H8v3.4h2.7V22H14v-10.1h2.6l.4-3.4H14Z" />
  </svg>
);
export const YoutubeIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);
export const PlayStoreIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path d="M3.6 2.4c-.3.3-.5.8-.5 1.4v16.4c0 .6.2 1.1.5 1.4l9.2-9.6-9.2-9.6Z" fill="#00c3ff" />
    <path d="m16 8.8-3.2 3.3L16 15.4l4-2.3c1.1-.6 1.1-1.6 0-2.3L16 8.8Z" fill="#ffd400" />
    <path d="m3.6 2.4 9.2 9.7L16 8.8 5.6 2.3c-.8-.5-1.5-.3-2 .1Z" fill="#00f076" />
    <path d="m3.6 21.6c.5.4 1.2.6 2-.1L16 15.4l-3.2-3.3-9.2 9.5Z" fill="#ff3a44" />
  </svg>
);
