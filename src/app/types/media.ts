import type { LucideIcon } from "lucide-react";

export type InstagramMediaType = "video" | "gif";

export interface InstagramMediaItem {
  id: number;
  type: InstagramMediaType;
  /** Direct playable media URL (.mp4, .webm, etc. for video; .gif for gif). NOT an Instagram page URL. */
  mediaUrl: string;
  title: string;
  /** Instagram Reel/profile URL — used when the card is clicked. */
  instagramUrl: string;
  alt?: string;
}

export interface PortfolioVideo {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  category: string;
}

export interface PortfolioCategoryLink {
  driveUrl: string;
  preview: string;
  title: string;
  description: string;
}

export type ServiceBackgroundType = "image" | "video";

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  background: string;
  backgroundType: ServiceBackgroundType;
  backgroundAlt: string;
}
