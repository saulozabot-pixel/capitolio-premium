'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface MediaGalleryProps {
  images: string[]
  propertyName: string
}

export default function MediaGallery({ images, propertyName }: MediaGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = 'unset'
  }, [])

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeLightbox, nextImage, prevImage])

  if (!images || images.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Main Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
        <div 
          className="md:col-span-2 md:row-span-2 relative cursor-pointer group overflow-hidden rounded-2xl"
          onClick={() => openLightbox(0)}
        >
          <img 
            src={images[0]} 
            alt={`${propertyName} - Principal`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <Maximize2 className="w-5 h-5 text-blue-900" />
          </div>
        </div>

        {images.slice(1, 4).map((img, idx) => (
          <div 
            key={idx}
            className="relative cursor-pointer group overflow-hidden rounded-2xl h-full"
            onClick={() => openLightbox(idx + 1)}
          >
            <img 
              src={img} 
              alt={`${propertyName} ${idx + 2}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          </div>
        ))}

        {images.length > 4 && (
          <div 
            className="relative cursor-pointer group overflow-hidden rounded-2xl h-full bg-gray-200 flex items-center justify-center"
            onClick={() => openLightbox(4)}
          >
            <img 
              src={images[4]} 
              alt={`${propertyName} mais`}
              className="w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-blue-900/40 flex flex-col items-center justify-center text-white p-4 text-center">
              <span className="text-2xl font-bold">+{images.length - 4}</span>
              <span className="text-sm font-medium">Ver todas as fotos</span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2 bg-white/10 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-3 bg-white/10 rounded-full hover:bg-white/20"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button 
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-3 bg-white/10 rounded-full hover:bg-white/20"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12">
            <div className="relative max-w-6xl max-h-[80vh] w-full h-full flex items-center justify-center">
              <img 
                src={images[currentIndex]} 
                alt={`${propertyName} - ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
              />
            </div>
            
            {/* Counter and Thumbnails strip */}
            <div className="mt-8 text-white/60 text-sm font-medium flex flex-col items-center gap-4">
              <span>{currentIndex + 1} / {images.length}</span>
              <div className="flex gap-2 overflow-x-auto max-w-4xl p-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      idx === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
