import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const RPC_URL = 'https://testnet-rpc.plumenetwork.xyz/http';

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const searchParams = req.nextUrl.searchParams;
  const address = searchParams.get('address') as string;
  try {
    const rpcResponse = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: address,
      }),
    });

    const result = await rpcResponse.json();
    if (result.error) {
      throw new Error(result.error.message);
    }

    const balance = parseInt(result.result, 16);
    if (balance > 0) {
      return NextResponse.json({
        status: 0,
        data: {
          timestamp: Math.floor(Date.now() / 1000), // timestamp in seconds
          // unique parameter that identifies that the user completed the task
          tx: crypto.createHash('sha256').update(address + "plume").digest('hex'),
        },
      }, { status: 200 });
    }
    return NextResponse.json({
      status: 1,
      data: {},
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 1,
      data: {},
    }, { status: 200 }); // Bitget wants 200 OK on every response
  }
}
