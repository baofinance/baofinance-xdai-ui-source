import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getBalanceNumber } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import useWithdrawCx from '../../../hooks/useWithdrawCx'
import useAllowanceCx from '../../../hooks/useAllowanceCx'
import useApproveCx from '../../../hooks/useApproveCx'
import baocxIcon from '../../../assets/img/baocx-icon.svg'
import useDepositCx from '../../../hooks/useDepositCx'
import { getBaocxAddress, getBaocxContract } from '../../../bao/utils'
import useBao from '../../../hooks/useBao'

interface SwapPandaProps {
	withdrawableBalance: BigNumber
}

const SwapBaocx: React.FC<SwapPandaProps> = ({ withdrawableBalance }) => {
	const bao = useBao()
	const tokenName = 'BAOcx'
	const address = useMemo(() => getBaocxAddress(bao), [bao])
	const walletBalance = useTokenBalance(address)

	const [requestedApproval, setRequestedApproval] = useState(false)
	const contract = useMemo(() => getBaocxContract(bao), [bao])
	const allowance = useAllowanceCx(contract)
	const { onApprove } = useApproveCx(contract)

	const { onDeposit } = useDepositCx(address)
	const { onWithdraw } = useWithdrawCx(address)

	const [onPresentDeposit] = useModal(
		<DepositModal
			max={walletBalance}
			onConfirm={onDeposit}
			tokenName={tokenName}
			tokenDecimals={18}
		/>,
	)

	const [onPresentWithdraw] = useModal(
		<WithdrawModal
			max={withdrawableBalance}
			onConfirm={onWithdraw}
			tokenName={tokenName}
			tokenDecimals={18}
		/>,
	)

	const handleApprove = useCallback(async () => {
		try {
			setRequestedApproval(true)
			const txHash = await onApprove()
			// user rejected tx or didn't go thru
			if (!txHash) {
				setRequestedApproval(false)
			}
		} catch (e) {
			console.log(e)
		}
	}, [onApprove, setRequestedApproval])

	return (
		<Card>
			<CardContent>
				<StyledCardContentInner>
					<StyledCardHeader>
						<CardIcon>
							<img src={baocxIcon} alt="" height="50" />
						</CardIcon>
						<Value value={getBalanceNumber(walletBalance, 18)} />
						<Label text={`${tokenName} in wallet`} />
						<Value value={getBalanceNumber(withdrawableBalance, 18)} />
						<Label text={`${tokenName} withdrawable`} />
					</StyledCardHeader>
					<StyledCardActions>
						{!allowance.toNumber() ? (
							<Button
								disabled={
									requestedApproval || walletBalance.eq(new BigNumber(0))
								}
								onClick={handleApprove}
								text={`Approve ${tokenName}`}
							/>
						) : (
							<Button
								disabled={!address || walletBalance.eq(new BigNumber(0))}
								text={`Deposit ${tokenName}`}
								onClick={onPresentDeposit}
							/>
						)}
						<StyledActionSpacer />
						<Button
							disabled={!address || withdrawableBalance.eq(new BigNumber(0))}
							text={`Withdraw ${tokenName}`}
							onClick={onPresentWithdraw}
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
	margin-top: ${(props) => props.theme.spacing[5]}px;
	width: 100%;
`

const StyledActionSpacer = styled.div`
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

export default SwapBaocx
