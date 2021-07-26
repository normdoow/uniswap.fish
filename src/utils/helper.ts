export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`;

export const sortToken = (token0: string, token1: string): string[] => {
  if (token0 < token1) {
    return [token0, token1];
  }
  return [token1, token0];
};
