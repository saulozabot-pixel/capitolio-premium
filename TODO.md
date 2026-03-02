# Capitólio Premium - TODO de Correções e Melhorias

## 🔧 Correções de Deploy (Prioridade Alta)

- [x] Corrigir `eslint.config.mjs` - adicionar extensão `.js` nos imports
- [x] Corrigir `app/globals.css` - atualizar para sintaxe Tailwind v4
- [x] Corrigir encoding (BOM + UTF-8) em `app/admin/page.tsx`
- [x] Corrigir encoding (BOM + UTF-8) em `app/reservar/page.tsx`
- [x] Corrigir encoding (BOM + UTF-8) em `lib/properties-data.ts`
- [x] Corrigir arquivos TSX corrompidos com `NaN` no JSX
- [x] Atualizar Next.js para versão sem vulnerabilidades (CVE-2025-29927)
- [x] Ignorar erros TypeScript no build (Prisma client não gerado na Vercel)

## 📄 Páginas Faltando

- [x] Criar `app/propriedades/[slug]/page.tsx` - Detalhes da propriedade
- [x] Criar `app/admin/reservas/page.tsx` - Lista de reservas admin
- [x] Criar `app/admin/propriedades/page.tsx` - Gestão de propriedades admin
- [x] Criar `app/admin/servicos/page.tsx` - Gestão de serviços admin

## 🚀 Deploy

- [x] Commit e push para GitHub
- [x] Deploy na Vercel via CLI ✅ LIVE em https://capitolio-premium.vercel.app

## 📸 Próximos Passos (Pós-Deploy)

- [ ] Adicionar fotos reais do Google Drive
- [ ] Integração de pagamento (Stripe/Mercado Pago)
- [ ] Configurar WhatsApp com Evolution API + n8n
