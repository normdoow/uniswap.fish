import React from "react";
import { PriceChart } from "../../common/interfaces/coingecko.interface";
import {
  Network,
  Pool,
  Tick,
  Token,
} from "../../common/interfaces/uniswap.interface";
import { NETWORKS } from "../../common/network";
import { AppAction, appReducer } from "./appReducer";

export interface AppContextState {
  network: Network;
  tokenList: Token[];
  isPairToggled: boolean;
  isFullRange: boolean;

  pool: Pool | null;
  poolTicks: Tick[] | null;
  token0: Token | null;
  token1: Token | null;
  token0PriceChart: PriceChart | null;
  token1PriceChart: PriceChart | null;
  volume24H: number;

  depositAmountValue: number;
  priceRangeValue: number[];
  priceAssumptionValue: number;

  currentPrice: null | number[];
  futurePrice: null | number[];
  daysInPosition: number;
}
const initialState: AppContextState = {
  network: NETWORKS[0],
  tokenList: [],
  isPairToggled: false,
  isFullRange: false,

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

  // Impermanent Loss Calculator
  currentPrice: null,
  futurePrice: null,
  daysInPosition: 0,
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
