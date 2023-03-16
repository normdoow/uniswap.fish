// https://github.com/Uniswap/interface/blob/main/src/constants/lists.ts
const UNI_LIST = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";
const UNI_EXTENDED_LIST =
  "https://gateway.ipfs.io/ipns/extendedtokens.uniswap.org";
const UNI_UNSUPPORTED_LIST =
  "https://gateway.ipfs.io/ipns/unsupportedtokens.uniswap.org";
const BA_LIST =
  "https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json";
const CMC_ALL_LIST =
  "https://api.coinmarketcap.com/data-api/v3/uniswap/all.json";
const COINGECKO_LIST = "https://tokens.coingecko.com/uniswap/all.json";
const COINGECKO_BNB_LIST =
  "https://tokens.coingecko.com/binance-smart-chain/all.json";
const COMPOUND_LIST =
  "https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json";
const GEMINI_LIST = "https://www.gemini.com/uniswap/manifest.json";
const SET_LIST =
  "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json";

const OPTIMISM_LIST = "https://static.optimism.io/optimism.tokenlist.json";
const ARBITRUM_LIST = "https://bridge.arbitrum.io/token-list-42161.json";
const CELO_LIST =
  "https://celo-org.github.io/celo-token-list/celo.tokenlist.json";
const PLASMA_BNB_LIST =
  "https://raw.githubusercontent.com/plasmadlt/plasma-finance-token-list/master/bnb.json";

const UNSUPPORTED_LIST_URLS = [BA_LIST, UNI_UNSUPPORTED_LIST];

const DEFAULT_ACTIVE_LIST_URLS = [UNI_LIST];
const DEFAULT_INACTIVE_LIST_URLS = [
  UNI_EXTENDED_LIST,
  COMPOUND_LIST,
  CMC_ALL_LIST,
  COINGECKO_LIST,
  COINGECKO_BNB_LIST,
  GEMINI_LIST,
  SET_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  CELO_LIST,
  PLASMA_BNB_LIST,
  ...UNSUPPORTED_LIST_URLS,
];

const DEFAULT_LIST_OF_LISTS = [
  ...DEFAULT_ACTIVE_LIST_URLS,
  ...DEFAULT_INACTIVE_LIST_URLS,
];

module.exports = {
  DEFAULT_LIST_OF_LISTS,
};
