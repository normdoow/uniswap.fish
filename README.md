# 🦄 UniswapCalculator

Uniswap V3 Fee Calculator, Visit: [uniswap.fish](https://uniswap.fish/), [@uniswapdotfish](https://twitter.com/uniswapdotfish)

> Disclaimer: please do your own research, this website is intended to be used and must be used for informational purpose only. It is very important to do your own analysis before making any investment based on your personal circumstances.

[Report a bug or request a feature](https://github.com/chunrapeepat/uniswap.fish/issues)

[Donate this project on Gitcoin Grant](https://gitcoin.co/grants/4203/uniswap-calculator-v3)

## Features

- Fee calculation: select pair and pool, input deposit amount (USD), and adjust your lower and upper price
- Liquidity position histogram and correlation chart to help you plan your strategy better
- It's 100% open source! hope that Uniswap community will bring a lot more ideas and features to this project

## Calculation Breakdown

### 1. Calculate deposit amount of token0 and token1

- Refer to [Uniswap V3 Whitepaper](https://uniswap.org/whitepaper-v3.pdf) (Formula: 6.29, 6.30, P.8), we can calculate total amount of each token by using these formulas: (if `il <= ic < iu`; where `il` = lowerTickId, `ic` = currentTickId, `iu` = upperTickId, `Pl` = lower price, `Pu` = upper price)
  - `deltaY = deltaL * (sqrt(P) - sqrt(Pl))`
  - `deltaX = deltaL * (1 / sqrt(P) - 1 / sqrt(Pu))`
- For estimation of the amount of token0 (`deltaX`) and token1 (`deltaY`) we need to know `deltaL` that make:
  - `deltaY * priceUSDY + deltaX * priceUSDX = depositAmountUSD`
- So we can write a equation like this:
  - `deltaL * (sqrt(P) - sqrt(Pl)) * priceUSDY + deltaL * (1 / sqrt(P) - 1 / sqrt(Pu)) * priceUSDX = depositAmountUSD`
  - Then: `deltaL = depositAmountUSD / ((sqrt(P) - sqrt(Pl)) * priceUSDY + (1 / sqrt(P) - 1 / sqrt(Pu)) * priceUSDX)`
- After we've calculated `deltaL`, we can calculate `deltaX` and `deltaY` using these formulas mentioned in Uniswap v3 Whitepaper
  - `deltaY = deltaL * (sqrt(P) - sqrt(Pl))` (Formula: 6.29, P.8)
  - `deltaX = deltaL * (1 / sqrt(P) - 1 / sqrt(Pu))` (Formula: 6.30, P.8)

### 2. Calculate estimated fee

- Estimated fee (daily) can be calculated by this equation:
  - `fee = feeTier * volume24H * (deltaL / (L + deltaL))` where:
    - `volume24H` = average of 24h volume from `[currentDay - 7, currentDay - 1]`
    - `L` = total liquidity (cumulative of `liquidityNet` from all ticks that `il <= ic`)
    - `deltaL` = delta liquidity, can be calculated from:
      - `liquidityAmount0 = amount0 * (sqrt(pu) * sqrt(pl)) / (sqrt(pu) - sqrt(pl))`
      - `liquidityAmount1 = amount1 / (sqrt(pu) - sqrt(pl))`
      - if `ic < il`; `deltaL = liquidityAmount0`
      - if `ic > iu`; `deltaL = liquidityAmount1`
      - if `ic >= il && ic <= iu`; `deltaL = min(liquidityAmount0, liquidityAmount1)`

---

Crafted with 🧡 by [@chunrapeepat](https://twitter.com/chunrapeepat).
