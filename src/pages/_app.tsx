import React from "react";
import "../styles/global.css";
import type { AppProps } from "next/app";
import { AssistantProvider } from "@/contexts/AssistantContext";
import withNav from "@/components/Nav";
import GameStateProvider from "@/contexts/GameStateContext";

// MyApp component with AppProps type
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AssistantProvider>
      <GameStateProvider>
        <Component {...pageProps} />
      </GameStateProvider>
    </AssistantProvider>
  );
}

export default withNav(MyApp);
