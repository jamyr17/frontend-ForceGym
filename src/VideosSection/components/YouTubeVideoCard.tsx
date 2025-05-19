import { Video } from '../types/video';

interface YouTubeVideoCardProps {
  video: Video;
}

export const YouTubeVideoCard = ({ video }: YouTubeVideoCardProps) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <div className="bg-black text-white rounded-xl overflow-hidden shadow-lg hover:shadow-yellow/20 transition-all duration-300 w-full border border-gray-800 hover:border-yellow group">
      <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative pb-[56.25%]"> {/* Mantiene relación de aspecto 16:9 */}
          <img 
            src={thumbnailUrl} 
            alt={video.title}
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
          />
          <span className="absolute bottom-2 right-2 bg-black/90 px-2 py-1 rounded-md text-xs font-medium text-yellow">
            {video.duration}
          </span>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <div className="bg-yellow rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M8 5v14l11-7z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </a>
      <div className="p-3">
        <h3 className="text-sm font-medium mb-2 text-white group-hover:text-yellow transition-colors duration-300 line-clamp-2">
          {video.title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/80">{video.category}</span>
          <span className="bg-yellow text-black text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            {video.category}
          </span>
        </div>
      </div>
    </div>
  );
};