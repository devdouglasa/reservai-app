# Redesign do Reservai — validação

O frontend recebeu temas claro, escuro e automático, fonte Manrope, ícones Feather, capas ilustradas, navegação responsiva, calendário mensal, horários com estados visuais e resumo/confirmação fixos no celular. O perfil salva a aparência localmente; a web prepara as cores antes da hidratação. Os contratos e o código da API foram preservados.

## Verificações concluídas

- `npm test`: 7 testes aprovados, cobrindo contraste AA dos pares de texto/ação nos dois temas, calendário, anos bissextos, horizonte de 90 dias e configuração de rede Android.
- TypeScript e lint aprovados; Expo Doctor com 20/20 verificações aprovadas.
- Exportação final concluída para web, Android e iOS.
- Web conferida em 390 × 844, 768 × 1024 e 1440 × 1000. Não foi observado excesso de largura horizontal nas visualizações móvel e tablet.
- Temas claro e escuro selecionados no perfil e preservados após recarregar. O modo automático acompanhou o sistema. O fundo inicial da web foi confirmado como `#14111F` com a preferência escura salva.
- Busca, filtro de categoria e estado sem resultados conferidos.
- Calendário mensal conferido, incluindo dias passados desabilitados e seleção fora da faixa inicial de 14 dias.
- Solicitação demonstrativa em 30/11/2026, às 11h, enviada pelo novo fluxo. O horário ficou indisponível; aprovação pelo proprietário atualizou a reserva e o indicador de pendências. Depois, a reserva de teste foi cancelada e apareceu no histórico.
- Editor conferido nas abas de informações, funcionamento e bloqueios. Um rascunho de nome foi preservado ao alternar abas e restaurado sem salvar; o funcionamento foi salvo sem alterar os horários existentes.
- Login/cadastro conferidos, incluindo alternância de formulário, mostrar/ocultar senha e mensagem de credenciais inválidas com dados fictícios.
- Atributos de acessibilidade de abas, opções de aparência, horários e dias expansíveis foram revisados.

## Capturas

- [Exploração clara no desktop](explore-light-desktop.jpg)
- [Exploração escura no desktop](explore-dark-desktop.jpg)
- [Exploração escura no tablet](explore-dark-tablet.jpg)
- [Exploração escura no celular](explore-dark-mobile.jpg)
- [Horário selecionado no celular](booking-light-mobile.jpg)
- [Confirmação no celular](booking-confirmation-mobile.jpg)
- [Preferências de aparência](profile-dark-mobile.jpg)
- [Cadastro no celular](register-dark-mobile.jpg)

