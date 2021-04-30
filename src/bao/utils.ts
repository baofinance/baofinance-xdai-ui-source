import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Bao } from './Bao'
import { Contract } from 'web3-eth-contract'
import { Farm } from '../contexts/Farms'

BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80,
})

export const getMasterChefAddress = (bao: Bao): string => {
	return bao && bao.masterChefAddress
}

export const getWethPriceAddress = (bao: Bao): string => {
	return bao && bao.wethPriceAddress
}

export const getBaoPriceAddress = (bao: Bao): string => {
	return bao && bao.baoPriceAddress
}

export const getBaoAddress = (bao: Bao): string => {
	return bao && bao.baoAddress
}

export const getWethContract = (bao: Bao): Contract => {
	return bao && bao.contracts && bao.contracts.weth
}

export const getWethPriceContract = (bao: Bao): Contract => {
	return bao && bao.contracts && bao.contracts.wethPrice
}

export const getBaoPriceContract = (bao: Bao): Contract => {
	return bao && bao.contracts && bao.contracts.baoPrice
}

export const getMasterChefContract = (bao: Bao): Contract => {
	return bao && bao.contracts && bao.contracts.masterChef
}
export const getBaoContract = (bao: Bao): Contract => {
	return bao && bao.contracts && bao.contracts.bao
}

export const getBaocxContract = (
	bao: Bao | undefined,
  ): Contract | undefined => {
	return bao?.contracts.baocx
  }
  
  export const getCxSwapContract = (
	bao: Bao | null | undefined,
  ): Contract | undefined => {
	return bao?.contracts.cxswap
  }

export const getFarms = (bao: Bao): Farm[] => {
	return bao
	  ? bao.contracts.pools.map(
		  ({
			pid,
			name,
			symbol,
			icon,
			tokenAddress,
			tokenDecimals,
			tokenSymbol,
			tokenContract,
			lpAddress,
			lpContract,
			refUrl,
			poolType,
		  }) => ({
			pid,
			id: symbol,
			name,
			lpToken: symbol,
			lpTokenAddress: lpAddress,
			lpContract,
			tokenAddress,
			tokenDecimals,
			tokenSymbol,
			tokenContract,
			earnToken: 'bao',
			earnTokenAddress: bao.contracts.bao.options.address,
			icon,
			refUrl,
			poolType,
		  }),
		)
	  : []
  }
  
  export const getPoolWeight = async (
	masterChefContract: Contract,
	pid: number,
  ): Promise<BigNumber> => {
	const [{ allocPoint }, totalAllocPoint] = await Promise.all([
	  masterChefContract.methods.poolInfo(pid).call(),
	  masterChefContract.methods.totalAllocPoint().call(),
	])
  
	return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
  }
  
  export const getEarned = async (
	masterChefContract: Contract,
	pid: number,
	account: string,
  ): Promise<BigNumber> => {
	return masterChefContract.methods.pendingReward(pid, account).call()
  }
  
  export const getLockedEarned = async (
	baoContract: Contract,
	account: string,
  ): Promise<BigNumber> => {
	return baoContract.methods.lockOf(account).call()
  }
  
  export const getTotalLPWethValue = async (
	masterChefContract: Contract,
	wethContract: Contract,
	lpContract: Contract,
	tokenContract: Contract,
	tokenDecimals: number,
	pid: number,
  ): Promise<{
	tokenAmount: BigNumber
	wethAmount: BigNumber
	totalWethValue: BigNumber
	tokenPriceInWeth: BigNumber
	poolWeight: BigNumber
  }> => {
	const [
	  tokenAmountWholeLP,
	  balance,
	  totalSupply,
	  lpContractWeth,
	  poolWeight,
	] = await Promise.all([
	  tokenContract.methods.balanceOf(lpContract.options.address).call(),
	  lpContract.methods.balanceOf(masterChefContract.options.address).call(),
	  lpContract.methods.totalSupply().call(),
	  wethContract.methods.balanceOf(lpContract.options.address).call(),
	  getPoolWeight(masterChefContract, pid),
	])
  
	// Return p1 * w1 * 2
	const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
	const lpWethWorth = new BigNumber(lpContractWeth)
	const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
	// Calculate
	const tokenAmount = new BigNumber(tokenAmountWholeLP)
	  .times(portionLp)
	  .div(new BigNumber(10).pow(tokenDecimals))
  
	const wethAmount = new BigNumber(lpContractWeth)
	  .times(portionLp)
	  .div(new BigNumber(10).pow(18))
	return {
	  tokenAmount,
	  wethAmount,
	  totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
	  tokenPriceInWeth: wethAmount.div(tokenAmount),
	  poolWeight: poolWeight,
	}
  }
  
  export const approve = async (
	lpContract: Contract,
	masterChefContract: Contract,
	account: string,
  ): Promise<string> => {
	return lpContract.methods
	  .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
	  .send({ from: account })
  }
  
  export const stake = async (
	masterChefContract: Contract,
	pid: number,
	amount: string,
	account: string,
	ref: string,
  ): Promise<string> => {
	return masterChefContract.methods
	  .deposit(pid, ethers.utils.parseUnits(amount, 18), ref)
	  .send({ from: account })
	  .on('transactionHash', (tx: { transactionHash: string }) => {
		console.log(tx)
		return tx.transactionHash
	  })
  }
  
  export const unstake = async (
	masterChefContract: Contract,
	pid: number,
	amount: string,
	account: string,
	ref: string,
  ): Promise<string> => {
	return masterChefContract.methods
	  .withdraw(pid, ethers.utils.parseUnits(amount, 18), ref)
	  .send({ from: account })
	  .on('transactionHash', (tx: { transactionHash: string }) => {
		console.log(tx)
		return tx.transactionHash
	  })
  }
  export const harvest = async (
	masterChefContract: Contract,
	pid: number,
	account: string,
  ): Promise<string> => {
	return masterChefContract.methods
	  .claimReward(pid)
	  .send({ from: account })
	  .on('transactionHash', (tx: { transactionHash: string }) => {
		console.log(tx)
		return tx.transactionHash
	  })
  }
  
  export const getStaked = async (
	masterChefContract: Contract,
	pid: number,
	account: string,
  ): Promise<BigNumber> => {
	try {
	  const { amount } = await masterChefContract.methods
		.userInfo(pid, account)
		.call()
	  return new BigNumber(amount)
	} catch {
	  return new BigNumber(0)
	}
  }
  
  export const getWethPrice = async (bao: Bao): Promise<BigNumber> => {
	const wethPriceContract = getWethPriceContract(bao)
	const amount = await wethPriceContract.methods.latestAnswer().call()
	return new BigNumber(amount)
  }
  
  export const getBaoPrice = async (bao: Bao): Promise<BigNumber> => {
	// FIXME: re-assess once price oracle is deployed, or use baoswap rates
	return new BigNumber(0)
	// const addr = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
	// const amount = await bao.contracts.baoPrice.methods
	//   .consult(addr.toString(), 1)
	//   .call()
	// return new BigNumber(amount)
  }
  
  export const getBaoSupply = async (bao: Bao): Promise<BigNumber> => {
	return new BigNumber(await bao.contracts.bao.methods.totalSupply().call())
  }
  
  export const getReferrals = async (
	masterChefContract: Contract,
	account: string,
  ): Promise<string> => {
	return await masterChefContract.methods.getGlobalRefAmount(account).call()
  }
  
  export function getRefUrl(): string {
	let refer = '0x0000000000000000000000000000000000000000'
	const urlParams = new URLSearchParams(window.location.search)
	if (urlParams.has('ref')) {
	  refer = urlParams.get('ref')
	}
	console.log(refer)
  
	return refer
  }
  
  export const redeem = async (
	masterChefContract: Contract,
	account: string,
  ): Promise<string> => {
	const now = new Date().getTime() / 1000
	if (now >= 1597172400) {
	  return masterChefContract.methods
		.exit()
		.send({ from: account })
		.on('transactionHash', (tx: { transactionHash: string }) => {
		  console.log(tx)
		  return tx.transactionHash
		})
	} else {
	  alert('pool not active')
	}
  }
  
  export const enter = async (
	contract: Contract | undefined,
	amount: string,
	account: string,
  ): Promise<string> => {
	return contract?.methods
	  .enter(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
	  .send({ from: account })
	  .on('transactionHash', (tx: { transactionHash: string }) => {
		console.log(tx)
		return tx.transactionHash
	  })
  }
  
  export const leave = async (
	contract: Contract,
	amount: string,
	account: string,
  ): Promise<string> => {
	return contract.methods
	  .leave(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
	  .send({ from: account })
	  .on('transactionHash', (tx: { transactionHash: string }) => {
		console.log(tx)
		return tx.transactionHash
	  })
  }
  
  export const deposit = async (
	contract: Contract,
	depositTokenAddress: string,
	amount: string,
	account: string,
	tokenDecimals = 18,
  ): Promise<string> => {
	const depositAmount = new BigNumber(amount)
	  .times(new BigNumber(10).pow(tokenDecimals))
	  .toString()
	return contract.methods
	  .deposit(depositTokenAddress, depositAmount)
	  .send({ from: account })
	  .on('transactionHash', (tx: { transactionHash: string }) => {
		console.log(tx)
		return tx.transactionHash
	  })
  }
  
  export const withdraw = async (
	contract: Contract,
	withdrawTokenAddress: string,
	account: string,
  ): Promise<string> => {
	return contract.methods
	  .withdraw(withdrawTokenAddress)
	  .send({ from: account })
	  .on('transactionHash', (tx: { transactionHash: string }) => {
		console.log(tx)
		return tx.transactionHash
	  })
  }
  
  export const getWithdrawableBalance = async (
	cxswapContract: Contract,
	account: string,
	tokenAddress: string,
  ): Promise<BigNumber> => {
	try {
	  const amount = await cxswapContract.methods
		.withdrawableBalance(account, tokenAddress)
		.call()
	  console.log('withdrawableBalance', amount)
	  return new BigNumber(amount)
	} catch {
	  return new BigNumber(0)
	}
  }
  
  export const swapWithFee = async (
	cxswapContract: Contract,
	fromTokenAddress: string,
	toTokenAddress: string,
  ): Promise<BigNumber> => {
	try {
	  const amount = await cxswapContract.methods
		.swapWithFee(fromTokenAddress, toTokenAddress)
		.call()
	  console.log('withdrawableBalance', amount)
	  return new BigNumber(amount)
	} catch {
	  return new BigNumber(0)
	}
  }
  