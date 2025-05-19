export type VideoCategory = 
  'gluteos' | 'femoral' | 'cuadriceps' | 'pecho' | 
  'tricep' | 'hombro' | 'espalda' | 'biceps' | 'pantorrilla';

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string; 
  duration: string;
  category: VideoCategory;
  uploadDate: string;
}