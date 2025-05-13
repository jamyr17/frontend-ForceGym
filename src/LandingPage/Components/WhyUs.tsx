import React, { useCallback, useMemo, useState } from 'react';

type FeatureOption = {
  img: string;
  title: string;
  desc: string;
};

type CoachOption = {
  img: string;
  name: string;
  text: string;
} | null;

type FeatureCardProps = {
  item: FeatureOption;
  isCoach: boolean;
  coach: CoachOption;
  onPrev?: () => void;
  onNext?: () => void;
};

const FeatureCard = ({
  item,
  isCoach,
  coach,
  onPrev,
  onNext,
}: FeatureCardProps) => {
  return (
    <div className="group relative">
      <div className="relative h-72 sm:h-80 overflow-hidden rounded-lg transform transition-transform duration-300 group-hover:scale-105 hover:shadow-yellow-500/30 hover:shadow-lg">
        <img
          src={isCoach ? coach?.img : item.img}
          alt={isCoach ? coach?.name : item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.75] transition-opacity duration-500 group-hover:opacity-90"
        />

        <div className="absolute inset-0 flex flex-col justify-between p-2 text-center z-10">
          <h3 className="text-xl sm:text-2xl font-extrabold mb-2 text-yellow-400">
            {isCoach ? coach?.name : item.title}
          </h3>
          <p className="w-full text-white text-center text-sm sm:text-base font-semibold transition-opacity duration-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:w-2/3 sm:mx-auto">
            {isCoach ? coach?.text : item.desc}
          </p>
        </div>

        {isCoach && onPrev && onNext && (
          <>
            <button
              onClick={onPrev}
              aria-label="Anterior entrenador"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl bg-black/50 text-white p-1 rounded-full 
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 
                hover:bg-gray-200 hover:text-black z-20"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              aria-label="Siguiente entrenador"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl bg-black/50 text-white p-1 rounded-full 
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 
                hover:bg-gray-200 hover:text-black z-20"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const MemoizedFeatureCard = React.memo(FeatureCard);

const WhyUs = () => {
  const features: FeatureOption[] = useMemo(
    () => [
      {
        img: '/LandingPage/coach.webp',
        title: 'ENTRENADORES ÉLITE',
        desc: 'Certificados para llevarte más allá de tus límites.',
      },
      {
        img: '/LandingPage/gym.webp',
        title: 'INSTALACIONES PREMIUM',
        desc: 'Equipo y espacio diseñado para el alto rendimiento.',
      },
      {
        img: '/LandingPage/resultados.webp',
        title: 'RESULTADOS GARANTIZADOS',
        desc: 'Seguimiento personalizado para maximizar tu potencial.',
      },
    ],
    []
  );

  const coachesInfo: CoachOption[] = useMemo(
    () => [
      {
        img: '/LandingPage/coach.webp',
        name: 'ENTRENADORES ÉLITE',
        text: 'Certificados para llevarte más allá de tus límites.',
      },
      {
        img: '/LandingPage/coach-1.webp',
        name: 'Kimberly',
        text: 'Entrenadora especializada en fuerza funcional y acondicionamiento físico.',
      },
      {
        img: '/LandingPage/coach-2.webp',
        name: 'Génesis',
        text: 'Nutricionista deportiva con enfoque integral en rendimiento.',
      },
      {
        img: '/LandingPage/coach-3.webp',
        name: 'Lucía',
        text: 'Coach personal con certificaciones internacionales en HIIT y movilidad.',
      },
    ],
    []
  );

  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);

  const nextCoach = useCallback(() => {
    setCurrentCoachIndex((prev) => (prev + 1) % coachesInfo.length);
  }, [coachesInfo.length]);

  const prevCoach = useCallback(() => {
    setCurrentCoachIndex((prev) =>
      prev === 0 ? coachesInfo.length - 1 : prev - 1
    );
  }, [coachesInfo.length]);

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 md:mb-4">
            ¿POR QUÉ <span className="text-yellow-500">FORCE GYM</span>?
          </h2>
          <div className="w-16 md:w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((item, index) => {
            const isCoach = item.title === 'ENTRENADORES ÉLITE';
            const coach = isCoach ? coachesInfo[currentCoachIndex] : null;

            return (
              <MemoizedFeatureCard
                key={index}
                item={item}
                isCoach={isCoach}
                coach={coach}
                onPrev={isCoach ? prevCoach : undefined}
                onNext={isCoach ? nextCoach : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
