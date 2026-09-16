import os
import cv2
from PIL import Image

def process_videos():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(base_dir, "src", "app", "Assets")
    posters_dir = os.path.join(assets_dir, "Posters")
    os.makedirs(posters_dir, exist_ok=True)

    videos = [
        ("Weedings/wedding-1.mp4", "wedding-1.webp"),
        ("Weedings/Haldi.mp4", "haldi.webp"),
        ("Cars/Car-1.mp4", "car-1.webp"),
        ("Engagement/Engagement1.mp4", "engagement1.webp"),
        ("Events/Event1.mp4", "event1.webp"),
        ("Podcasts/podcast1.mp4", "podcast1.webp"),
        ("Promotions/Promotion1.mp4", "promotion1.webp"),
        ("Cafe/Cafe-1.MOV", "cafe.webp"),
    ]

    for rel_path, out_name in videos:
        video_path = os.path.join(assets_dir, "Works", rel_path)
        out_path = os.path.join(posters_dir, out_name)

        if not os.path.exists(video_path):
            print(f"File not found: {video_path}")
            continue

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"Failed to open video: {video_path}")
            continue

        # Read total frames and grab frame at ~1.0s or frame 30
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        frame_number = int(fps * 1.0)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        
        ret, frame = cap.read()
        if not ret:
            # Fallback to frame 0
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()

        if ret:
            # Convert BGR (OpenCV) to RGB (PIL)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(rgb_frame)
            
            # Save compressed WebP image
            img.save(out_path, "WEBP", quality=82, optimize=True)
            print(f"Generated poster: {out_name} ({img.size[0]}x{img.size[1]}) -> {os.path.getsize(out_path)} bytes")
        else:
            print(f"Could not read frame for {video_path}")

        cap.release()

def process_images():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(base_dir, "src", "app", "Assets")

    images = [
        ("Shubham Solanki.jpeg", "Shubham Solanki.webp"),
        ("Thumbnail/Thumbnail2.jpg", "Thumbnail/Thumbnail2.webp"),
        ("Review/1.png", "Review/1.webp"),
        ("Review/2.jpg", "Review/2.webp"),
        ("Review/3.jpg", "Review/3.webp"),
    ]

    for rel_path, out_name in images:
        img_path = os.path.join(assets_dir, rel_path)
        out_path = os.path.join(assets_dir, out_name)

        if not os.path.exists(img_path):
            print(f"Image not found: {img_path}")
            continue

        try:
            with Image.open(img_path) as img:
                img.save(out_path, "WEBP", quality=82, optimize=True)
                print(f"Optimized image: {out_name} -> {os.path.getsize(out_path)} bytes")
        except Exception as e:
            print(f"Error processing image {img_path}: {e}")

if __name__ == "__main__":
    print("Extracting video poster thumbnails...")
    process_videos()
    print("\nOptimizing static images...")
    process_images()
    print("\nAsset processing complete!")
