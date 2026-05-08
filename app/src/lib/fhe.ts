import { useEncrypt } from "@zama-fhe/react-sdk";

export { useEncrypt };

export async function encryptValue(
  encrypt: ReturnType<typeof useEncrypt>,
  amount: bigint,
  contractAddress: string,
  userAddress: string
): Promise<{ handle: `0x${string}`; inputProof: `0x${string}` }> {
  const result = await encrypt.mutateAsync({
    values: [{ value: amount, type: "euint64" }],
    contractAddress,
    userAddress,
  });

  const { bytesToHex } = await import("viem");

  return {
    handle: bytesToHex(result.handles[0]!) as `0x${string}`,
    inputProof: bytesToHex(result.inputProof) as `0x${string}`,
  };
}
