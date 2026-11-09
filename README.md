# Reservai App

Aplicativo React Native / Expo 58 para Android, iOS e web, com Expo Router e TanStack Query.

## Sobre
O Resevai é um aplicativo de reservas em React Native / Expo e NestJS, com PostgreSQL, aprovação por proprietário e atualizações por Socket.IO; interface em português brasileiro.

## Aparência e layout

Em **Perfil**, escolha **Claro**, **Escuro** ou **Automático**. A escolha fica salva neste dispositivo e é carregada antes da navegação. O modo automático acompanha o tema do sistema. A web prepara as cores antes da hidratação para evitar um fundo claro ao abrir o tema escuro.

O tema usa violeta e coral, fonte Manrope, ícones Feather, capas ilustradas por categoria e fotos quando cadastradas. Imagens que falham retornam à ilustração. Os tokens ficam em `src/theme/tokens.ts`; os componentes compartilhados usam `useTheme` de `src/theme/context.ts`.

O calendário permite selecionar até 90 dias; no celular, a solicitação e sua confirmação ficam na barra inferior. Reservas ativas e histórico têm listas separadas. A gestão reúne indicadores dos dados reais, informações do espaço, funcionamento com dias expansíveis e bloqueios.

As microinterações respeitam a preferência de movimento reduzido. `npm test` verifica calendário, contraste dos dois temas e configuração de rede; `npm run typecheck` e `npm run lint` verificam o código. Os bundles das três plataformas podem ser exportados com `npx expo export --platform all`.

Veja as imagens das telas do App em [/images](./images/).

## Emulador Android com Expo

Inicie a API em outro terminal, dentro de `reservai-api`, com `npm run start:dev`. Sem `EXPO_PUBLIC_API_URL`, durante o desenvolvimento nativo o app usa o endereço LAN do computador informado pelo Expo, na porta 3000. Isso também atende emuladores nos quais `10.0.2.2` não é acessível pelo app. Se não houver um endereço LAN no manifesto, Android usa `http://10.0.2.2:3000/api/v1`; web usa `http://localhost:3000/api/v1`.

Se você criou `.env` ou `.env.local` com `localhost`, remova a variável para usar a descoberta do Expo, ou configure explicitamente `EXPO_PUBLIC_API_URL=http://IP-DO-COMPUTADOR:3000/api/v1`. Essa variável tem prioridade sobre o padrão. Depois recarregue completamente o app no Expo; se necessário, reinicie com `npx expo start --clear`.

Para confirmar que a API está acessível, abra `http://IP-DO-COMPUTADOR:3000/api/v1/spaces` no navegador do emulador. Deve aparecer uma lista JSON. Builds instaláveis precisam ter a URL configurada durante o build; para distribuição, use uma API HTTPS. Os testes da seleção de endereço podem ser executados com `node --test test/network-config.test.mjs` (Node 22+ com suporte a TypeScript).


## Fluxos e regras

- Cliente: explorar → escolher data/horário → solicitar → acompanhar → cancelar antes do início.
- Proprietário: Perfil/Gestão → cadastrar espaço → configurar intervalos semanais → receber solicitações → aprovar, recusar ou cancelar.
- Horário fixo por espaço; grade semanal com pausas, sem cruzar a meia-noite. Datas no fuso `America/Sao_Paulo`, instantes armazenados em UTC e horizonte de 90 dias.
- Pendências e confirmações ocupam o intervalo. Pendências expiram no início; uma rotina a cada 15 segundos e verificações nas operações atualizam esse estado.
- A grade pode mudar preservando reservas existentes. Um bloqueio sobre uma reserva exige cancelamento prévio. Desativar o espaço impede novas solicitações, sem apagar o histórico.
- Transações bloqueiam a linha do espaço antes de reservar ou alterar sua agenda. A API retorna `409` em conflitos. Eventos são emitidos após commit, sem dados pessoais no canal público.
- Reservas não são reenviadas automaticamente após falha de rede; consulte “Reservas” antes de tentar novamente caso a resposta tenha sido perdida.