'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const slides = [
  {
    url: '/images/geral/canions-de-capitolio-mg.jpg',
    alt: 'Cânions de Capitólio - Vista aérea'
  },
  {
    url: '/images/geral/escarpas-do-lago-capitolio-mg.jpg',
    alt: 'Escarpas do Lago - Capitólio MG'
  },
  {
    url: '/images/geral/lagoa-azul-capitolio-mg.jpg',
    alt: 'Lagoa Azul - Capitólio MG'
  },
  {
    url: '/images/geral/lagoa-azul-capitolio-2.jpg',
    alt: 'Lagoa Azul - Capitólio MG'
  },
  {
    url: '/images/geral/mirante-dos-canions-capitolio-mg.jpg',
    alt: 'Mirante dos Cânions - Capitólio MG'
  },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === current ? 1 : 0 }}
        >
          <img
            src={slide.url}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <p className="text-blue-300 text-lg font-medium mb-4 tracking-widest uppercase">
          Capitólio, Minas Gerais
        </p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg leading-tight">
          Viva o Luxo à<br />Beira da Represa
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow text-gray-200">
          Mansões exclusivas com acesso direto à represa e vista panorâmica dos cânions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#casas"
            className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Ver Propriedades
          </Link>
          <Link
            href="/reservar"
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Reservar Agora
          </Link>
        </div>
      </div>

      {/* Dots de navegação */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? 'bg-white w-8 h-3'
                : 'bg-white/50 w-3 h-3 hover:bg-white/75'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Seta para baixo */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-10">
        <a
          href="#casas"
          className="text-white/70 hover:text-white transition animate-bounce"
          aria-label="Rolar para baixo"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
