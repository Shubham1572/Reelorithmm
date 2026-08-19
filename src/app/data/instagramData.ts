import type { InstagramMediaItem } from "../types/media";
import { CONTACT } from "../config/contact";

import weddingReel from "../Assets/Works/Weedings/wedding-1.mp4";
import carReel from "../Assets/Works/Cars/Car-1.mp4";
import podcastReel from "../Assets/Works/Podcasts/podcast1.mp4";
import haldi from "../Assets/Works/Weedings/Haldi.mp4";
import promotionReel from "../Assets/Works/Promotions/Promotion1.mp4";
import eventReel from "../Assets/Works/Events/Event1.mp4";

/**
 * Instagram Latest Reels — VIDEO and GIF only.
 *
 * mediaUrl  = direct playable file (.mp4 / .gif). Never use an instagram.com/reel/… URL here.
 * instagramUrl = Instagram Reel link opened when the user clicks the card.
 *
 * GIF files: place under public/instagram/ and reference as "/instagram/your-file.gif".
 */
export const instagramMedia: InstagramMediaItem[] = [
  {
    id: 1,
    type: "video",
    mediaUrl: weddingReel,
    title: "Wedding First Look ✨",
    instagramUrl: "https://www.instagram.com/reel/DSHX44bjBGG/",
    alt: "Wedding first look reel preview",
  },
  {
    id: 2,
    type: "video",
    mediaUrl: carReel,
    title: "Luxury Car Showcase 🚗",
    instagramUrl: "https://www.instagram.com/reel/DU8iNpzknfg/",
    alt: "Luxury car showcase reel preview",
  },
  {
    id: 3,
    type: "video",
    mediaUrl: podcastReel,
    title: "Podcast Episode 🎬",
    instagramUrl: "https://www.instagram.com/reel/DWO2-uBDJgu/",
    alt: "Podcast episode reel preview",
  },
  {
    id: 4,
    type: "video",
    mediaUrl: promotionReel,
    title: "Promotions",
    instagramUrl: "https://www.instagram.com/reel/DUqRW9PjCW-/",
    alt: "Brand promotion reel preview",
  },
  {
    id: 5,
    type: "video",
    /** Add your GIF to public/instagram/haldi-ceremony.gif — see public/instagram/README.txt */
    mediaUrl: haldi,
    title: "Haldi Ceremony 💕",
    instagramUrl: "https://www.instagram.com/reel/DVus7-wD2ve/",
    alt: "Haldi ceremony reel preview",
  },
  {
    id: 6,
    type: "video",
    mediaUrl: eventReel,
    title: "Events Coverage",
    instagramUrl: "https://www.instagram.com/reel/DWS0LJjDCK8/",
    alt: "Events coverage reel preview",
  },
];

export const instagramProfileUrl = CONTACT.instagram.main;
