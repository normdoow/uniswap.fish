import React from "react";
import { AppContextProvider } from "./app/appContext";
import { ModalContextProvider } from "./modal/modalContext";
import { PoolContextProvider } from "./pool/poolContext";

interface ContextProviderProps {
  children: React.ReactNode;
}
const ContextProvider = ({ children }: ContextProviderProps) => {
  return (
    <AppContextProvider>
      <ModalContextProvider>
        <PoolContextProvider>{children}</PoolContextProvider>
      </ModalContextProvider>
    </AppContextProvider>
  );
};

export default ContextProvider;
