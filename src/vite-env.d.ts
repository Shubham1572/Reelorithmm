/// <reference types="vite/client" />
declare module 'react-responsive-masonry';

// Declare media file types
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}
