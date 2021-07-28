import React from "react";
import { AppContextProvider } from "./app/appContext";
import { ModalContextProvider } from "./modal/modalContext";

interface ContextProviderProps {
  children: React.ReactNode;
}
const ContextProvider = ({ children }: ContextProviderProps) => {
  return (
    <AppContextProvider>
      <ModalContextProvider>{children}</ModalContextProvider>
    </AppContextProvider>
  );
};

export default ContextProvider;
