import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
	return (
		<StyledNav>
			<StyledLink
				target="_blank"
				href="https://blockscout.com/xdai/mainnet/address/0xf712a82DD8e2Ac923299193e9d6dAEda2d5a32fd"
			>
				BaoChef Contract
			</StyledLink>
			<StyledLink
				target="_blank"
				href="https://alpha.baoswap.xyz/#/swap?inputCurrency=0x82dFe19164729949fD66Da1a37BC70dD6c4746ce&outputCurrency=XDAI"
			>
				BaoSwap BAO-XDAI
			</StyledLink>
			<StyledLink
				target="_blank"
				href="https://app.sushiswap.fi/pair/0x0eee7f7319013df1f24f5eaf83004fcf9cf49245"
			>
				SushiSwap BAO-ETH
			</StyledLink>
			<StyledLink target="_blank" href="https://discord.gg/BW3P62vJXT">
				Discord
			</StyledLink>
			<StyledLink target="_blank" href="https://twitter.com/thebaoman">
				Twitter
			</StyledLink>
			<StyledLink target="_blank" href="https://thebaoman.medium.com/">
				Medium
			</StyledLink>
		</StyledNav>
	)
}

const StyledNav = styled.nav`
	align-items: center;
	display: flex;
`

const StyledLink = styled.a`
	color: ${(props) => props.theme.color.grey[400]};
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	&:hover {
		color: ${(props) => props.theme.color.grey[500]};
	}
`

export default Nav
