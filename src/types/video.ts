export interface IVideo {
  id: number;
  thumb: string;
  duration: string;
  title: string;
  source: string;
  description: string;
  subtitle: string;
  playOnClick?: (id: number) => void;
  progress?: number;
}
