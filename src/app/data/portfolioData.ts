import type { PortfolioCategoryLink, PortfolioVideo } from "../types/media";

import car1 from "../Assets/Works/Cars/Car-1.mp4";
import wedding1 from "../Assets/Works/Weedings/wedding-1.mp4";
import podcast1 from "../Assets/Works/Podcasts/podcast1.mp4";
import event1 from "../Assets/Works/Events/Event1.mp4";
import promotion1 from "../Assets/Works/Promotions/Promotion1.mp4";

/** Portfolio work items displayed in the masonry grid. */
export const portfolioVideos: PortfolioVideo[] = [
  {
    id: 1,
    thumbnail: wedding1,
    title: "Wedding",
    description: "A beautiful love story captured in cinematic perfection",
    category: "Weddings",
  },
  {
    id: 2,
    thumbnail: car1,
    title: "Luxury Car Showcase",
    description: "High-octane automotive cinematography",
    category: "Cars",
  },
  {
    id: 4,
    thumbnail: podcast1,
    title: "Inspiring Conversations",
    description: "Deep dives with thought leaders and creators",
    category: "Podcasts",
  },
  {
    id: 5,
    thumbnail: event1,
    title: "Exclusive Live Event Coverage",
    description: "Capturing the energy, scale, and unforgettable moments",
    category: "Events",
  },
  {
    id: 6,
    thumbnail: promotion1,
    title: "Social Media Campaign",
    description: "Viral-worthy content for Instagram & TikTok",
    category: "Promotions",
  },
];

/**
 * Google Drive links per portfolio category for the See More card.
 * Update `driveUrl` values with your actual Google Drive folder/file links.
 */
export const portfolioCategoryLinks: Record<string, PortfolioCategoryLink> = {
  All: {
    driveUrl: "https://drive.google.com/drive/folders/16UwZ6VZx8_iIeM3Uiv6uwK-dbLgrCkya",
    preview: wedding1,
    title: "Full Portfolio Collection",
    description: "Browse the complete archive of cinematic work on Google Drive",
  },
  Weddings: {
    driveUrl: "https://drive.google.com/drive/folders/19QXHQkaVAAsDXh3e2LlSMOFXadN4mnB1",
    preview: wedding1,
    title: "More Wedding Work",
    description: "View the full wedding portfolio on Google Drive",
  },
  Cars: {
    driveUrl: "https://drive.google.com/drive/folders/104deX0fZbmgwHTwg8m8waK5MNLMay3Wu",
    preview: car1,
    title: "More Car Cinematics",
    description: "Explore automotive shoots on Google Drive",
  },
  Podcasts: {
    driveUrl: "https://drive.google.com/drive/folders/13Oc-b5pxnmipvhVySh1jGk75DHMGb9nF",
    preview: podcast1,
    title: "More Podcast Highlights",
    description: "See all podcast reels and highlights on Google Drive",
  },
  Promotions: {
    driveUrl: "https://drive.google.com/drive/folders/YOUR_PROMOTIONS_FOLDER_ID",
    preview: promotion1,
    title: "More Brand Promotions",
    description: "Browse brand and promotion videos on Google Drive",
  },
  Events: {
    driveUrl: "https://drive.google.com/drive/folders/1GINWpNFWd6of-OQoEwOSdPtybq8FVTs8",
    preview: event1,
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
] as const;
