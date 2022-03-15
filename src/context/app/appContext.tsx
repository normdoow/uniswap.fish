import React from "react";
import { Network, NETWORKS } from "../../common/types";
import { PriceChart } from "../../repos/coingecko";
import { Pool, Tick, V3Token } from "../../repos/uniswap";
import { AppAction, appReducer } from "./appReducer";

export interface AppContextState {
  network: Network;
  tokenList: V3Token[];
  isSwap: boolean;

  pool: Pool | null;
  poolTicks: Tick[] | null;
  token0: V3Token | null;
  token1: V3Token | null;
  token0PriceChart: PriceChart | null;
  token1PriceChart: PriceChart | null;
  volume24H: number;

  depositAmountValue: number;
  priceRangeValue: number[];
  priceAssumptionValue: number;
  outOfRangePercentageValue: number;
}
const initialState: AppContextState = {
  network: NETWORKS[0],
  tokenList: [],
  isSwap: false,

  pool: null,
  poolTicks: null,
  token0: null,
  token1: null,
  token0PriceChart: null,
  token1PriceChart: null,
  volume24H: 0,

  depositAmountValue: 1000,
  priceRangeValue: [0, 0],
  priceAssumptionValue: 0,
  outOfRangePercentageValue: 0,
};

interface AppContextProviderProps {
  children: React.ReactNode;
}
const AppContext = React.createContext<
  { state: AppContextState; dispatch: (action: AppAction) => void } | undefined
>(undefined);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const value = { state, dispatch };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      "useApplicationContext must be used within a ApplicationContextProvider"
    );
  }
  return context;
};
