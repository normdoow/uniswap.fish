import { PriceChart } from "../../repos/coingecko";
import { Pool, Tick, V3Token } from "../../repos/uniswap";
import { AppContextState } from "./appContext";

export enum AppActionType {
  RESET_TOKEN_LIST = "RESET_TOKEN_LIST",
  RESET_PAIR = "RESET_PAIR",
  SWAP_CURRENT_PAIR = "SWAP_CURRENT_PAIR",
  UPDATE_OUT_OF_RANGE_PERCENTAGE = "UPDATE_OUT_OF_RANGE_PERCENTAGE",
  UPDATE_PRICE_ASSUMPTION_VALUE = "UPDATE_PRICE_ASSUMPTION_VALUE",
  UPDATE_PRICE_RANGE = "UPDATE_PRICE_RANGE",
  UPDATE_DEPOSIT_AMOUNT = "UPDATE_DEPOSIT_AMOUNT",
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
  | { type: AppActionType.SWAP_CURRENT_PAIR }
  | { type: AppActionType.UPDATE_OUT_OF_RANGE_PERCENTAGE; payload: number }
  | { type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE; payload: number }
  | { type: AppActionType.UPDATE_PRICE_RANGE; payload: number[] }
  | { type: AppActionType.UPDATE_DEPOSIT_AMOUNT; payload: number };

export const appReducer = (
  state: AppContextState,
  action: AppAction
): AppContextState => {
  switch (action.type) {
    case AppActionType.UPDATE_DEPOSIT_AMOUNT: {
      return { ...state, depositAmountValue: action.payload };
    }
    case AppActionType.UPDATE_PRICE_RANGE: {
      return { ...state, priceRangeValue: action.payload };
    }
    case AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE: {
      return { ...state, priceAssumptionValue: action.payload };
    }
    case AppActionType.UPDATE_OUT_OF_RANGE_PERCENTAGE: {
      return { ...state, outOfRangePercentageValue: action.payload };
    }
    case AppActionType.RESET_TOKEN_LIST: {
      return { ...state, tokenList: action.payload.tokenList };
    }
    case AppActionType.RESET_PAIR: {
      const {
        pool,
        poolTicks,
        token0,
        token1,
        token0PriceChart,
        token1PriceChart,
      } = action.payload;

      return {
        ...state,
        pool,
        poolTicks,
        token0,
        token1,
        token0PriceChart,
        token1PriceChart,
      };
    }
    case AppActionType.SWAP_CURRENT_PAIR: {
      return state;
    }
  }
};
