import type { Auth, ClearValueType, ClearValues, EncryptionBits, FhevmInstance, FhevmInstanceConfig, HandleContractPair, HandleContractPairRelayer, KmsUserDecryptEIP712Type, PublicDecryptResults, PublicParams, RelayerEncryptedInput, RelayerInputProofOptionsType, UserDecryptResults, ZKProofLike } from "@zama-fhe/relayer-sdk/node";
import { generateKeypair } from "./sdk/keypair.js";
declare const ENCRYPTION_TYPES: {
    2: number;
    8: number;
    16: number;
    32: number;
    64: number;
    128: number;
    160: number;
    256: number;
};
type EncryptedInput = {
    addBool: (value: boolean | number | bigint) => EncryptedInput;
    add8: (value: number | bigint) => EncryptedInput;
    add16: (value: number | bigint) => EncryptedInput;
    add32: (value: number | bigint) => EncryptedInput;
    add64: (value: number | bigint) => EncryptedInput;
    add128: (value: number | bigint) => EncryptedInput;
    add256: (value: number | bigint) => EncryptedInput;
    addAddress: (value: string) => EncryptedInput;
    getBits: () => EncryptionBits[];
    encrypt: () => Uint8Array;
};
export interface FhevmSdkModule {
    createEIP712: (gatewayChainId: number, verifyingContract: string, contractsChainId: number) => (publicKey: string | Uint8Array, contractAddresses: string[], startTimestamp: string | number, durationDays: string | number, delegatedAccount?: string) => KmsUserDecryptEIP712Type;
    generateKeypair: () => {
        publicKey: string;
        privateKey: string;
    };
}
export type { UserDecryptResults, PublicDecryptResults, ClearValueType, ClearValues, EncryptionBits, PublicParams, RelayerEncryptedInput, EncryptedInput, FhevmInstanceConfig, Auth, HandleContractPair, HandleContractPairRelayer, FhevmInstance, ZKProofLike, RelayerInputProofOptionsType, };
export { generateKeypair, ENCRYPTION_TYPES };
//# sourceMappingURL=types.d.ts.map