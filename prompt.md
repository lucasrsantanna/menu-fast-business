# Prompt do Projeto Menu Fast Business

## Descrição Geral
O Menu Fast Business é um sistema completo para gestão de restaurantes, lanchonetes e estabelecimentos alimentícios, oferecendo funcionalidades de controle de pedidos, produtos, promoções, agendamento de posts, feedbacks, usuários, configurações e integração com WhatsApp.

---

## Funcionalidades Principais

### 1. Dashboard de Pedidos
- Visualização de pedidos em formato Kanban (Recebido, Em Preparo, Pronto, Entregue)
- Filtros por data, tipo de pedido e status
- Detalhamento de pedidos e alteração de status via drag-and-drop
- Finalização de pedidos com atualização automática de estoque
- Gerenciamento de mesas (livre, ocupada, suja) e reservas
- Solicitação de feedback ao cliente (WhatsApp ou simulado)

### 2. Gestão de Produtos
- Cadastro, edição e exclusão de produtos
- Filtros por nome, categoria, status e estoque
- Controle de estoque (incluindo alerta de baixo estoque e débito automático após pedidos)
- Modal para atualização rápida de estoque
- Suporte a múltiplas categorias de produtos

### 3. Promoções e Cupons
- Cadastro, edição e exclusão de promoções e cupons
- Tipos: Cupom de desconto e Promoção do Dia
- Ativação/expiração de promoções
- Visualização de resultados consolidados (usos, receita gerada)
- Modal para análise de resultados de cada promoção

### 4. Agendamento de Posts
- Agendamento de posts para redes sociais
- Edição, exclusão e visualização de posts agendados
- Visualização em calendário e lista
- Modal para análise de resultados de cada post
- Suporte a recorrência e datas customizadas

### 5. Feedbacks
- Visualização de feedbacks internos dos clientes
- Integração com avaliações do Google (Google Reviews)
- Cálculo de média geral das avaliações
- Exibição dos últimos feedbacks recebidos

### 6. Gestão de Usuários
- Cadastro, edição e exclusão de usuários
- Definição de cargos (Dono, Atendente, Cozinha, Marketing)
- Controle granular de permissões (visualização, pedidos, produtos, posts, relatórios, configurações, usuários, WhatsApp)
- Acesso total para o Dono

### 7. Configurações
- Edição de informações do restaurante (nome, logo, contatos)
- Configuração de horários de funcionamento
- Definição de tipos de frete (fixo, por zona, por km)
- Gerenciamento de zonas de entrega
- Link público do cardápio
- Logout do sistema

### 8. Pedidos via WhatsApp
- Visualização e busca de pedidos recebidos pelo WhatsApp
- Abertura direta do chat com o cliente
- Kanban de pedidos WhatsApp (exemplo: Novos Pedidos)

---

## Design e Padrão Visual
- **Framework de UI:** React
- **Estilização:** Tailwind CSS customizado (cores, espaçamentos, bordas, animações)
- **Componentes de UI:** Shadcn UI (baseados em Radix UI, como Button, Dialog, Card, Tabs, Table, etc.)
- **Layout:** Sidebar fixa no desktop, menu lateral mobile, responsivo
- **Cores:** Paleta baseada em variáveis CSS customizadas (ex: primary, secondary, status)
- **Ícones:** Lucide React
- **Animações:** Framer Motion e Tailwind Animate
- **Acessibilidade:** Foco visível, navegação por teclado, contraste adequado

---

## Observações
- O sistema utiliza Firebase para autenticação, banco de dados e armazenamento de dados em tempo real.
- Todas as operações de CRUD são feitas em subcoleções do Firestore por empresa (usuário autenticado).
- O design prioriza clareza, usabilidade e adaptação a diferentes dispositivos.

---

Este prompt resume todas as funcionalidades e o padrão visual do Menu Fast Business conforme o código-fonte atual do projeto. 