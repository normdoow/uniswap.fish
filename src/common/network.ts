import { Network } from "./interfaces/uniswap.interface";

export const NETWORKS: Network[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    desc: "Ethereum Mainnet",
    logoURI:
      "https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  },
  {
    id: "polygon",
    name: "Polygon",
    desc: "Polygon Mainnet",
    logoURI:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgwyOAYn_Z1BalQYMfN8zVqwenavJVSO9SUZ1rz0ZerShW-5Ubzf6U96kLODC-ta2bVks&usqp=CAU",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
  },
  {
    id: "optimism",
    name: "Optimism",
    desc: "Optimism Mainnet (L2)",
    logoURI: "https://optimistic.etherscan.io/images/brandassets/optimism.svg",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
  },
  {
    id: "celo",
    name: "Celo",
    desc: "Celo Mainnet",
    disabled: false,
    logoURI: "celo.svg",
    isNew: true,
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    desc: "Arbitrum Mainnet (L2)",
    disabled: true,
    logoURI:
      "https://assets.website-files.com/5f973c970bea5548ad4287ef/60a320b472858ace6700df76_arb-icon.svg",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-dev",
  },
];
