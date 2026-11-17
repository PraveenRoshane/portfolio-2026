import React from 'react';
import Earth from '@/src/components/ui/globe';
import { Sparkles } from '@/src/components/ui/sparkles';

export const HeroScene: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full overflow-hidden">
      <article className="grid gap-3 text-center relative z-10 w-full pt-2">
        <Earth />
      </article>

      <div
        aria-hidden="true"
        className="relative -mt-28 sm:-mt-32 h-64 sm:h-72 w-full overflow-hidden mask-[radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#3273ff,transparent_90%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[10%] after:border-t after:border-[#163474] after:bg-[#08132b]"
      >
        <Sparkles
          density={1200}
          className="absolute inset-x-0 bottom-0 h-full w-full"
        />
      </div>
    </div>
  );
};
