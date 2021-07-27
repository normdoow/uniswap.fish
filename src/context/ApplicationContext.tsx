import React from "react";
import { PriceChart } from "../repos/coingecko";
import { Pool, Tick, V3Token } from "../repos/uniswap";

interface State {
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
}
const initialState: State = {
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
};

export enum ActionType {
  RESET_PAIR = "RESET_PAIR",
  SWAP_CURRENT_PAIR = "SWAP_CURRENT_PAIR",
}
type Action =
  | {
      type: ActionType.RESET_PAIR;
      payload: {
        pool: Pool;
        poolTicks: Tick[];
        token0: V3Token;
        token1: V3Token;
        token0PriceChart: PriceChart;
        token1PriceChart: PriceChart;
      };
    }
  | { type: ActionType.SWAP_CURRENT_PAIR };

interface ApplicationContextProviderProps {
  children: React.ReactNode;
}
const ApplicationContext = React.createContext<
  { state: State; dispatch: (action: Action) => void } | undefined
>(undefined);

const applicationReducer = (state: State, action: Action): State => {
  return state;
  // switch (action.type) {
  //   default: {
  //     throw new Error(`Unhandled action type: ${action.type}`);
  //   }
  // }
};

const ApplicationContextProvider = ({
  children,
}: ApplicationContextProviderProps) => {
  const [state, dispatch] = React.useReducer(applicationReducer, initialState);
  const value = { state, dispatch };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

function useApplicationContext() {
  const context = React.useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error(
      "useApplicationContext must be used within a ApplicationContextProvider"
    );
  }
  return context;
}

export { ApplicationContextProvider, useApplicationContext };
