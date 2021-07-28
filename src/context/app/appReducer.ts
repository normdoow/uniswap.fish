import { PriceChart } from "../../repos/coingecko";
import { Pool, Tick, V3Token } from "../../repos/uniswap";
import { AppContextState } from "./appContext";

export enum AppActionType {
  RESET_TOKEN_LIST = "RESET_TOKEN_LIST",
  RESET_PAIR = "RESET_PAIR",
  SWAP_CURRENT_PAIR = "SWAP_CURRENT_PAIR",
}
export type AppAction =
  | {
      type: AppActionType.RESET_TOKEN_LIST;
      payload: {
        tokenList: V3Token[];
      };
    }
  | {
      type: AppActionType.RESET_PAIR;
      payload: {
        pool: Pool;
        poolTicks: Tick[];
        token0: V3Token;
        token1: V3Token;
        token0PriceChart: PriceChart;
        token1PriceChart: PriceChart;
      };
    }
  | { type: AppActionType.SWAP_CURRENT_PAIR };

export const appReducer = (
  state: AppContextState,
  action: AppAction
): AppContextState => {
  switch (action.type) {
    case AppActionType.RESET_TOKEN_LIST: {
      return { ...state, tokenList: action.payload.tokenList };
    }
    case AppActionType.RESET_PAIR: {
      return state;
    }
    case AppActionType.SWAP_CURRENT_PAIR: {
      return state;
    }
  }
};
