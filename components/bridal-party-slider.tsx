'use client'

import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

export default function BridalPartySlider({ images, heightClass = 'h-[280px] sm:h-[320px] md:h-[420px] lg:h-[480px]' }: { images: string[]; heightClass?: string }) {
  const [api, setApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    if (!api) return
    const id = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext()
      else api.scrollTo(0)
    }, 4000)
    return () => clearInterval(id)
  }, [api])

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl bridal-banner w-full">
      <Carousel opts={{ align: 'start', loop: true }} setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className={`relative w-full ${heightClass}`}>
                <img src={src} alt="Bridal party" className="w-full h-full object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 pointer-events-none">
          <span className="chip">Bridesmaids</span>
          <span className="chip">Groomsmen</span>
          <span className="chip">Family</span>
        </div>
        <CarouselPrevious className="-left-3 sm:-left-6" />
        <CarouselNext className="-right-3 sm:-right-6" />
      </Carousel>
    </div>
  )
}

