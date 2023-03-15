import {
  Network,
  Pool,
  Token,
} from "../../common/interfaces/uniswap.interface";
import { PoolColumnDataType } from "../../containers/pools/TopPoolTable";
import {
  favoritePoolIdsLocalStorageKey,
  PoolContextState,
} from "./poolContext";

export enum PoolActionType {
  SET_CHAIN = "SET_CHAIN",
  SET_POOLS_CACHE = "SET_POOLS_CACHE",
  SET_TOKENS_CACHE = "SET_TOKENS_CACHE",
  SET_FAVORITE_POOL_IDS = "SET_FAVORITE_POOL_IDS",
  INIT_FAVORITE_POOL_IDS = "INIT_FAVORITE_POOL_IDS",
}

export type PoolContextAction =
  | {
      type: PoolActionType.SET_CHAIN;
      payload: Network;
    }
  | {
      type: PoolActionType.SET_POOLS_CACHE;
      payload: {
        chainId: string;
        pools: PoolColumnDataType[];
      };
    }
  | {
      type: PoolActionType.SET_TOKENS_CACHE;
      payload: {
        chainId: string;
        tokens: Token[];
      };
    }
  | {
      type: PoolActionType.SET_FAVORITE_POOL_IDS;
      payload: {
        chainId: string;
        poolIds: string[];
      };
    }
  | {
      type: PoolActionType.INIT_FAVORITE_POOL_IDS;
      payload: any;
    };

export const poolContextReducer = (
  state: PoolContextState,
  action: PoolContextAction
): PoolContextState => {
  switch (action.type) {
    case PoolActionType.SET_CHAIN: {
      return { ...state, chain: action.payload };
    }
    case PoolActionType.SET_POOLS_CACHE: {
      return {
        ...state,
        poolsCache: {
          ...state.poolsCache,
          [action.payload.chainId]: action.payload.pools,
        },
      };
    }
    case PoolActionType.SET_TOKENS_CACHE: {
      return {
        ...state,
        tokensCache: {
          ...state.tokensCache,
          [action.payload.chainId]: action.payload.tokens,
        },
      };
    }
    case PoolActionType.SET_FAVORITE_POOL_IDS: {
      const newState = {
        ...state,
        favoritePoolIds: {
          ...state.favoritePoolIds,
          [action.payload.chainId]: action.payload.poolIds,
        },
      };
      localStorage.setItem(
        favoritePoolIdsLocalStorageKey,
        JSON.stringify(newState.favoritePoolIds)
      );
      return newState;
    }
    case PoolActionType.INIT_FAVORITE_POOL_IDS: {
      return {
        ...state,
        favoritePoolIds: action.payload,
      };
    }
  }
};
