# aave_compound_bot

## Context

### constants.js
This file contains the addresses of the smart contract of Aave and Uniswap, and the smart contract of the main stablecoins on Optimism Mainnet and on Optimism Testnet. Furthermore, it contains the readed ABIs of these smart contracts.
### contracts.js
This file contains the ethers js contracts of the smart contracts registered in constants.js
### DataRecovering.js
### Strategies.js



## Use it

First, you need to install ethers js :
```bash
npm install --save ethers
```


Then, you need to fill the three environment variables :
- WALLET_ADDRESS : the address of the wallet of your metamask
- PROJECT_ID : the project id of your infura project
- PRIVATE_KEY : the private key of your metamask
