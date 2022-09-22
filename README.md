# aave_compound_bot

## Context
I wanted to create a bot that can analyze the interest of supply and borrow and can compound these interests. \
For example, if we take USDT and the LTV is 0.95, we supply 100 USDT, then we borrow 95 USDT and we supply it again, and we can continue again and again. \
With this strategy, we can compound the interest.

### constants.js
This file contains the addresses of the smart contract of Aave and Uniswap, and the smart contract of the main stablecoins on Optimism Mainnet and on Optimism Testnet. Furthermore, it contains the readed ABIs of these smart contracts.
### contracts.js
This file contains the ethers js contracts of the smart contracts registered in constants.js
### DataRecovering.js
This file recover the datas that we can find here : https://app.aave.com/markets/ \
So, for each stable coins it recover : the borrow APY rate, the supply APY rate, the max LTV, the OP APY borrow rate, the  OP APY supply rate, and if the stable coin is in isolation mode (https://docs.aave.com/developers/whats-new/isolation-mode).
### Strategies.js
This file contains all the utils function to create a strategy : it has the function that automatically supply, borrow, swap stablecoins on Uniswap. \
You can write your strategies in this file.

## Use it

First, you need to install ethers js :
```bash
npm install --save ethers
```


Then, you need to fill the three environment variables :
- WALLET_ADDRESS : the address of the wallet of your metamask
- PROJECT_ID : the project id of your infura project
- PRIVATE_KEY : the private key of your metamask
