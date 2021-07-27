import TokenImageURI from "./tokenImageURI.json";

export const getTokenLogoURL = (address: string): string => {
  const mapper = TokenImageURI as { [key: string]: string };
  const imageURL = mapper[address];

  if (imageURL) return imageURL;

  return `https://via.placeholder.com/30`;
};

export const sortToken = (token0: string, token1: string): string[] => {
  if (token0 < token1) {
    return [token0, token1];
  }
  return [token1, token0];
};
