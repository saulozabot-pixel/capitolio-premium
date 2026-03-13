import Link from 'next/link'

export default function TermosPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Uso</h1>

        <div className="bg-white rounded-2xl shadow p-8 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o site Capitólio Premium, você concorda com os presentes Termos de Uso.
              Caso não concorde com qualquer disposição destes termos, não utilize nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Reservas</h2>
            <p>
              As reservas realizadas através do nosso site são confirmadas somente após o contato da nossa equipe
              via WhatsApp ou e-mail. O pagamento confirma a reserva e garante a disponibilidade da propriedade
              nas datas escolhidas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cancelamento</h2>
            <p>
              Cancelamentos realizados com mais de 15 dias de antecedência do check-in têm direito a reembolso
              integral. Cancelamentos com menos de 15 dias podem estar sujeitos a taxas. Entre em contato
              com nossa equipe para mais informações.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Responsabilidades do Hóspede</h2>
            <p>
              O hóspede é responsável pelo bom uso e conservação da propriedade durante sua estadia.
              Danos causados à propriedade ou equipamentos serão cobrados ao responsável pela reserva.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Serviços de Concierge</h2>
            <p>
              Os serviços de concierge são agendados separadamente e sujeitos à disponibilidade.
              Os preços apresentados no site são valores de referência e podem variar conforme
              a temporada e especificidades do pedido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contato</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato pelo e-mail{' '}
              <a href="mailto:contato@capitoliopremium.com" className="text-blue-900 underline">
                contato@capitoliopremium.com
              </a>{' '}
              ou via WhatsApp.
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
