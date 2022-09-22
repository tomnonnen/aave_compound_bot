const { Mainnet, ABI } = require("./constants");
const { ethers } = require("ethers");


//Setup
const provider = ethers.getDefaultProvider(Mainnet.url, {
    infura: process.env.PROJECT_ID,
});

//to get eth on testnet : https://optimismfaucet.xyz/

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const UiIncentiveDataProviderV3 = new ethers.Contract(Mainnet.UiIncentiveDataProviderV3, ABI.UiIncentiveDataProviderV3, provider);
const UiPoolDataProviderV3 = new ethers.Contract(Mainnet.UiPoolDataProviderV3, ABI.UiPoolDataProviderV3, provider);
const Pool = new ethers.Contract(Mainnet.Pool, ABI.Pool, wallet);
const AaveProtocolDataProvider = new ethers.Contract(Mainnet.AaveProtocolDataProvider, ABI.AaveProtocolDataProvider, provider);
const RewardsController = new ethers.Contract(Mainnet.RewardsController, ABI.RewardsController, wallet)
const UniswapV3Factory = new ethers.Contract(Mainnet.UniswapV3Factory, ABI.UniswapV3Factory, provider)
const SwapRouter02 = new ethers.Contract(Mainnet.SwapRouter02, ABI.SwapRouter02, wallet)

const USDC = new ethers.Contract(Mainnet.USDC, ABI.USDC, wallet);
const DAI = new ethers.Contract(Mainnet.DAI, ABI.DAI, wallet);
const USDT = new ethers.Contract(Mainnet.USDT, ABI.USDT, wallet);
const SUSD = new ethers.Contract(Mainnet.SUSD, ABI.SUSD, wallet);
const StableCoinsContracts = [DAI, USDT, USDC, SUSD]

const OP = new ethers.Contract(Mainnet.OP, ABI.OP, wallet);

exports.Pool = Pool;
exports.UiIncentiveDataProviderV3 = UiIncentiveDataProviderV3;
exports.UiPoolDataProviderV3 = UiPoolDataProviderV3
exports.AaveProtocolDataProvider = AaveProtocolDataProvider
exports.RewardsController = RewardsController
exports.StableCoinsContracts = StableCoinsContracts
exports.UniswapV3Factory = UniswapV3Factory
exports.SwapRouter02 = SwapRouter02
exports.wallet = wallet
exports.OP = OP