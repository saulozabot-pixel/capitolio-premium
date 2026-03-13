import Link from 'next/link'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            Capitólio Premium
          </Link>
          <Link href="/" className="text-gray-700 hover:text-blue-900">
            ← Voltar
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>

        <div className="bg-white rounded-2xl shadow p-8 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Dados Coletados</h2>
            <p>
              Coletamos dados fornecidos diretamente por você ao fazer uma reserva: nome completo,
              e-mail, telefone e CPF. Esses dados são usados exclusivamente para gerenciar sua reserva
              e entrar em contato com você.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Uso dos Dados</h2>
            <p>
              Seus dados são utilizados para: confirmar reservas, enviar informações sobre sua estadia,
              e melhorar nossos serviços. Não vendemos, alugamos ou compartilhamos seus dados pessoais
              com terceiros sem seu consentimento, exceto quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. WhatsApp e Comunicação</h2>
            <p>
              Ao informar seu número de telefone, você consente em receber comunicações via WhatsApp
              sobre sua reserva. Você pode solicitar a remoção do nosso contato a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Segurança</h2>
            <p>
              Adotamos medidas de segurança para proteger seus dados contra acesso não autorizado.
              Nossas transmissões de dados são protegidas por SSL/HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. LGPD</h2>
            <p>
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito
              de acessar, corrigir ou solicitar a exclusão de seus dados pessoais. Entre em contato conosco
              para exercer esses direitos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contato</h2>
            <p>
              Para questões relacionadas à privacidade dos seus dados, entre em contato pelo e-mail{' '}
              <a href="mailto:contato@capitoliopremium.com" className="text-blue-900 underline">
                contato@capitoliopremium.com
              </a>.
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4 border-t">
            Última atualização: março de 2026
          </p>
        </div>
      </div>
    </div>
  )
}
