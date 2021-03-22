import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract, getFarms } from '../bao/utils'
import useBao from './useBao'
import useBlock from './useBlock'

import { Farm } from '../contexts/Farms'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const bao = useBao()
  const farms = getFarms(bao)
  const masterChefContract = getMasterChefContract(bao)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = []

    farms.forEach(async (farm: Farm, i: number) => {
      const balance = await getEarned(masterChefContract, farm.pid, account);
      balances.push(balance);
    })

    setBalance(balances)
  }, [account, masterChefContract, bao])

  useEffect(() => {
    if (account && masterChefContract && bao) {
      fetchAllBalances()
    }
  }, [account, block, masterChefContract, setBalance, bao])

  return balances
}

export default useAllEarnings
