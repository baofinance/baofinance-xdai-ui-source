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

export const useBaoCxWithdrawableBalance = (bao: Bao): BigNumber => {
  const { account } = useWallet()
  const [withdrawableBalance, setWithdrawableBalance] = useState(
    new BigNumber(0),
  )
  const block = useBlock()

  const cxswapContract = useMemo(() => getCxSwapContract(bao), [
    bao,
  ])

  const fetchBaocxWithdrawableBalance = useCallback(async () => {
    let balance = await getWithdrawableBalance(
      cxswapContract,
      account,
      getBaocxContract(bao)?.options.address,
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
