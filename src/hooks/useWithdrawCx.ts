import { useCallback } from 'react'

import useBao from './useBao'
import { useWallet } from 'use-wallet'

import { getCxSwapContract, withdraw } from '../bao/utils'

const useWithdraw = (tokenAddress: string) => {
  const { account } = useWallet()
  const bao = useBao()

  const handle = useCallback(async () => {
    const txHash = await withdraw(
      getCxSwapContract(bao),
      tokenAddress,
      account,
    )
    console.log(txHash)
  }, [account, bao])

  return { onWithdraw: handle }
}

export default useWithdraw
