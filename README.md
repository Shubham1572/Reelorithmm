# Reelorithmm

A premium cinematic videography portfolio website showcasing wedding reels, car shoots, brand promotions, and social media content.

## Features

- **Responsive Design** - Optimized for all devices
- **Performance Optimized** - Lazy loading, code splitting, and optimized assets
- **Smooth Animations** - Powered by Framer Motion
- **Video Portfolio** - Masonry layout with category filtering
- **Contact Form** - Direct email integration
- **Social Media Integration** - Instagram reels showcase

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

```bash
npm run dev
```

The development server will start at `http://localhost:5173/`

### Production Build

```bash
npm run build
```

The optimized build will be output to the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── Assets/          # Images and videos
│   ├── components/      # React components
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── InstagramSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── VideoModal.tsx
│   │   └── Footer.tsx
│   └── App.tsx
├── styles/              # CSS files
├── main.tsx
└── vite-env.d.ts
```

## Performance Optimizations

- Code splitting with manual chunks
- Lazy loading for images and videos
- Intersection Observer for viewport detection
- Terser minification
- Optimized dependencies pre-bundling

## License

All rights reserved. © 2026 Reelorithmm.