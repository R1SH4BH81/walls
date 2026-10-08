export interface Wallpaper {
  id: string;
  name: string;
  category: string;
  url: string;
  thumb: string;
  author: string;
}

export interface WallpapersData {
  wall: Record<string, Wallpaper[]>;
}
