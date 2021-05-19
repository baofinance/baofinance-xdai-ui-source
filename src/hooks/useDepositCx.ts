import { useCallback } from 'react'

import useBao from './useBao'
import { useWallet } from 'use-wallet'

import { getCxSwapContract, deposit } from '../bao/utils'

const useDeposit = (tokenAddress: string, tokenDecimals = 18) => {
  const { account } = useWallet()
  const bao = useBao()

  const handle = useCallback(
    async (amount: string) => {
      const txHash = await deposit(
        getCxSwapContract(bao),
        tokenAddress,
        amount,
        account,
        tokenDecimals,
      )
      console.log(txHash)
    },
    [account, bao],
  )

  return { onDeposit: handle }
}

export default useDeposit
