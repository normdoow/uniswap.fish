import { V3Token } from "../repos/uniswap";
import TokenImageURI from "./tokenImageURI.json";

export const getTokenLogoURL = (address: string): string => {
  const mapper = TokenImageURI as { [key: string]: string };
  const imageURL = mapper[address];

  if (imageURL) return imageURL;

  return `https://via.placeholder.com/30`;
};

export const sortToken = (token0: V3Token, token1: V3Token): V3Token[] => {
  if (token0.id < token1.id) {
    return [token0, token1];
  }
  return [token1, token0];
};
