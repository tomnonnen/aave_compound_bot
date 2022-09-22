const { Pool, UiIncentiveDataProviderV3, UiPoolDataProviderV3, AaveProtocolDataProvider } = require("./contracts");
const { StableCoins, Mainnet } = require("./constants")
const Strat = require("./Strategies");


async function get_token_price_in_eth(tokenName){
    let newName = tokenName
    if(newName.charAt(0) == 'W'){
        newName = newName.substring(1)
    }

    let response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + newName + 'USDT')
    let data = await response.json()
    let tokenInUSDT = newName == 'USDT' ? 1 : data['price']

    response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
    data = await response.json()
    let ethInUSDT = data['price']

    return tokenInUSDT/ethInUSDT
}

function APR_to_APY(x, y){
    const SECONDS_PER_YEAR = 31536000

    const a = Math.pow((1 + (x / SECONDS_PER_YEAR)), SECONDS_PER_YEAR) - 1
    const b = Math.pow((1 + (y / SECONDS_PER_YEAR)), SECONDS_PER_YEAR) - 1

    return [a, b]

}

function calculeRewards(liquidityRate, variableBorrowRate, aEmissionPerSecond, vEmissionPerSecond){

    const RAY = Math.pow(10,27) // 10 to the power 27
    const SECONDS_PER_YEAR = 31536000
    // Deposit and Borrow calculations
    // APY and APR are returned here as decimals, multiply by 100 to get the percents

    const depositAPR = liquidityRate/RAY
    const variableBorrowAPR = variableBorrowRate/RAY

    const [depositAPY, variableBorrowAPY] = APR_to_APY(depositAPR, variableBorrowAPR)
    // Incentives calculation

    const aEmissionPerYear = aEmissionPerSecond * SECONDS_PER_YEAR
    const vEmissionPerYear = vEmissionPerSecond * SECONDS_PER_YEAR
    

    return [depositAPY*100, aEmissionPerYear, variableBorrowAPY*100, vEmissionPerYear]
}

async function algo(){
    try {
        const adr_provider = await Pool.ADDRESSES_PROVIDER()
        
        var incentives = await UiIncentiveDataProviderV3.getReservesIncentivesData(adr_provider)
        var poolDatas = await UiPoolDataProviderV3.getReservesData(adr_provider)

        
        var listBorrowRate = new Array(StableCoins.length);
        var listSupplyRate = new Array(StableCoins.length);
        var listCollateral = new Array(StableCoins.length);
        var listEModeCollateral = new Array(StableCoins.length);
        var listOPSupplyRateAPR = new Array(StableCoins.length);
        var listOPBorrowRateAPR = new Array(StableCoins.length);
        var listOPSupplyRateAPY = new Array(StableCoins.length);
        var listOPBorrowRateAPY = new Array(StableCoins.length);

        var borrowIsolationMode = new Array(StableCoins.length);

        for(let i=0; i<incentives.length; i++){

            const poolData = poolDatas[0][i]
            const aIncentiveData = incentives[i].aIncentiveData[2][0]
            const vIncentiveData = incentives[i].vIncentiveData[2][0]

            const symbol = poolData.symbol.toUpperCase()
            

            if(StableCoins.includes(symbol)){

                const aEmissionPerSecond = aIncentiveData == undefined ? NaN : aIncentiveData.emissionPerSecond._hex
                const vEmissionPerSecond = vIncentiveData == undefined ? NaN : vIncentiveData.emissionPerSecond._hex
    
                const [depositAPY, aEmissionPerYear, variableBorrowAPY, vEmissionPerYear] = 
                    calculeRewards(poolData.liquidityRate, poolData.variableBorrowRate, aEmissionPerSecond, vEmissionPerSecond)
                

                const REWARD_PRICE_ETH = await get_token_price_in_eth('OP')
                const TOKEN_PRICE_ETH = await get_token_price_in_eth(symbol)

                const TOKEN_DECIMALS = Math.pow(10, poolData.decimals._hex)

                //a is for deposit
                //v is for borrow

                const REWARD_DECIMALS_A = aIncentiveData == undefined ? NaN : Math.pow(10, aIncentiveData.rewardTokenDecimals)
                const REWARD_DECIMALS_V = vIncentiveData == undefined ? NaN : Math.pow(10, vIncentiveData.rewardTokenDecimals)

                var dar = await AaveProtocolDataProvider.getReserveData(Mainnet[symbol])
                const totalATokenSupply = dar.totalAToken._hex 
                const totalCurrentVariableDebt = poolData.totalScaledVariableDebt._hex // marche

                const incentiveDepositAPRPercent = 100 * (aEmissionPerYear * REWARD_PRICE_ETH * TOKEN_DECIMALS)/
                                    (totalATokenSupply * TOKEN_PRICE_ETH * REWARD_DECIMALS_A)
                const incentiveBorrowAPRPercent = 100 * (vEmissionPerYear * REWARD_PRICE_ETH * TOKEN_DECIMALS)/
                                    (totalCurrentVariableDebt * TOKEN_PRICE_ETH * REWARD_DECIMALS_V)

                const [incentiveDepositAPYPercent, incentiveBorrowAPYPercent] = APR_to_APY(incentiveDepositAPRPercent, incentiveBorrowAPRPercent)

                var idx = StableCoins.indexOf(symbol)
                listBorrowRate[idx] = variableBorrowAPY 
                listOPBorrowRateAPR[idx] = incentiveBorrowAPRPercent
                listSupplyRate[idx] = depositAPY 
                listOPSupplyRateAPR[idx] = incentiveDepositAPRPercent
                listOPSupplyRateAPY[idx] = incentiveDepositAPYPercent
                listOPBorrowRateAPY[idx] = incentiveBorrowAPYPercent
                listCollateral[idx] = poolData.baseLTVasCollateral.toNumber()/10000
                listEModeCollateral[idx] = poolData.eModeLtv/10000
                borrowIsolationMode[idx] = poolData.borrowableInIsolation

            }
        }

        Strat.runStrategy(listBorrowRate, listSupplyRate, listOPBorrowRateAPR, listOPSupplyRateAPR, listOPBorrowRateAPY, listOPSupplyRateAPY, listEModeCollateral, 500)
        
    } catch(er){
        console.log(er)
    }
}

algo()

module.exports = { algo };