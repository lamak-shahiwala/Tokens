// import { ethers } from 'ethers'
// import { Actions, V4Planner } from '@uniswap/v4-sdk'
// import { RoutePlanner, CommandType } from '@uniswap/universal-router-sdk'

// /* -------------------------------------------------------------------------- */
// /*                                   Constants                                */
// /* -------------------------------------------------------------------------- */

// const UNIVERSAL_ROUTER =
//   '0x66a9893cc07d91d95644aedd05d03f95e1dba8af'

// // Always store lowercase → checksum once
// const WETH = ethers.utils.getAddress(
//   '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
// )

// const USDC = ethers.utils.getAddress(
//   '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
// )

// // ⚠️ These MUST correspond to an existing v4 pool
// const POOL_FEE = 500
// const TICK_SPACING = 10
// const HOOKS = ethers.constants.AddressZero

// const SLIPPAGE_BPS = 100 // 1%

// /* -------------------------------------------------------------------------- */
// /*                            Quote via Simulation                             */
// /* -------------------------------------------------------------------------- */

// async function quoteV4Swap(
//   signer: ethers.Signer,
//   amountIn: ethers.BigNumber
// ) {
//   const router = new ethers.Contract(
//     UNIVERSAL_ROUTER,
//     ['function execute(bytes,bytes[],uint256) payable'],
//     signer
//   )

//   const planner = new V4Planner()
//   const route = new RoutePlanner()

//   planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [
//     {
//       poolKey: {
//         currency0: WETH,
//         currency1: USDC,
//         fee: POOL_FEE,
//         tickSpacing: TICK_SPACING,
//         hooks: HOOKS
//       },
//       zeroForOne: true, // WETH → USDC
//       amountIn: amountIn.toString(),
//       amountOutMinimum: '0',
//       hookData: '0x'
//     }
//   ])

//   planner.addAction(Actions.SETTLE_ALL, [
//     WETH,
//     amountIn.toString()
//   ])

//   planner.addAction(Actions.TAKE_ALL, [
//     USDC,
//     '0'
//   ])

//   route.addCommand(CommandType.V4_SWAP, [
//     planner.actions,
//     planner.params
//   ])

//   const calldata = router.interface.encodeFunctionData(
//     'execute',
//     [
//       route.commands,
//       [planner.finalize()],
//       Math.floor(Date.now() / 1000) + 60
//     ]
//   )

//   /**
//    * Static call to simulate the swap.
//    * If this reverts → pool does not exist or swap is invalid.
//    */
//   const result = await signer.provider!.call({
//     to: UNIVERSAL_ROUTER,
//     data: calldata,
//     value: amountIn
//   })

//   /**
//    * NOTE:
//    * Universal Router does NOT return decoded outputs.
//    * This call only succeeds/fails.
//    *
//    * In production you should decode balance deltas via tracing
//    * or use an off-chain indexer.
//    *
//    * For now, assume success and protect with slippage.
//    */
//   return ethers.BigNumber.from(result)
// }

// /* -------------------------------------------------------------------------- */
// /*                               Execute Swap                                 */
// /* -------------------------------------------------------------------------- */

// export async function executeSwap(
//   signer: ethers.Signer,
//   amountInEth: string
// ) {
//   const amountIn = ethers.utils.parseEther(amountInEth)

//   /* --------------------------- Quote Swap ---------------------------- */

//   let quotedOut: ethers.BigNumber

//   try {
//     quotedOut = await quoteV4Swap(signer, amountIn)
//   } catch (err) {
//     throw new Error('v4 quote failed — pool may not exist')
//   }

//   const minAmountOut = quotedOut
//     .mul(10_000 - SLIPPAGE_BPS)
//     .div(10_000)
//     .toString()

//   /* --------------------------- Build Trade --------------------------- */

//   const router = new ethers.Contract(
//     UNIVERSAL_ROUTER,
//     ['function execute(bytes,bytes[],uint256) payable'],
//     signer
//   )

//   const planner = new V4Planner()
//   const route = new RoutePlanner()

//   planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [
//     {
//       poolKey: {
//         currency0: WETH,
//         currency1: USDC,
//         fee: POOL_FEE,
//         tickSpacing: TICK_SPACING,
//         hooks: HOOKS
//       },
//       zeroForOne: true,
//       amountIn: amountIn.toString(),
//       amountOutMinimum: minAmountOut,
//       hookData: '0x'
//     }
//   ])

//   planner.addAction(Actions.SETTLE_ALL, [
//     WETH,
//     amountIn.toString()
//   ])

//   planner.addAction(Actions.TAKE_ALL, [
//     USDC,
//     '0'
//   ])

//   route.addCommand(CommandType.V4_SWAP, [
//     planner.actions,
//     planner.params
//   ])

//   /* ----------------------------- Execute ----------------------------- */

//   return router.execute(
//     route.commands,
//     [planner.finalize()],
//     Math.floor(Date.now() / 1000) + 300,
//     { value: amountIn }
//   )
// }



// ------------------------------------ NEW FILE V3 -------------------------

import { ethers } from "ethers";

/* -------------------------------------------------------------------------- */
/*                                   Constants                                */
/* -------------------------------------------------------------------------- */

const UNIVERSAL_ROUTER =
  "0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B";

const QUOTER_V2 =
  "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";

const WETH = ethers.utils.getAddress(
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
);

const USDC = ethers.utils.getAddress(
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
);

const FEE = 500; // 0.05%
const SLIPPAGE_BPS = 100; // 1%

/* -------------------------------------------------------------------------- */
/*                                   ABIs                                     */
/* -------------------------------------------------------------------------- */

const UNIVERSAL_ROUTER_ABI = [
  "function execute(bytes commands, bytes[] inputs, uint256 deadline) payable",
];

const QUOTER_ABI = [
  "function quoteExactInput(bytes path, uint256 amountIn) external returns (uint256 amountOut)",
];

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
];

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type SwapResult =
  | { ok: true; txHash: string }
  | { ok: false; reason: string };

/* -------------------------------------------------------------------------- */
/*                               Helper: Quote                                */
/* -------------------------------------------------------------------------- */

async function quoteV3(
  provider: ethers.providers.Provider,
  path: string,
  amountIn: ethers.BigNumber
): Promise<ethers.BigNumber> {
  const quoter = new ethers.Contract(QUOTER_V2, QUOTER_ABI, provider);

  return await quoter.callStatic.quoteExactInput(path, amountIn);
}

/* -------------------------------------------------------------------------- */
/*                               Execute Swap                                 */
/* -------------------------------------------------------------------------- */

export async function executeSwap(
  signer: ethers.Signer,
  sellToken: "ETH" | "USDC",
  buyToken: "ETH" | "USDC",
  amountIn: string
): Promise<SwapResult> {
  try {
    const provider = signer.provider!;
    const user = await signer.getAddress();

    const network = await provider.getNetwork();
    if (network.chainId !== 1) {
      return { ok: false, reason: "Please switch to Ethereum mainnet" };
    }

    const router = new ethers.Contract(
      UNIVERSAL_ROUTER,
      UNIVERSAL_ROUTER_ABI,
      signer
    );

    /* ====================================================================== */
    /*                           ETH → USDC                                    */
    /* ====================================================================== */

    if (sellToken === "ETH" && buyToken === "USDC") {
      const ethAmount = ethers.utils.parseEther(amountIn);

      const balance = await provider.getBalance(user);
      const gasBuffer = ethers.utils.parseEther("0.0003");

      if (balance.lt(ethAmount.add(gasBuffer))) {
        return { ok: false, reason: "Insufficient ETH balance" };
      }

      const PATH = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [WETH, FEE, USDC]
      );

      const quotedOut = await quoteV3(provider, PATH, ethAmount);

      const minOut = quotedOut
        .mul(10_000 - SLIPPAGE_BPS)
        .div(10_000);

      const INPUTS = [
        ethers.utils.defaultAbiCoder.encode(
          ["address", "uint256", "uint256", "bytes", "bool"],
          [user, ethAmount, minOut, PATH, true]
        ),
      ];

      const tx = await router.execute(
        "0x08",
        INPUTS,
        Math.floor(Date.now() / 1000) + 300,
        { value: ethAmount }
      );

      return { ok: true, txHash: tx.hash };
    }

    /* ====================================================================== */
    /*                           USDC → ETH                                    */
    /* ====================================================================== */

    if (sellToken === "USDC" && buyToken === "ETH") {
      const usdcAmount = ethers.utils.parseUnits(amountIn, 6);
      const usdc = new ethers.Contract(USDC, ERC20_ABI, signer);

      const usdcBalance = await usdc.balanceOf(user);
      if (usdcBalance.lt(usdcAmount)) {
        return { ok: false, reason: "Insufficient USDC balance" };
      }

      const allowance = await usdc.allowance(user, UNIVERSAL_ROUTER);
      if (allowance.lt(usdcAmount)) {
        const approveTx = await usdc.approve(
          UNIVERSAL_ROUTER,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();
      }

      const PATH = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [USDC, FEE, WETH]
      );

      const quotedOut = await quoteV3(provider, PATH, usdcAmount);

      const minOut = quotedOut
        .mul(10_000 - SLIPPAGE_BPS)
        .div(10_000);

      const INPUTS = [
        ethers.utils.defaultAbiCoder.encode(
          ["address", "uint256", "uint256", "bytes", "bool"],
          [user, usdcAmount, minOut, PATH, true]
        ),
      ];

      const tx = await router.execute(
        "0x08",
        INPUTS,
        Math.floor(Date.now() / 1000) + 300
      );

      return { ok: true, txHash: tx.hash };
    }

    return { ok: false, reason: "Unsupported token pair" };
  } catch (err: any) {
    return {
      ok: false,
      reason: err?.message ?? "Swap failed",
    };
  }
}