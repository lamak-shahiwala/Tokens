import { ethers } from 'ethers'
import { Actions, V4Planner } from '@uniswap/v4-sdk'
import { RoutePlanner, CommandType } from '@uniswap/universal-router-sdk'

const UNIVERSAL_ROUTER =
  '0x66a9893cc07d91d95644aedd05d03f95e1dba8af'

export async function executeSwap(
  signer: ethers.Signer,
  amountInEth: string
) {
  const router = new ethers.Contract(
    UNIVERSAL_ROUTER,
    ['function execute(bytes,bytes[],uint256) payable'],
    signer
  )

  const planner = new V4Planner()
  const route = new RoutePlanner()

  const amountIn = ethers.utils.parseEther(amountInEth).toString()

  planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [{
    poolKey: {
      currency0: ethers.constants.AddressZero, // ETH
      currency1: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      fee: 500,
      tickSpacing: 10,
      hooks: ethers.constants.AddressZero
    },
    zeroForOne: true,
    amountIn,
    amountOutMinimum: '0',
    hookData: '0x'
  }])

  planner.addAction(Actions.SETTLE_ALL, [
    ethers.constants.AddressZero,
    amountIn
  ])

  planner.addAction(Actions.TAKE_ALL, [
    '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0'
  ])

  route.addCommand(CommandType.V4_SWAP, [
    planner.actions,
    planner.params
  ])

  return router.execute(
    route.commands,
    [planner.finalize()],
    Math.floor(Date.now() / 1000) + 600,
    { value: amountIn }
  )
}