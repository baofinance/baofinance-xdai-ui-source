import React, { useEffect, useMemo } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useWallet } from 'use-wallet'

import baoBanner from '../../assets/img/bao-banner.png'

import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'


import styled from 'styled-components'
import Spacer from '../../components/Spacer'
import useBao from '../../hooks/useBao'
import CxSwapper from './components/CxSwapper'
import SwapBaocx from './components/SwapBaocx'
import SwapBao from './components/SwapBao'
import { useBaoCxSwapWithdrawableBalance } from '../../hooks/useCxSwap'
import { getBaoContract } from '../../bao/utils'



const CxSwap: React.FC = () => {
	const { path } = useRouteMatch()
	const { account } = useWallet()
	const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
	return (
		<Switch>
			<Page>
				{account ? (
					<>
						<Route exact path={path}>
							<PageHeader
								icon={baoBanner}
								title="Redeem BAOcx for BAO!"
							/>
						</Route>
						<One21 />
					</>
				) : (
					<div
						style={{
							alignItems: 'center',
							display: 'flex',
							flex: 1,
							justifyContent: 'center',
						}}
					>
						<Button
							onClick={onPresentWalletProviderModal}
							text="🔓 Unlock Wallet"
						/>
					</div>
				)}
			</Page>
		</Switch>
	)
}

export default CxSwap

const One21: React.FC = () => {
	const bao = useBao()
	const baocx = useMemo(() => getBaoContract(bao), [bao])
	const withdrawableBalance = useBaoCxSwapWithdrawableBalance(bao)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<>
			<StyledFarm>
				<StyledCardsWrapper>
					<StyledCardWrapper>
						<SwapBao withdrawableBalance={withdrawableBalance} />
					</StyledCardWrapper>
					<Spacer />
					<StyledCardWrapper>
						<SwapBaocx withdrawableBalance={withdrawableBalance} />
					</StyledCardWrapper>
				</StyledCardsWrapper>
				<Spacer size="lg" />

				{/*	<StyledCardsWrapper>
					<StyledCardWrapper>
						<BaocxFarm />
					</StyledCardWrapper>
			</StyledCardsWrapper> */}
				<StyledInfo>
					<p>
						ℹ️️ Interacting with this contract will redeem your BAOcx farming rewards for BAO! 
						Deposit BAOcx and withdraw an equal amount of BAO. Once you deposit tokens into the 
						contract, you must withdraw the full amount in BAO or BAOcx, before you can deposit again.
					</p>{' '}
				</StyledInfo>
				<Spacer size="lg" />
			</StyledFarm>
		</>
	)
}

const StyledFarm = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	@media (max-width: 768px) {
		width: 100%;
	}
`

const StyledCardsWrapper = styled.div`
	display: flex;
	width: 600px;
	@media (max-width: 768px) {
		width: 100%;
		flex-flow: column nowrap;
		align-items: center;
	}
`

const StyledCardWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	@media (max-width: 768px) {
		width: 80%;
	}
`

const StyledInfo = styled.h3`
	color: ${(props) => props.theme.color.grey[500]};
	font-size: 16px;
	font-weight: 400;
	margin: 0;
	padding: 0;
	text-align: center;
	@media (max-width: 900px) {
		width: 90%;
	}
	width: 900px;
`