import type { PortfolioCategoryLink, PortfolioVideo } from "../types/media";

import car1 from "../Assets/Works/Cars/Car-1.mp4";
import wedding1 from "../Assets/Works/Weedings/wedding-1.mp4";
import podcast1 from "../Assets/Works/Podcasts/podcast1.mp4";
import event1 from "../Assets/Works/Events/Event1.mp4";
import promotion1 from "../Assets/Works/Promotions/Promotion1.mp4";
import cafe1 from "../Assets/Works/Cafe/Cafe-1.MOV";

import carPoster from "../Assets/Posters/car-1.webp";
import weddingPoster from "../Assets/Posters/wedding-1.webp";
import podcastPoster from "../Assets/Posters/podcast1.webp";
import eventPoster from "../Assets/Posters/event1.webp";
import promotionPoster from "../Assets/Posters/promotion1.webp";
import cafePoster from "../Assets/Posters/cafe.webp";

/** Portfolio work items displayed in the masonry grid. */
export const portfolioVideos: PortfolioVideo[] = [
  {
    id: 1,
    thumbnail: weddingPoster,
    poster: weddingPoster,
    videoUrl: wedding1,
    title: "Wedding",
    description: "A beautiful love story captured in cinematic perfection",
    category: "Weddings",
  },
  {
    id: 2,
    thumbnail: carPoster,
    poster: carPoster,
    videoUrl: car1,
    title: "Luxury Car Showcase",
    description: "High-octane automotive cinematography",
    category: "Cars",
  },
  {
    id: 4,
    thumbnail: podcastPoster,
    poster: podcastPoster,
    videoUrl: podcast1,
    title: "Inspiring Conversations",
    description: "Deep dives with thought leaders and creators",
    category: "Podcasts",
  },
  {
    id: 5,
    thumbnail: eventPoster,
    poster: eventPoster,
    videoUrl: event1,
    title: "Exclusive Live Event Coverage",
    description: "Capturing the energy, scale, and unforgettable moments",
    category: "Events",
  },
  {
    id: 6,
    thumbnail: promotionPoster,
    poster: promotionPoster,
    videoUrl: promotion1,
    title: "Social Media Campaign",
    description: "Viral-worthy content for Instagram & TikTok",
    category: "Promotions",
  },
  {
    id: 7,
    thumbnail: cafePoster,
    poster: cafePoster,
    videoUrl: cafe1,
    title: "Cafe Promotion",
    description: "Inviting cafe visuals that turn atmosphere and flavor into a story",
    category: "Cafe",
  },
];

/**
 * Google Drive links per portfolio category for the See More card.
 */
export const portfolioCategoryLinks: Record<string, PortfolioCategoryLink> = {
  All: {
    driveUrl: "https://drive.google.com/drive/folders/16UwZ6VZx8_iIeM3Uiv6uwK-dbLgrCkya",
    preview: weddingPoster,
    poster: weddingPoster,
    title: "Full Portfolio Collection",
    description: "Browse the complete archive of cinematic work on Google Drive",
  },
  Weddings: {
    driveUrl: "https://drive.google.com/drive/folders/19QXHQkaVAAsDXh3e2LlSMOFXadN4mnB1",
    preview: weddingPoster,
    poster: weddingPoster,
    title: "More Wedding Work",
    description: "View the full wedding portfolio on Google Drive",
  },
  Cars: {
    driveUrl: "https://drive.google.com/drive/folders/104deX0fZbmgwHTwg8m8waK5MNLMay3Wu",
    preview: carPoster,
    poster: carPoster,
    title: "More Car Cinematics",
    description: "Explore automotive shoots on Google Drive",
  },
  Podcasts: {
    driveUrl: "https://drive.google.com/drive/folders/13Oc-b5pxnmipvhVySh1jGk75DHMGb9nF",
    preview: podcastPoster,
    poster: podcastPoster,
    title: "More Podcast Highlights",
    description: "See all podcast reels and highlights on Google Drive",
  },
  Promotions: {
    driveUrl: "https://drive.google.com/drive/folders/YOUR_PROMOTIONS_FOLDER_ID",
    preview: promotionPoster,
    poster: promotionPoster,
    title: "More Brand Promotions",
    description: "Browse brand and promotion videos on Google Drive",
  },
  Events: {
    driveUrl: "https://drive.google.com/drive/folders/1GINWpNFWd6of-OQoEwOSdPtybq8FVTs8",
    preview: eventPoster,
    poster: eventPoster,
    title: "More Event Coverage",
    description: "View complete event coverage on Google Drive",
  },
};

export const portfolioCategories = [
  "All",
  "Weddings",
  "Cars",
  "Podcasts",
  "Promotions",
  "Events",
  "Cafe",
] as const;

