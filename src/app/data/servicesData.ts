import { Heart, Camera, Car, Building2, Smartphone, Mic, Film, Coffee } from "lucide-react";
import type { ServiceItem } from "../types/media";

import weddingBg from "../Assets/Posters/wedding-1.webp";
import EngageBg from "../Assets/Posters/engagement1.webp";
import carBg from "../Assets/Posters/car-1.webp";
import promotionBg from "../Assets/Posters/promotion1.webp";
import socialBg from "../Assets/Thumbnail/Thumbnail2.webp";
import podcastBg from "../Assets/Posters/podcast1.webp";
import eventBg from "../Assets/Posters/event1.webp";
import cafePoster from "../Assets/Posters/cafe.webp";

/**
 * Service cards with optimized background media.
 */
export const services: ServiceItem[] = [
  {
    icon: Heart,
    title: "Wedding Cinematic Reels",
    description:
      "Capture your special day with emotion-driven storytelling and breathtaking visuals.",
    background: weddingBg,
    poster: weddingBg,
    backgroundType: "image",
    backgroundAlt: "Wedding cinematic reel background",
  },
  {
    icon: Camera,
    title: "Engagement Shoots",
    description: "Beautiful, romantic cinematography that celebrates your love story.",
    background: EngageBg,
    poster: EngageBg,
    backgroundType: "image",
    backgroundAlt: "Engagement shoot background",
  },
  {
    icon: Car,
    title: "Car Cinematic Shoots",
    description: "Dynamic automotive videography with high-end production quality.",
    background: carBg,
    poster: carBg,
    backgroundType: "image",
    backgroundAlt: "Car cinematic shoot background",
  },
  {
    icon: Building2,
    title: "Hotel & Brand Promotions",
    description:
      "Luxury brand content that elevates your business and captivates your audience.",
    background: promotionBg,
    poster: promotionBg,
    backgroundType: "image",
    backgroundAlt: "Brand promotion background",
  },
  {
    icon: Coffee,
    title: "Cafe Promotional Videos",
    description:
      "Showcase your cafe's atmosphere, menu, and signature moments with inviting cinematic content.",
    background: cafePoster,
    poster: cafePoster,
    backgroundType: "image",
    backgroundAlt: "Cafe promotional video background",
  },
  {
    icon: Smartphone,
    title: "Social Media Reels",
    description: "Viral-worthy content designed to engage and grow your online presence.",
    background: socialBg,
    poster: socialBg,
    backgroundType: "image",
    backgroundAlt: "Social media reels background",
  },
  {
    icon: Mic,
    title: "Podcast Highlights",
    description:
      "Engaging, high-quality snippets specifically tailored to boost your podcast's reach and audience engagement.",
    background: podcastBg,
    poster: podcastBg,
    backgroundType: "image",
    backgroundAlt: "Podcast highlights background",
  },
  {
    icon: Film,
    title: "Event-Full Video Shoots",
    description:
      "Comprehensive end-to-end video production and full shoot coverage, ensuring no detail is missed.",
    background: eventBg,
    poster: eventBg,
    backgroundType: "image",
    backgroundAlt: "Full video shoot background",
  },
];

