import { useCallback, useEffect, useMemo, useState } from 'react'

import BigNumber from 'bignumber.js'
import useBao from './useBao'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { getAllowance } from '../utils/erc20'
import { getCxSwapContract } from '../bao/utils'

const useAllowanceCxSwap = (contract: Contract): BigNumber => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const bao = useBao()
  const one21Contract = useMemo(() => getCxSwapContract(bao), [
    bao,
  ])

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      contract,
      account,
      one21Contract.options.address,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, contract, one21Contract])

  useEffect(() => {
    if (account && contract && one21Contract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 5000)
    return () => clearInterval(refreshInterval)
  }, [account, contract, one21Contract])

  return allowance
}

export default useAllowanceCxSwap
