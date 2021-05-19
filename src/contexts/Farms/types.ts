import { Contract } from 'web3-eth-contract'

export enum PoolType {
  SUSHI = 'sushi',
  BAOSWAP = 'baoswap',
  ARCHIVED = 'archived'
}

export interface Farm {
  pid: number
  name: string
  lpToken: string
  lpTokenAddress: string
  lpContract: Contract
  tokenAddress: string
  tokenDecimals: number
  earnToken: string
  earnTokenAddress: string
  icon: string
  id: string
  tokenSymbol: string
  refUrl: string
  poolType?: PoolType
}

export interface FarmsContext {
  farms: Farm[]
  unharvested: number
}
