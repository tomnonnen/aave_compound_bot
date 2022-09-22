# aave_compound_bot

## Context
The bot analyzes the interest of supply and borrow for stable coins on Aave (Optimism) and can automatically execute the transactions to compound these interests. \
For example, if we take USDT and the liquidation threshold is 95%, we supply 100 USDT, then we borrow 95 USDT and we supply the 95 USDT again (so we have 195 USDT supplied and 95 borrowed), and we can continue again and again. \
With this strategy, we can compound the interest. (looping) \
In this repository, you find the utils and helpers function that can let you create differents strategies of interest compoundings.

### constants.js
This file contains the addresses of the smart contracts of Aave and Uniswap, and the smart contracts of the stable coins on Optimism Mainnet and on Optimism Testnet. Furthermore, it contains the ABIs of these smart contracts.
### contracts.js
This file implements the provider (Infura), the wallet (Metamask) and contains the ethers js contracts of the smart contracts registered in constants.js
### DataRecovering.js
This file queries and computes the data that we can find here : https://app.aave.com/markets/ \
So, for each stable coin it gets : the borrow APY rate, the supply APY rate, the max LTV, the liquidation threshold, the OP APY borrow rate, the OP APY supply rate, and if the stable coin is in isolation mode (https://docs.aave.com/developers/whats-new/isolation-mode).
### Strategies.js
This file contains all the utils function to create a strategy : it has the function that automatically supply and borrow on Aave, functions that let you withdraw and repay the funds, and function that swap stable coins on Uniswap. \
You can write your strategies in this file. \
If you have some questions, do no hesitate to contact me : tom.nonnenmacher@gmail.com

## Use it

First, you need to install ethers js :
```bash
npm install --save ethers
```


Then, you need to fill the three environment variables :
- WALLET_ADDRESS : the address of the wallet of your metamask
- PROJECT_ID : the project id of your infura project
- PRIVATE_KEY : the private key of your metamask
