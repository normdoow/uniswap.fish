import { Network } from "../../common/interfaces/uniswap.interface";
import { PoolContextState } from "./poolContext";

export enum PoolActionType {
  SET_CHAIN = "SET_CHAIN",
}

export type PoolContextAction = {
  type: PoolActionType.SET_CHAIN;
  payload: Network;
};

export const poolContextReducer = (
  state: PoolContextState,
  action: PoolContextAction
): PoolContextState => {
  switch (action.type) {
    case PoolActionType.SET_CHAIN: {
      return { ...state, chain: action.payload };
    }
  }
};
