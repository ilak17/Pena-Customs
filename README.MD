# Gestão de Reservas e Acompanhamento de Serviços - Oficina Mecânica

## Sobre o Projeto

Uma oficina mecânica local pretende digitalizar o seu processo de gestão de reservas e acompanhamento de serviços. O objetivo deste projeto é desenvolver uma plataforma que permita aos clientes marcar serviços e acompanhar o estado dos seus veículos, enquanto a oficina pode gerir os serviços de forma eficiente e emitir relatórios.

## Funcionalidades do Sistema

### • Área do Cliente:

- **Registo e Login:**
  - Os clientes podem registar-se na plataforma com dados pessoais (nome, email, contacto, etc.) e informações dos seus veículos (marca, modelo, matrícula, etc.).
  - Após o registo, os clientes podem fazer login para aceder às funcionalidades da plataforma.

- **Marcação de Serviços:**
  - Possibilidade de marcar serviços como revisão geral, troca de óleo, diagnóstico, reparação de motores, entre outros.
  - Seleção de data e hora, tipo de serviço e adição de observações.
  - Sujeição à confirmação por parte do administrador.

- **Consulta de Histórico de Intervenções:**
  - Visualização do histórico completo de todas as intervenções realizadas.
  - Inclui detalhes como data, tipo de serviço, custo e estado.

- **Acompanhamento do Estado do Veículo:**
  - Monitorização em tempo real do estado do serviço (pendente, em execução, concluído).
  - Notificações automáticas quando houver atualizações.

- **Notificações:**
  - Recebimento de notificações por email ou na plataforma sobre o estado dos serviços, lembretes de marcações e promoções especiais.

### • Área do Administrador:

- **Gestão de Serviços:**
  - Adicionar, editar ou eliminar serviços disponíveis na oficina.
  - Cada serviço deve ter uma descrição detalhada, preço e tempo estimado de execução.

- **Atualização do Estado das Intervenções:**
  - Atualizar o estado de cada intervenção (pendente, em execução, concluído) e adicionar observações técnicas.
  - As atualizações devem ser refletidas automaticamente na área do cliente.

- **Gestão de Clientes:**
  - Visualização e gestão dos clientes registados, incluindo os seus veículos e histórico de serviços.

- **Relatórios de Serviços Prestados:**
  - Geração de relatórios detalhados sobre os serviços prestados.
  - Inclui número de serviços por tipo, receitas geradas e tempo médio de execução.

- **Notificações Automáticas:**
  - Envio de notificações automáticas aos clientes quando o estado do seu serviço é alterado ou quando há promoções especiais.

## Tecnologias Utilizadas

### Backend - API

- Definição dos modelos de dados.
- Criação das rotas (CRUD).
- Mecanismo de ordenação (Sort).
- Mecanismo de pesquisa (Search).
- Login e Autenticação.
- Autorização (rotas de admin, rotas de clientes, rotas públicas).
- Mecanismo de alteração e recuperação de password.

### Frontend - Webapp (React)

- **Listagem do Catálogo:**
  - Paginação.
  - Ordenação (Sort).
  - Pesquisa Simples (Search).

- **Página de Detalhe de um Item.**

- **Zona de Admin:**
  - Listagem de itens.
  - Formulários de edição.
  - Upload de imagens/documentos.

- **Login:**
  - Gestão da sessão (expiração e logout).
  - Controle de acessos para admin e clientes.
  - Mecanismo de alteração de password.

- **Pesquisa Avançada:**
  - Tags.
  - Pesquisa por propriedades (nome, fabricante, etc.).
  - Funcionalidade de favoritos ou avaliação (comentários, estrelas, contas de utilizador).
