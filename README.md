# Reservai App

Aplicativo React Native / Expo 58 para Android, iOS e web, com Expo Router e TanStack Query.

Consulte o [guia completo](../README.md) para configurar a API, autenticação, execução em dispositivo físico e validação.

Comandos principais: `npm start`, `npm run web`, `npm run lint`, `npx tsc --noEmit`, `npx expo-doctor`, `npx expo export --platform web`.

Configure `EXPO_PUBLIC_API_URL` conforme `.env.example`. Toda a interface usa português brasileiro e o fuso de São Paulo.

## Aparência e layout

Em **Perfil**, escolha **Claro**, **Escuro** ou **Automático**. A escolha fica salva neste dispositivo e é carregada antes da navegação. O modo automático acompanha o tema do sistema. A web prepara as cores antes da hidratação para evitar um fundo claro ao abrir o tema escuro.

O tema usa violeta e coral, fonte Manrope, ícones Feather, capas ilustradas por categoria e fotos quando cadastradas. Imagens que falham retornam à ilustração. Os tokens ficam em `src/theme/tokens.ts`; os componentes compartilhados usam `useTheme` de `src/theme/context.ts`.

O calendário permite selecionar até 90 dias; no celular, a solicitação e sua confirmação ficam na barra inferior. Reservas ativas e histórico têm listas separadas. A gestão reúne indicadores dos dados reais, informações do espaço, funcionamento com dias expansíveis e bloqueios.

As microinterações respeitam a preferência de movimento reduzido. `npm test` verifica calendário, contraste dos dois temas e configuração de rede; `npm run typecheck` e `npm run lint` verificam o código. Os bundles das três plataformas podem ser exportados com `npx expo export --platform all`.

## Emulador Android com Expo

Inicie a API em outro terminal, dentro de `reservai-api`, com `npm run start:dev`. Sem `EXPO_PUBLIC_API_URL`, durante o desenvolvimento nativo o app usa o endereço LAN do computador informado pelo Expo, na porta 3000. Isso também atende emuladores nos quais `10.0.2.2` não é acessível pelo app. Se não houver um endereço LAN no manifesto, Android usa `http://10.0.2.2:3000/api/v1`; web usa `http://localhost:3000/api/v1`.

Se você criou `.env` ou `.env.local` com `localhost`, remova a variável para usar a descoberta do Expo, ou configure explicitamente `EXPO_PUBLIC_API_URL=http://IP-DO-COMPUTADOR:3000/api/v1`. Essa variável tem prioridade sobre o padrão. Depois recarregue completamente o app no Expo; se necessário, reinicie com `npx expo start --clear`.

Para confirmar que a API está acessível, abra `http://IP-DO-COMPUTADOR:3000/api/v1/spaces` no navegador do emulador. Deve aparecer uma lista JSON. Builds instaláveis precisam ter a URL configurada durante o build; para distribuição, use uma API HTTPS. Os testes da seleção de endereço podem ser executados com `node --test test/network-config.test.mjs` (Node 22+ com suporte a TypeScript).
