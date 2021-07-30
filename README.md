# 🦄 UniswapCalculator

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

TODO: Link, Screenshot, Request Feature / Report Bugs

## About

TODO: Overview, Features

## Calculation Breakdown

| Please ping me if I'm wrong 😉
TODO: Disclaimer

### 1. Calculate deposit amounts of token0 and token1

- Refer to Uniswap v3 Whitepaper (Formulas: 6.29, 6.30), normally we can calculate amounts of each token by using these formulas (if `il <= ic < iu`; where `il` = lowerTickId, `ic` = currentTickId, `iu` = upperTickId)
  - `deltaY = deltaL * (sqrt(P) - sqrt(Pl))`
  - `deltaX = deltaL * (1 / sqrt(P) - 1 / sqrt(Pu))`
- For estimate amounts of token0 (`deltaX`) and token1 (deltaY) we need to know deltaL that make:
  - `deltaY * priceUSDY + deltaX * priceUSDX = targetAmounts`
- So we can write a formula like this:
  - `deltaL * (sqrt(P) - sqrt(Pl)) * priceUSDY + deltaL * (1 / sqrt(P) - 1 / sqrt(Pu)) * priceUSDX = targetAmounts`
  - Simplify: `deltaL = targetAmounts / (sqrt(P) - sqrt(Pl)) * priceUSDY + (1 / sqrt(P) - 1 / sqrt(Pu)) * priceUSD`
- After we've calculated deltaL, we can calculate deltaX and deltaY using the formulas mentioned in Uniswap v3 Whitepaper
  - `deltaY = deltaL * (sqrt(P) - sqrt(Pl))`
  - `deltaX = deltaL * (1 / sqrt(P) - 1 / sqrt(Pu))`

---

TODO: Credit
