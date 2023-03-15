import React from "react";
import { Network } from "../../common/interfaces/uniswap.interface";
import { NETWORKS } from "../../common/network";
import { poolContextReducer, PoolContextAction } from "./poolReducer";

export interface PoolContextState {
  chain: Network;
}
const initialState: PoolContextState = {
  chain: NETWORKS[0],
};

interface PoolContextProviderProps {
  children: React.ReactNode;
}
const PoolContext = React.createContext<
  | { state: PoolContextState; dispatch: (action: PoolContextAction) => void }
  | undefined
>(undefined);

export const PoolContextProvider = ({ children }: PoolContextProviderProps) => {
  const [state, dispatch] = React.useReducer(poolContextReducer, initialState);
  const value = { state, dispatch };

  return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>;
};

export const usePoolContext = () => {
  const context = React.useContext(PoolContext);
  if (context === undefined) {
    throw new Error("usePoolContext must be used within a PoolContextProvider");
  }
  return context;
};
