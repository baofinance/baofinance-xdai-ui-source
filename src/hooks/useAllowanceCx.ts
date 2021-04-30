import { useCallback, useEffect, useMemo, useState } from 'react'
import { provider } from 'web3-core'
import BigNumber from 'bignumber.js'
import useBao from './useBao'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { getAllowance } from '../utils/erc20'
import { getCxSwapContract } from '../bao/utils'

const useAllowanceCx = (contract: Contract): BigNumber => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const bao = useBao()
  const cxswapContract = getCxSwapContract(bao)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      contract,
      account,
      cxswapContract.options.address,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, contract, cxswapContract])

  useEffect(() => {
    if (account && contract && cxswapContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, contract, cxswapContract])

  return allowance
}

export default useAllowanceCx
