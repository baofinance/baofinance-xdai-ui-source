import { useCallback } from 'react'

import useBao from './useBao'
import { useWallet } from 'use-wallet'

import { leave, getxBaoStakingContract } from '../bao/utils'

const useLeave = () => {
  const { account } = useWallet()
  const bao = useBao()

  const handle = useCallback(
    async (amount: string) => {
      const txHash = await leave(
        getxBaoStakingContract(bao),
        amount,
        account,
      )
      console.log(txHash)
    },
    [account],
  )

  return { onLeave: handle }
}

export default useLeave
