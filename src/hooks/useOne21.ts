import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Bao } from '../bao'
import {
  getBaoAddress,
  getBaocxAddress,
  getCxSwapContract,
  getWithdrawableBalance
} from '../bao/utils'
import useBlock from './useBlock'




export const useBaoCxWithdrawableBalance = (bao: Bao): BigNumber => {
  const { account } = useWallet()
  const [withdrawableBalance, setWithdrawableBalance] = useState(
    new BigNumber(0),
  )
  const block = useBlock()

  const cxswapContract = useMemo(() => getCxSwapContract(bao), [bao])

  const fetchBaocxWithdrawableBalance = useCallback(async () => {
    let balance = await getWithdrawableBalance(
      cxswapContract,
      account,
      getBaocxAddress(bao),
    )
    if (balance.isGreaterThan(0)) {
      setWithdrawableBalance(new BigNumber(balance))
    } else {
      balance = await getWithdrawableBalance(
        cxswapContract,
        account,
        getBaoAddress(bao),
      )
    }
    setWithdrawableBalance(new BigNumber(balance))
  }, [bao, account, cxswapContract])

  useEffect(() => {
    if (account) {
      fetchBaocxWithdrawableBalance()
    }
  }, [account, block])

  return withdrawableBalance
}
