const { AaveProtocolDataProvider, Pool, StableCoinsContracts, UniswapV3Factory, wallet, OP, RewardsController, SwapRouter02 } = require("./contracts");
const { AAVE_PROVIDER, UNISWAP , MAX_UINT, StableCoins, Mainnet, myWalletAdr, ABI, UNISWAP_PROVIDER, StableCoinsAmount } = require("./constants")
const fs = require('fs')
const readline = require('readline');
const { ethers } = require("ethers");

const FEE = 0.20

async function setEMode(asset){
    var cat = AaveProtocolDataProvider.getReserveEModeCategory(asset)
    await Pool.setUserEMode(cat)
}

async function supply(idx, amount){
    await StableCoinsContracts[idx].approve(AAVE_PROVIDER, amount)
    console.log("Approvement for " + StableCoins[idx] + " for amount " + amount + " complete")
    await Pool.supply(Mainnet[StableCoins[idx]], amount, myWalletAdr, 0)
    console.log("Supply for " + StableCoins[idx] + " for amount " + amount + " complete")
}

async function withdraw(idx, amount){
    await Pool.withdraw(Mainnet[StableCoins[idx]], amount, myWalletAdr) 
    console.log("Withdraw for " + StableCoins[idx] + " for amount " + amount + " complete")
}

async function borrow(idx, amount){
    await Pool.borrow(Mainnet[StableCoins[idx]], amount, 2, 0, myWalletAdr)
    console.log("Borrow for " + StableCoins[idx] + " for amount " + amount + " complete")
}

async function repay(idx, amount){
    await StableCoinsContracts[idx].approve(AAVE_PROVIDER, amount)
    console.log("Approvement for " + StableCoins[idx] + " for amount " + amount + " complete")
    await Pool.repay(Mainnet[StableCoins[idx]], amount, 2, myWalletAdr)
    console.log("Repay for " + StableCoins[idx] + " for amount " + amount + " complete")
}

async function calculateFee(gasUnits){
    const obj = (await gasUnits)._hex
    const transactionFee = (await ethers.getDefaultProvider().getFeeData()).gasPrice.mul(obj)
    const transactionFee2 = (await ethers.getDefaultProvider().getFeeData()).maxFeePerGas.mul(obj)
    const transactionFeeInEthers = ethers.utils.formatUnits(transactionFee);
    const transactionFeeInEthers2 = ethers.utils.formatUnits(transactionFee2);
    return [transactionFeeInEthers, transactionFeeInEthers2]
}

async function swap(amount, idx2, idx1 = -1){
    const listFees = [100, 500, 3000, 10000] //0.01, 0.05, 0.3, 1
    let asset1 = Mainnet['OP']
    let asset2 = Mainnet[StableCoins[idx2]]
    if(idx1 != -1){
        asset1 = Mainnet[StableCoins[idx1]]
    }

    for(let i=0; i < listFees.length; i++){
        const addrPool = await UniswapV3Factory.getPool(asset1, asset2, listFees[i])
        if(addrPool != "0x0000000000000000000000000000000000000000"){
            if(idx1 != -1){
                await StableCoinsContracts[idx1].approve(Mainnet.SwapRouter02, amount)
            } else {
                await OP.approve(Mainnet.SwapRouter02, amount)
            }

            const params = {
                tokenIn: asset1,
                tokenOut: asset2,
                fee: listFees[i],
                recipient: myWalletAdr,
                deadline: Math.floor(Date.now() / 1000) + (60 * 10),
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0,
            }
            await SwapRouter02.exactInputSingle(params)
            console.log("Swap " + StableCoins[idx1] + " against " + StableCoins[idx2])
            break
        }
    }

}

async function runStrategy(listBorrowRate, listSupplyRate, listOPBorrowRateAPR, listOPSupplyRateAPR, listOPBorrowRateAPY, listOPSupplyRateAPY, listCollateralRate, startAmount){
    //write here your strategy
}



module.exports = { runStrategy };

