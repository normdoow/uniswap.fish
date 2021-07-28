import React from "react";
import { PriceChart } from "../../repos/coingecko";
import { Pool, Tick, V3Token } from "../../repos/uniswap";
import { AppAction, appReducer } from "./appReducer";

export interface AppContextState {
  tokenList: V3Token[];

  pool: Pool | null;
  poolTicks: Tick[] | null;
  token0: V3Token | null;
  token1: V3Token | null;
  token0PriceChart: PriceChart | null;
  token1PriceChart: PriceChart | null;

  depositAmountValue: number;
  minPriceRangeValue: number;
  maxPriceRangeValue: number;
  priceAssumptionValue: number;
  outOfRangePercentageValue: number;
}
const initialState: AppContextState = {
  tokenList: [],

  pool: null,
  poolTicks: null,
  token0: null,
  token1: null,
  token0PriceChart: null,
  token1PriceChart: null,

  depositAmountValue: 0.0,
  minPriceRangeValue: 0.0,
  maxPriceRangeValue: 0.0,
  priceAssumptionValue: 0.0,
  outOfRangePercentageValue: 100,
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
