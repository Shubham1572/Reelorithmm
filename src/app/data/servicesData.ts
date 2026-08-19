import { Heart, Camera, Car, Building2, Smartphone, Mic, Film } from "lucide-react";
import type { ServiceItem } from "../types/media";

import weddingBg from "../Assets/Works/Weedings/wedding-1.mp4";
import EngageBg from "../Assets/Works/Engagement/Engagement1.mp4";
import carBg from "../Assets/Works/Cars/Car-1.mp4";
import promotionBg from "../Assets/Works/Promotions/Promotion1.mp4";
import socialBg from "../Assets/Thumbnail/Thumbnail2.jpg";
import podcastBg from "../Assets/Works/Podcasts/podcast1.mp4";
import eventBg from "../Assets/Works/Events/Event1.mp4";

/**
 * Service cards with background media.
 * Replace `background` paths to swap images/videos per service.
 */
export const services: ServiceItem[] = [
  {
    icon: Heart,
    title: "Wedding Cinematic Reels",
    description:
      "Capture your special day with emotion-driven storytelling and breathtaking visuals.",
    background: weddingBg,
    backgroundType: "video",
    backgroundAlt: "Wedding cinematic reel background",
  },
  {
    icon: Camera,
    title: "Engagement Shoots",
    description: "Beautiful, romantic cinematography that celebrates your love story.",
    background: EngageBg,
    backgroundType: "video",
    backgroundAlt: "Engagement shoot background",
  },
  {
    icon: Car,
    title: "Car Cinematic Shoots",
    description: "Dynamic automotive videography with high-end production quality.",
    background: carBg,
    backgroundType: "video",
    backgroundAlt: "Car cinematic shoot background",
  },
  {
    icon: Building2,
    title: "Hotel & Brand Promotions",
    description:
      "Luxury brand content that elevates your business and captivates your audience.",
    background: promotionBg,
    backgroundType: "video",
    backgroundAlt: "Brand promotion background",
  },
  {
    icon: Smartphone,
    title: "Social Media Reels",
    description: "Viral-worthy content designed to engage and grow your online presence.",
    background: socialBg,
    backgroundType: "image",
    backgroundAlt: "Social media reels background",
  },
  {
    icon: Mic,
    title: "Podcast Highlights",
    description:
      "Engaging, high-quality snippets specifically tailored to boost your podcast's reach and audience engagement.",
    background: podcastBg,
    backgroundType: "video",
    backgroundAlt: "Podcast highlights background",
  },
  {
    icon: Film,
    title: "Event-Full Video Shoots",
    description:
      "Comprehensive end-to-end video production and full shoot coverage, ensuring no detail is missed.",
    background: eventBg,
    backgroundType: "video",
    backgroundAlt: "Full video shoot background",
  },
];
