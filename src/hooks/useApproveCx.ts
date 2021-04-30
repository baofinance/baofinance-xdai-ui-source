import { useCallback, useMemo } from 'react'
import { Contract } from 'web3-eth-contract'
import useBao from './useBao'
import { useWallet } from 'use-wallet'
import { approve, getCxSwapContract } from '../bao/utils'

const useApproveCxSwap = (contract: Contract) => {
  const { account }: { account: string } = useWallet()
  const bao = useBao()
  const one21Contract = useMemo(() => getCxSwapContract(bao), [
    bao,
  ])

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(contract, one21Contract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, contract, one21Contract])

  return { onApprove: handleApprove }
}

export default useApproveCxSwap
