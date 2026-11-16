import type { CSSProperties, ReactNode } from 'react';

type AppIconName =
  | 'family' | 'gift' | 'tree' | 'santa'
  | 'search' | 'members' | 'contribution' | 'cart' | 'user'
  | 'globe' | 'chart' | 'trash' | 'mail' | 'lightbulb'
  | 'celebration' | 'message';

type SvgIconName = Exclude<AppIconName, 'family' | 'gift' | 'tree' | 'santa'>;

type AppIconProps = {
  name: AppIconName;
  size?: number;
  className?: string;
};

const imageIcons: Partial<Record<AppIconName, string>> = {
  family: 'https://cdn-icons-png.flaticon.com/512/2061/2061474.png',
  gift: 'https://cdn-icons-png.flaticon.com/512/3656/3656962.png',
  tree: 'https://cdn-icons-png.flaticon.com/512/2276/2276457.png',
  santa: 'https://cdn-icons-png.flaticon.com/512/9204/9204869.png',
};

const paths: Record<SvgIconName, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  members: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  contribution: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></>,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
  trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></>,
  lightbulb: <><path d="M9 18h6m-5 4h4m-2-20a7 7 0 0 0-4 12.7c.6.4 1 1.2 1 2.3h6c0-1.1.4-1.9 1-2.3A7 7 0 0 0 12 2Z" /></>,
  celebration: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 16 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2ZM5 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /></>,
  message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></>,
};

export default function AppIcon({ name, size = 20, className = '' }: AppIconProps) {
  const style: CSSProperties = { width: size, height: size, flex: '0 0 auto' };
  const image = imageIcons[name];
  if (image) {
    return <img src={image} alt="" aria-hidden="true" className={className} style={{ ...style, objectFit: 'contain' }} loading="lazy" />;
  }
  return (
    <svg
      aria-hidden="true"
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name as SvgIconName]}
    </svg>
  );
}
