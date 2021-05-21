import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useReward from '../../../hooks/useReward'
import { getBalanceNumber } from '../../../utils/formatBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { Contract } from 'web3-eth-contract'
import useModal from '../../../hooks/useModal'
import WithdrawModal from './WithdrawModal'
import useLeave from '../../../hooks/useLeave'
import xbao from '../../../assets/img/xbao.png'

interface HarvestProps {
	lpContract: Contract
}

const UnstakexBao: React.FC<HarvestProps> = ({ lpContract }) => {
	const xBaoBalance = useTokenBalance(lpContract.options.address)
	const [pendingTx, setPendingTx] = useState(false)

	const { onLeave } = useLeave()

	const tokenName = 'xBAO'

	const [onPresentLeave] = useModal(
		<WithdrawModal
			max={xBaoBalance}
			onConfirm={onLeave}
			tokenName={tokenName}
		/>,
	)

	return (
		<Card>
			<CardContent>
				<StyledCardContentInner>
					<StyledCardHeader>
						<CardIcon>
						<img src={xbao} alt="" height="50" />
						</CardIcon>
						<Value value={getBalanceNumber(xBaoBalance)} />
						<Label text="xBAO Available" />
					</StyledCardHeader>
					<StyledCardActions>
						<Button
							disabled={!xBaoBalance.toNumber() || pendingTx}
							text={pendingTx ? 'Converting to BAO' : 'Convert to BAO'}
							onClick={async () => {
								setPendingTx(true)
								await onPresentLeave()
								setPendingTx(false)
							}}
						/>
					</StyledCardActions>
				</StyledCardContentInner>
			</CardContent>
		</Card>
	)
}

const StyledCardHeader = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
`
const StyledCardActions = styled.div`
	display: flex;
	justify-content: center;
	margin-top: ${(props) => props.theme.spacing[6]}px;
	width: 100%;
`

const StyledSpacer = styled.div`
	height: ${(props) => props.theme.spacing[4]}px;
	width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
`

export default UnstakexBao
