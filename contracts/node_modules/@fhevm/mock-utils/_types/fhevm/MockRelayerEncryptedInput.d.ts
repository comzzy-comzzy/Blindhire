import type { MinimalProvider } from "../ethers/provider.js";
import type { EncryptionBits, RelayerEncryptedInput } from "../relayer-sdk/types.js";
import { ENCRYPTION_TYPES } from "../relayer-sdk/types.js";
import { InputVerifier } from "./contracts/InputVerifier.js";
type FhevmSdkEncryptionBitWidths = keyof typeof ENCRYPTION_TYPES;
export declare class MockRelayerEncryptedInput implements RelayerEncryptedInput {
    #private;
    static readonly MAX_FHE_BITS: number;
    static readonly MAX_VAR_COUNT: number;
    constructor(relayerProvider: MinimalProvider, contractChainId: number, contractAddress: string, userAddress: string, aclContractAddress: string, inputVerifier: InputVerifier);
    get userAddress(): string;
    get contractAddress(): string;
    private _checkAddFheBits;
    private _addClearTextValueFheBitsPair;
    private _addUint;
    generateZKProof(): {
        readonly chainId: bigint;
        readonly aclContractAddress: `0x${string}`;
        readonly contractAddress: `0x${string}`;
        readonly userAddress: `0x${string}`;
        readonly ciphertextWithZKProof: Uint8Array | string;
        readonly encryptionBits: readonly EncryptionBits[];
    };
    addBool(value: number | bigint | boolean): this;
    add8(value: number | bigint): MockRelayerEncryptedInput;
    add16(value: number | bigint): MockRelayerEncryptedInput;
    add32(value: number | bigint): MockRelayerEncryptedInput;
    add64(value: number | bigint): MockRelayerEncryptedInput;
    add128(value: number | bigint): MockRelayerEncryptedInput;
    addAddress(value: string): this;
    add256(value: number | bigint): RelayerEncryptedInput;
    private _toMockFhevmRelayerV1InputProofPayload;
    private static _computeMockCiphertextWithZKProof;
    encrypt(): Promise<{
        handles: Uint8Array<ArrayBufferLike>[];
        inputProof: Uint8Array<ArrayBufferLike>;
    }>;
    getBits(): FhevmSdkEncryptionBitWidths[];
}
export {};
//# sourceMappingURL=MockRelayerEncryptedInput.d.ts.map