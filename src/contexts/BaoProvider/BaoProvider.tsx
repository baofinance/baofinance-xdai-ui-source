import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Bao } from '../../bao/index'
import { provider } from 'web3-core/types'

export interface BaoContext {
	bao?: Bao
}

export const Context = createContext<BaoContext>({
	bao: undefined,
})

declare global {
	interface Window {
		bao: Bao
	}
}

const BaoProvider: React.FC = ({ children }) => {
	const { ethereum, chainId, account } = useWallet<provider>()
	const [bao, setBao] = useState<Bao>()

	window.bao = bao

	useEffect(() => {
		if (ethereum) {
			console.log(chainId)
			const baoLib = new Bao(ethereum, chainId, false, {
				defaultAccount: account,
				defaultConfirmations: 1,
				autoGasMultiplier: 1.05,
				testing: false,
				defaultGas: '300000',
				defaultGasPrice: '20000000000',
				accounts: [],
				ethereumNodeTimeout: 10000,
			})
			console.log(baoLib)
			setBao(baoLib)
		}
	}, [ethereum, chainId, account])

	const baoContext: { bao: Bao } = { bao }
	return <Context.Provider value={baoContext}>{children}</Context.Provider>
}

export default BaoProvider
