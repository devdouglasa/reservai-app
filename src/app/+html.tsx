import {
  ScrollViewStyleReset,
  useServerDocumentContext,
} from "expo-router/html";
import type { PropsWithChildren } from "react";

// Resolve the saved preference before the app hydrates, including on cold web loads.
const appearanceBootstrap = `try {
  var preference = localStorage.getItem('reservai.appearance');
  var dark = preference === 'dark' || (preference !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  var root = document.documentElement;
  root.style.setProperty('--reservai-boot-background', dark ? '#14111F' : '#F7F7FC');
  root.style.setProperty('--reservai-boot-primary', dark ? '#9D8CFF' : '#5B42D6');
  root.style.colorScheme = dark ? 'dark' : 'light';
} catch {}`;

export default function RootDocument({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } =
    useServerDocumentContext();
  return (
    <html {...htmlAttributes} lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Reservai — seu próximo encontro</title>
        <ScrollViewStyleReset />
        <style>
          {"html,body{background:var(--reservai-boot-background,#F7F7FC)}"}
        </style>
        <script dangerouslySetInnerHTML={{ __html: appearanceBootstrap }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
