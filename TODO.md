# Capitólio Premium - TODO de Correções e Melhorias

## 🔧 Correções de Deploy (Prioridade Alta)

- [x] Corrigir `eslint.config.mjs` - usar FlatCompat para Next.js 15 (sem aviso "not iterable")
- [x] Corrigir `app/globals.css` - atualizar para sintaxe Tailwind v4
- [x] Corrigir encoding (BOM + UTF-8) em `app/admin/page.tsx`
- [x] Corrigir encoding (BOM + UTF-8) em `app/reservar/page.tsx`
- [x] Corrigir encoding (BOM + UTF-8) em `lib/properties-data.ts`

## 📄 Páginas Faltando

- [x] Criar `app/propriedades/[slug]/page.tsx` - Detalhes da propriedade
- [x] Criar `app/admin/reservas/page.tsx` - Lista de reservas admin
- [x] Criar `app/admin/propriedades/page.tsx` - Gestão de propriedades admin
- [x] Criar `app/admin/servicos/page.tsx` - Gestão de serviços admin

## 🚀 Deploy

- [x] Commit e push para GitHub (commit: fe4a121)
- [x] Build local validado: 12/12 páginas geradas sem erros
- [ ] Verificar redeploy na Vercel (auto-deploy via GitHub)

## 📸 Próximos Passos (Pós-Deploy)

- [ ] Adicionar fotos reais do Google Drive
- [ ] Integração de pagamento (Stripe/Mercado Pago)
- [ ] Configurar WhatsApp com Evolution API + n8n
