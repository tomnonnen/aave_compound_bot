const fs = require("fs");
const { ethers } = require("ethers");

const Optimistic = {
    Mainnet: {
        url: "https://optimism-mainnet.infura.io/v3/0a3f0a78b86d42468a22437f8e88ddb3",
        //tokens
        AAVE: '0x76FB31fb4af56892A25e32cFC43De717950c9278',
        DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        SUSD: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
        USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        WBTC: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
        WETH: '0x4200000000000000000000000000000000000006',
        USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        LINK: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6',
        OP: '0x4200000000000000000000000000000000000042',
        //contracts
        Pool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
        UiIncentiveDataProviderV3: '0x6dD4b295B457A26CC2646aAf2519436681afb5d4',
        UiPoolDataProviderV3: '0x64f558d4BFC1c03a8c8B2ff84976fF04c762b51f',
        AaveProtocolDataProvider: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
        RewardsController: '0x929EC64c34a17401F460460D4B9390518E5B473e',
        UniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        SwapRouter02: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
        aDAI: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
        aUSDT: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620',
        aUSDC: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
        aSUSD: '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97',
        vDAI: '0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC',
        vUSDT: '0xfb00AC187a8Eb5AFAE4eACE434F493Eb62672df7',
        vUSDC: '0xFCCf3cAbbe80101232d343252614b6A3eE81C989',
        vSUSD: '0x4a1c3aD6Ed28a636ee1751C69071f6be75DEb8B8',
    },
    Testnet: {
        url: "https://optimism-goerli.infura.io/v3/0a3f0a78b86d42468a22437f8e88ddb3",
        //tokens
        AAVE: '0x3282A99BCbFbFFFc59229843BF338EaD56cF0C5F',
        DAI: '0x83Ff84900294eE4c3cfc3c68f6cB965c337044E2',
        LINK: '0x6eC984De9E9b0b4E042F19FeEFb8B04674B5c40a',
        SUSD: '0x1FC6eEf8ED0a0D175Ad17572023c6cc5c45F3C2E',
        USDC: '0xf1485Aa729DF94083ab61B2C65EeA99894Aabdb3',
        USDT: '0x804ED52fed3876A50EdefA6e71FfA35d7b493882',
        WBTC: '0x532C90cB5bFC8E929409678224D6D420E25c4F37',
        WETH: '0x09bADef78f92F20fd5f7a402dbb1d25d4901aAb2',
        //contracts
        Pool: '0x4b529A5d8268d74B687aC3dbb00e1b85bF4BF0d4',
        UiIncentiveDataProviderV3: '0x596b5804E1f541baC5f265aF7C4bcc5077522876',
        UiPoolDataProviderV3: '0x4D8201fB7a3367AB3e4Ba257F7462C81306799d6',
        AaveProtocolDataProvider: '0x42BdE9c98B80e83F1B051B4bb11812aDa314213a',
        
    }
}

const MAX_UINT = ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935")

const AAVE_PROVIDER = "0x794a61358d6845594f94dc1db02a252b5b4814ad"
const StableCoins = ['DAI', 'USDT', 'USDC', 'SUSD']
const StableCoinsAmount = [ethers.BigNumber.from(10).pow(18), ethers.BigNumber.from(10).pow(6), ethers.BigNumber.from(10).pow(6), ethers.BigNumber.from(10).pow(18)]

const ABI = {
    Pool: fs.readFileSync("../ABIs/Pool.json", {encoding:'utf8', flag:'r'}),
    UiIncentiveDataProviderV3: fs.readFileSync("../ABIs/UiIncentiveDataProviderV3.json", {encoding:'utf8', flag:'r'}),
    UiPoolDataProviderV3: fs.readFileSync("../ABIs/UiPoolDataProviderV3.json", {encoding:'utf8', flag:'r'}),
    AaveProtocolDataProvider: fs.readFileSync("../ABIs/AaveProtocolDataProvider.json", {encoding:'utf8', flag:'r'}),
    RewardsController: fs.readFileSync("../ABIs/RewardsController.json", {encoding:'utf8', flag:'r'}),
    UniswapV3Factory: fs.readFileSync("../ABIs/UniswapV3Factory.json", {encoding:'utf8', flag:'r'}),
    UniswapV3Pool: fs.readFileSync("../ABIs/UniswapV3Pool.json", {encoding:'utf8', flag:'r'}),
    SwapRouter02: fs.readFileSync("../ABIs/SwapRouter02.json", {encoding:'utf8', flag:'r'}),
    DAI: fs.readFileSync("../ABIs/DAI.json", {encoding:'utf8', flag:'r'}),
    USDC: fs.readFileSync("../ABIs/USDC.json", {encoding:'utf8', flag:'r'}),
    USDT: fs.readFileSync("../ABIs/SUSD.json", {encoding:'utf8', flag:'r'}),
    SUSD: fs.readFileSync("../ABIs/USDT.json", {encoding:'utf8', flag:'r'}),
    OP: fs.readFileSync("../ABIs/OP.json", {encoding:'utf8', flag:'r'}),
    
}


const myWalletAdr = process.env.WALLET_ADDRESS

exports.Mainnet = Optimistic.Mainnet;
exports.Testnet = Optimistic.Testnet;
exports.ABI = ABI;
exports.myWalletAdr = myWalletAdr;
exports.StableCoins = StableCoins;
exports.MAX_UINT = MAX_UINT;
exports.AAVE_PROVIDER = AAVE_PROVIDER;
exports.StableCoinsAmount = StableCoinsAmount;