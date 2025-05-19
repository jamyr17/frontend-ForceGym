import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { YouTubeVideoCard } from './components/YoutubeVideoCard';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { videos } from './data/videos';
import { VideoCategory } from './types/video';

const allCategories: VideoCategory[] = [
  'gluteos', 'femoral', 'cuadriceps', 'pecho', 
  'tricep', 'hombro', 'espalda', 'biceps', 'pantorrilla'
];

export default function VideoSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(null);

  // Configuración de Fuse.js para búsqueda difusa
  const fuseOptions = {
    keys: ['title', 'description', 'category'],
    includeScore: true,
    threshold: 0.4, // Ajusta este valor para hacer la búsqueda más/menos estricta
    ignoreLocation: true,
    minMatchCharLength: 2,
    shouldSort: true,
  };

  // Memoize la instancia de Fuse para mejor rendimiento
  const fuse = useMemo(() => new Fuse(videos, fuseOptions), []);

  const filteredVideos = useMemo(() => {
    let result = videos;
    
    // Aplicar filtro de categoría primero
    if (selectedCategory) {
      result = result.filter(video => video.category === selectedCategory);
    }
    
    // Aplicar búsqueda difusa si hay término de búsqueda
    if (searchTerm.trim()) {
      const searchResults = fuse.search(searchTerm);
      result = searchResults.map(item => item.item);
    }
    
    return result;
  }, [searchTerm, selectedCategory, fuse]);

  return (
    <div className="bg-black min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex justify-center my-4">
            <img 
              src="/LogoBlack.jpg" 
              alt="Logo de Force GYM" 
              className="w-40 sm:w-60 h-auto rounded-lg shadow-lg" 
            />
          </div>
          <h1 className="text-3xl font-bold text-yellow mb-2">Sección de Videos de Ejercicios</h1>
          <p className="text-gray-400">Encuentra todos los ejercicios que se realizan en FORCE GYM</p>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
        
        {/* Filtro de categorías */}
        <div className="mb-8">
          <CategoryFilter 
            categories={allCategories}
            activeCategory={selectedCategory || undefined}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        {/* Grid de videos */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredVideos.map(video => (
              <YouTubeVideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron videos. Prueba con otros términos de búsqueda.</p>
            <button 
              className="mt-4 px-4 py-2 bg-yellow text-black rounded-md hover:bg-yellow transition-colors"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}