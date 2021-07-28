import { PriceChart } from "../../repos/coingecko";
import { Pool, Tick, V3Token } from "../../repos/uniswap";
import { AppContextState } from "./appContext";

export enum AppActionType {
  RESET_PAIR = "RESET_PAIR",
  SWAP_CURRENT_PAIR = "SWAP_CURRENT_PAIR",
}
export type AppAction =
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
  return state;
  // switch (action.type) {
  //   default: {
  //     throw new Error(`Unhandled action type: ${action.type}`);
  //   }
  // }
};
