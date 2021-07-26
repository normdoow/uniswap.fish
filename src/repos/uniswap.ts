import axios from "axios";

const MAINNET = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

const queryUniswap = async (query: string): Promise<any> => {
  const { data } = await axios({
    url: MAINNET,
    method: "post",
    data: {
      query,
    },
  });

  return data.data;
};

interface Tick {
  liquidityNet: number;
  price0: number;
  price1: number;
  tickIdx: number;
}
export const getPoolTicks = async (
  poolAddress: string,
  skip: number = 0
): Promise<Tick[]> => {
  const { ticks } = await queryUniswap(`{
    ticks(skip: ${skip}, where: { poolAddress: "${poolAddress}" }, orderBy: tickIdx) {
      tickIdx
      liquidityNet
      price0
      price1
    }
  }`);
  return ticks as Tick[];
};
