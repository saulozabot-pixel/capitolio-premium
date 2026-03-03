# Capitólio Premium - TODO de Correções e Melhorias

## ✅ Correções de Deploy (CONCLUÍDO)

- [x] Corrigir `eslint.config.mjs` - adicionar extensão `.js` nos imports
- [x] Corrigir `app/globals.css` - atualizar para sintaxe Tailwind v4
- [x] Corrigir encoding (BOM + UTF-8) em `app/admin/page.tsx`
- [x] Corrigir encoding (BOM + UTF-8) em `app/reservar/page.tsx`
- [x] Corrigir encoding (BOM + UTF-8) em `lib/properties-data.ts`

## ✅ Páginas Criadas (CONCLUÍDO)

- [x] Criar `app/propriedades/[slug]/page.tsx` - Detalhes da propriedade
- [x] Criar `app/admin/reservas/page.tsx` - Lista de reservas admin
- [x] Criar `app/admin/propriedades/page.tsx` - Gestão de propriedades admin
- [x] Criar `app/admin/servicos/page.tsx` - Gestão de serviços admin

## ✅ Novas Funcionalidades (CONCLUÍDO)

- [x] Hero Slideshow com 4 imagens Unsplash (crossfade 5s, dots navegação)
- [x] Fotos reais Unsplash nas propriedades da home
- [x] Autenticação admin cookie-based (senha: `capitolio2026`)
- [x] Página de login `/admin/login` com background Unsplash
- [x] API routes: `POST /api/admin/login` e `POST /api/admin/logout`
- [x] Componente `AdminNav` reutilizável com botão logout
- [x] `proxy.ts` (Next.js 16) - proteção de rotas `/admin/*`
- [x] Removido `middleware.ts` conflitante

## ✅ Deploy (CONCLUÍDO)

- [x] Build local passou (Next.js 16.1.6 Turbopack)
- [x] Commit e push para GitHub (branch: main)
- [x] Deploy na Vercel - **LIVE** ✅
- [x] Redirect 307 `/admin` → `/admin/login` funcionando ✅

## ✅ Botões Funcionais (CONCLUÍDO)

- [x] `app/admin/reservas/page.tsx` - Botões Ver (modal detalhes), Editar, Confirmar, Cancelar, + Nova Reserva com modal completo + filtros por status
- [x] `app/admin/servicos/page.tsx` - Botões Editar (modal com emoji picker), Ativar/Desativar, Remover, + Novo Serviço com modal completo
- [x] `app/admin/propriedades/page.tsx` - Upload de imagens do computador via file explorer (compressão automática com Canvas API) + preview + remoção individual
- [x] `app/reservar/page.tsx` - Pré-selecionar propriedade via URL param `?property=` + botão Confirmar envia mensagem via WhatsApp

## 🌐 URLs

- **Site:** https://capitolio-premium.vercel.app
- **Admin Login:** https://capitolio-premium.vercel.app/admin/login
- **Senha:** `capitolio2026`

## 📸 Próximos Passos (Pós-Deploy)

- [ ] Configurar número real do WhatsApp
- [ ] Adicionar fotos reais do Google Drive (substituir Unsplash)
- [ ] Integração de pagamento (Stripe/Mercado Pago)
- [ ] Configurar WhatsApp com Evolution API + n8n
- [ ] Configurar env var `ADMIN_PASSWORD` na Vercel (atualmente hardcoded)
