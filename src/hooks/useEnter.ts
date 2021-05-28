import { useCallback } from 'react'

import useBao from './useBao'
import { useWallet } from 'use-wallet'

import { enter, gettBaoContract } from '../bao/utils'

const useEnter = () => {
  const { account } = useWallet()
  const bao = useBao()

  const handle = useCallback(
    async (amount: string) => {
      const txHash = await enter(
        gettBaoContract(bao),
        amount,
        account,
      )
      console.log(txHash)
    },
    [account],
  )

  return { onEnter: handle }
}

export default useEnter
