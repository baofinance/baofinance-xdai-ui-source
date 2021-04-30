import { useCallback, useEffect, useMemo, useState } from 'react'

import { useWallet } from 'use-wallet'

import {
  getCxSwapContract,
  getWithdrawableBalance,
  getBaocxContract,
  getBaoAddress,
} from '../bao/utils'
import BigNumber from 'bignumber.js'

import useBlock from './useBlock'
import { Bao } from '../bao'

export const useBaoCxSwapWithdrawableBalance = (bao: Bao): BigNumber => {
  const { account } = useWallet()
  const [withdrawableBalance, setWithdrawableBalance] = useState(
    new BigNumber(0),
  )
  const block = useBlock()

  const one21Contract = useMemo(() => getCxSwapContract(bao), [
    bao,
  ])

  const fetchBaocxWithdrawableBalance = useCallback(async () => {
    let balance = await getWithdrawableBalance(
      one21Contract,
      account,
      getBaocxContract(bao)?.options.address,
    )
    if (balance.isGreaterThan(0)) {
      setWithdrawableBalance(new BigNumber(balance))
    } else {
      balance = await getWithdrawableBalance(
        one21Contract,
        account,
        getBaoAddress(bao),
      )
    }
    setWithdrawableBalance(new BigNumber(balance))
  }, [bao, account, one21Contract])

  useEffect(() => {
    if (account) {
      fetchBaocxWithdrawableBalance()
    }
  }, [account, block])

  return withdrawableBalance
}
