# Capitólio Premium - TODO de Correções e Melhorias

## 🔧 Correções de Deploy (Prioridade Alta)

- [ ] Corrigir `eslint.config.mjs` - adicionar extensão `.js` nos imports
- [ ] Corrigir `app/globals.css` - atualizar para sintaxe Tailwind v4
- [ ] Corrigir encoding (BOM + UTF-8) em `app/admin/page.tsx`
- [ ] Corrigir encoding (BOM + UTF-8) em `app/reservar/page.tsx`
- [ ] Corrigir encoding (BOM + UTF-8) em `lib/properties-data.ts`

## 📄 Páginas Faltando

- [ ] Criar `app/propriedades/[slug]/page.tsx` - Detalhes da propriedade
- [ ] Criar `app/admin/reservas/page.tsx` - Lista de reservas admin
- [ ] Criar `app/admin/propriedades/page.tsx` - Gestão de propriedades admin
- [ ] Criar `app/admin/servicos/page.tsx` - Gestão de serviços admin

## 🚀 Deploy

- [ ] Commit e push para GitHub
- [ ] Redeploy na Vercel

## 📸 Próximos Passos (Pós-Deploy)

- [ ] Adicionar fotos reais do Google Drive
- [ ] Integração de pagamento (Stripe/Mercado Pago)
- [ ] Configurar WhatsApp com Evolution API + n8n
