import Link from 'next/link'
import HeroSlideshow from '@/components/HeroSlideshow'

const properties = [
  {
    id: 'rancho-beira-represa',
    slug: 'rancho-beira-represa',
    name: 'Rancho à Beira da Represa',
    shortDesc: 'Mansão exclusiva com acesso direto à represa',
    bedrooms: 5,
    bathrooms: 6,
    maxGuests: 12,
    pricePerNight: 2500,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    badge: 'Destaque',
    badgeColor: 'bg-blue-900',
  },
  {
    id: 'casa-proxima',
    slug: 'casa-premium-capitolio',
    name: 'Casa Premium Capitólio',
    shortDesc: 'Casa moderna próxima à represa com todo conforto',
    bedrooms: 4,
    bathrooms: 5,
    maxGuests: 10,
    pricePerNight: 2200,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    badge: 'Popular',
    badgeColor: 'bg-green-600',
  },
]

const services = [
  {
    icon: '🛥️',
    title: 'Passeio de Lancha',
    desc: 'Explore os famosos cânions da represa de Furnas com nossa lancha privativa e guia especializado.',
    price: 'A partir de R$ 800',
  },
  {
    icon: '👨‍🍳',
    title: 'Chef Particular',
    desc: 'Chef profissional para preparar refeições exclusivas com ingredientes frescos e cardápio personalizado.',
    price: 'A partir de R$ 600',
  },
  {
    icon: '💆',
    title: 'Spa & Massagem',
    desc: 'Serviço de spa completo com massagens relaxantes, aromaterapia e tratamentos de beleza na sua propriedade.',
    price: 'A partir de R$ 400',
  },
  {
    icon: '🚁',
    title: 'Passeio de Helicóptero',
    desc: 'Vista aérea deslumbrante dos cânions e da represa de Capitólio em um passeio inesquecível.',
    price: 'A partir de R$ 1.200',
  },
  {
    icon: '🍷',
    title: 'Sommelier & Vinhos',
    desc: 'Seleção exclusiva de vinhos com sommelier particular para harmonização de refeições e eventos.',
    price: 'A partir de R$ 350',
  },
  {
    icon: '📸',
    title: 'Fotografia Profissional',
    desc: 'Sessão fotográfica profissional para registrar momentos especiais na represa e nas propriedades.',
    price: 'A partir de R$ 500',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            Capitólio Premium
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#casas" className="text-gray-700 hover:text-blue-900 transition">
              Casas
            </Link>
            <Link href="/#servicos" className="text-gray-700 hover:text-blue-900 transition">
              Serviços
            </Link>
            <Link href="/#contato" className="text-gray-700 hover:text-blue-900 transition">
              Contato
            </Link>
            <Link
              href="/reservar"
              className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition"
            >
              Reservar Agora
            </Link>
          </div>
          {/* Mobile menu button */}
          <Link href="/reservar" className="md:hidden bg-blue-900 text-white px-4 py-2 rounded-full text-sm">
            Reservar
          </Link>
        </nav>
      </header>

      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Stats Bar */}
      <section className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">2+</p>
              <p className="text-blue-200 text-sm">Propriedades Exclusivas</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-blue-200 text-sm">Hóspedes Satisfeitos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">6+</p>
              <p className="text-blue-200 text-sm">Serviços de Concierge</p>
            </div>
            <div>
              <p className="text-3xl font-bold">5★</p>
              <p className="text-blue-200 text-sm">Avaliação Média</p>
            </div>
          </div>
        </div>
      </section>

      {/* Casas Section */}
      <section id="casas" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2 tracking-widest uppercase text-sm">Nossas Propriedades</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mansões Exclusivas em Capitólio
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Propriedades selecionadas à beira da represa de Furnas, com todo o luxo e conforto que você merece
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <span className={`absolute top-4 left-4 ${property.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {property.badge}
                  </span>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs opacity-70 uppercase tracking-wide">Diárias</p>
                    <p className="text-2xl font-bold">R$ {property.pricePerNight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm opacity-80">/pessoa</p>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
                  <p className="text-gray-600 mb-4">{property.shortDesc}</p>

                  <div className="flex gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <span>🛏️</span> {property.bedrooms} quartos
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🚿</span> {property.bathrooms} banheiros
                    </span>
                    <span className="flex items-center gap-1">
                      <span>👥</span> até {property.maxGuests} hóspedes
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/propriedades/${property.slug}`}
                      className="flex-1 text-center border-2 border-blue-900 text-blue-900 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
                    >
                      Ver Detalhes
                    </Link>
                    <Link
                      href={`/reservar?property=${property.id}`}
                      className="flex-1 text-center bg-blue-900 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition"
                    >
                      Reservar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Capitólio Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <p className="text-blue-600 font-semibold mb-2 tracking-widest uppercase text-sm">Sobre o Destino</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Capitólio, o Paraíso dos Cânions
              </h2>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Conhecida como a &quot;Chapada Diamantina de Minas Gerais&quot;, Capitólio encanta com seus cânions de arenito vermelho e as águas esverdeadas da Represa de Furnas.
              </p>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                A apenas 4 horas de São Paulo e Belo Horizonte, é o destino perfeito para quem busca natureza exuberante com todo o conforto e luxo.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-blue-900">4h</p>
                  <p className="text-gray-600 text-sm">de São Paulo</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-blue-900">3h</p>
                  <p className="text-gray-600 text-sm">de Belo Horizonte</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Cânions de Capitólio"
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-900 text-white p-6 rounded-2xl shadow-xl">
                <p className="text-3xl font-bold">★ 4.9</p>
                <p className="text-blue-200 text-sm">Avaliação dos hóspedes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2 tracking-widest uppercase text-sm">Concierge Premium</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Serviços Exclusivos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Experiências personalizadas para tornar sua estadia ainda mais especial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.desc}</p>
                <p className="text-blue-900 font-semibold">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold mb-2 tracking-widest uppercase text-sm">Galeria</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Momentos Inesquecíveis</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" alt="Piscina" className="rounded-xl h-48 w-full object-cover hover:opacity-90 transition" />
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80" alt="Villa" className="rounded-xl h-48 w-full object-cover hover:opacity-90 transition" />
            <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80" alt="Beira d'água" className="rounded-xl h-48 w-full object-cover hover:opacity-90 transition" />
            <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80" alt="Mansão" className="rounded-xl h-48 w-full object-cover hover:opacity-90 transition" />
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" alt="Cânions" className="rounded-xl h-48 w-full object-cover hover:opacity-90 transition col-span-2" />
            <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80" alt="Pôr do sol" className="rounded-xl h-48 w-full object-cover hover:opacity-90 transition" />
            <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80" alt="Quarto luxo" className="rounded-xl h-48 w-full object-cover hover:opacity-90 transition" />
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-300 font-semibold mb-2 tracking-widest uppercase text-sm">Fale Conosco</p>
            <h2 className="text-4xl font-bold mb-4">Pronto para Reservar?</h2>
            <p className="text-blue-200 max-w-2xl mx-auto text-lg">
              Entre em contato e nossa equipe cuidará de todos os detalhes da sua estadia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur p-6 rounded-2xl text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
              <p className="text-blue-200 mb-4 text-sm">Atendimento rápido e personalizado</p>
              <a
                href="https://wa.me/5535999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition inline-block"
              >
                Chamar no WhatsApp
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur p-6 rounded-2xl text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-blue-200 mb-4 text-sm">contato@capitoliopremium.com</p>
              <a
                href="mailto:contato@capitoliopremium.com"
                className="bg-white text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition inline-block"
              >
                Enviar Email
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur p-6 rounded-2xl text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-xl font-bold mb-2">Reserva Online</h3>
              <p className="text-blue-200 mb-4 text-sm">Disponibilidade em tempo real</p>
              <Link
                href="/reservar"
                className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition inline-block"
              >
                Verificar Datas
              </Link>
            </div>
          </div>

          <div className="text-center text-blue-300 text-sm">
            <p>Segunda a Domingo: 8h às 22h</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Capitólio Premium</h3>
              <p className="text-gray-400 mb-4">
                Experiências de luxo à beira da Represa de Furnas em Capitólio, Minas Gerais
              </p>
              <p className="text-gray-500 text-sm">📍 Capitólio, MG - Brasil</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-200">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><Link href="/#casas" className="text-gray-400 hover:text-white transition">Propriedades</Link></li>
                <li><Link href="/#servicos" className="text-gray-400 hover:text-white transition">Serviços</Link></li>
                <li><Link href="/reservar" className="text-gray-400 hover:text-white transition">Fazer Reserva</Link></li>
                <li><Link href="/#contato" className="text-gray-400 hover:text-white transition">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-200">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/termos" className="text-gray-400 hover:text-white transition">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="text-gray-400 hover:text-white transition">Privacidade</Link></li>
                <li><Link href="/admin" className="text-gray-400 hover:text-white transition">Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; 2026 Capitólio Premium. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
