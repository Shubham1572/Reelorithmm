import type { InstagramMediaItem } from "../types/media";
import { CONTACT } from "../config/contact";

import weddingReel from "../Assets/Works/Weedings/wedding-1.mp4";
import carReel from "../Assets/Works/Cars/Car-1.mp4";
import podcastReel from "../Assets/Works/Podcasts/podcast1.mp4";
import haldi from "../Assets/Works/Weedings/Haldi.mp4";
import promotionReel from "../Assets/Works/Promotions/Promotion1.mp4";
import eventReel from "../Assets/Works/Events/Event1.mp4";

import weddingPoster from "../Assets/Posters/wedding-1.webp";
import carPoster from "../Assets/Posters/car-1.webp";
import podcastPoster from "../Assets/Posters/podcast1.webp";
import haldiPoster from "../Assets/Posters/haldi.webp";
import promotionPoster from "../Assets/Posters/promotion1.webp";
import eventPoster from "../Assets/Posters/event1.webp";

/**
 * Instagram Latest Reels — VIDEO and GIF only with lightweight posters.
 */
export const instagramMedia: InstagramMediaItem[] = [
  {
    id: 1,
    type: "video",
    mediaUrl: weddingReel,
    poster: weddingPoster,
    title: "Wedding First Look ✨",
    instagramUrl: "https://www.instagram.com/reel/DSHX44bjBGG/",
    alt: "Wedding first look reel preview",
  },
  {
    id: 2,
    type: "video",
    mediaUrl: carReel,
    poster: carPoster,
    title: "Luxury Car Showcase 🚗",
    instagramUrl: "https://www.instagram.com/reel/DU8iNpzknfg/",
    alt: "Luxury car showcase reel preview",
  },
  {
    id: 3,
    type: "video",
    mediaUrl: podcastReel,
    poster: podcastPoster,
    title: "Podcast Episode 🎬",
    instagramUrl: "https://www.instagram.com/reel/DWO2-uBDJgu/",
    alt: "Podcast episode reel preview",
  },
  {
    id: 4,
    type: "video",
    mediaUrl: promotionReel,
    poster: promotionPoster,
    title: "Promotions",
    instagramUrl: "https://www.instagram.com/reel/DUqRW9PjCW-/",
    alt: "Brand promotion reel preview",
  },
  {
    id: 5,
    type: "video",
    mediaUrl: haldi,
    poster: haldiPoster,
    title: "Haldi Ceremony 💕",
    instagramUrl: "https://www.instagram.com/reel/DVus7-wD2ve/",
    alt: "Haldi ceremony reel preview",
  },
  {
    id: 6,
    type: "video",
    mediaUrl: eventReel,
    poster: eventPoster,
    title: "Events Coverage",
    instagramUrl: "https://www.instagram.com/reel/DWS0LJjDCK8/",
    alt: "Events coverage reel preview",
  },
];

export const instagramProfileUrl = CONTACT.instagram.mainUrl;

