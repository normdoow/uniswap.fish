export interface Network {
  name: string;
  desc: string;
  logoURI: string;
  subgraphEndpoint: string;
}
export const NETWORKS: Network[] = [
  {
    name: "Ethereum",
    desc: "Ethereum Mainnet",
    logoURI:
      "https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  },
  {
    name: "Polygon",
    desc: "Polygon Mainnet",
    logoURI:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgwyOAYn_Z1BalQYMfN8zVqwenavJVSO9SUZ1rz0ZerShW-5Ubzf6U96kLODC-ta2bVks&usqp=CAU",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
  },
  {
    name: "Optimism",
    desc: "Optimism Mainnet (L2)",
    logoURI: "https://optimistic.etherscan.io/images/brandassets/optimism.svg",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
  },
  {
    name: "Arbitrum",
    desc: "Arbitrum Mainnet (L2)",
    logoURI:
      "https://assets.website-files.com/5f973c970bea5548ad4287ef/60a320b472858ace6700df76_arb-icon.svg",
    subgraphEndpoint:
      "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-dev",
  },
];
