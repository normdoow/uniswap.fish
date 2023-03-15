import { Network } from "./interfaces/uniswap.interface";

// https://github.com/Uniswap/interface/blob/main/src/constants/chains.ts
enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,

  ARBITRUM_ONE = 42161,
  ARBITRUM_GOERLI = 421613,

  OPTIMISM = 10,
  OPTIMISM_GOERLI = 420,

  POLYGON = 137,
  POLYGON_MUMBAI = 80001,

  CELO = 42220,
  CELO_ALFAJORES = 44787,
}

// NOTE: also update CreatePositionModal, isNative function.
export const NETWORKS: Network[] = [
  {
    id: "ethereum",
    chainId: SupportedChainId.MAINNET,
    name: "Ethereum",
    desc: "Ethereum Mainnet",
    logoURI:
      "https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    totalValueLockedUSD_gte: 1000000,
    volumeUSD_gte: 500000,
  },
  {
    id: "polygon",
    chainId: SupportedChainId.POLYGON,
    name: "Polygon",
    desc: "Polygon Mainnet",
    logoURI:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgwyOAYn_Z1BalQYMfN8zVqwenavJVSO9SUZ1rz0ZerShW-5Ubzf6U96kLODC-ta2bVks&usqp=CAU",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
    totalValueLockedUSD_gte: 100000,
    volumeUSD_gte: 50000,
  },
  {
    id: "optimism",
    chainId: SupportedChainId.OPTIMISM,
    name: "Optimism",
    desc: "Optimism Mainnet (L2)",
    logoURI: "https://optimistic.etherscan.io/images/brandassets/optimism.svg",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
    totalValueLockedUSD_gte: 1000000,
    volumeUSD_gte: 500000,
  },
  {
    id: "celo",
    chainId: SupportedChainId.CELO,
    name: "Celo",
    desc: "Celo Mainnet",
    disabled: false,
    logoURI: "/celo.svg",
    isNew: false,
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo",
    totalValueLockedUSD_gte: 10000,
    volumeUSD_gte: 1000,
  },
  {
    id: "arbitrum",
    chainId: SupportedChainId.ARBITRUM_ONE,
    name: "Arbitrum",
    desc: "Arbitrum Mainnet (L2)",
    disabled: true,
    isNew: false,
    error: "INDEXING ERROR",
    logoURI:
      "https://assets.website-files.com/5f973c970bea5548ad4287ef/60a320b472858ace6700df76_arb-icon.svg",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-arbitrum-one",
    // subgraphEndpoint:
    //   "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal",
    totalValueLockedUSD_gte: 0,
    volumeUSD_gte: 0,
  },
];

let currentNetwork = NETWORKS[0];

export const getCurrentNetwork = (): Network => {
  return currentNetwork;
};

export const setCurrentNetwork = (network: Network) => {
  currentNetwork = network;
};
