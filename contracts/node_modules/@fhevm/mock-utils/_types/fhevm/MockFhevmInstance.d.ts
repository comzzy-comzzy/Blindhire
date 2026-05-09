import type { BytesHex, BytesHexNo0x, FhevmConfigType, KeypairType, KmsDelegatedUserDecryptEIP712Type, KmsUserDecryptEIP712Type } from "@zama-fhe/relayer-sdk/node";
import { ethers as EthersT } from "ethers";
import type { MinimalProvider } from "../ethers/provider.js";
import type { FhevmInstance, HandleContractPair, PublicDecryptResults, PublicParams, RelayerInputProofOptionsType, UserDecryptResults, ZKProofLike } from "../relayer-sdk/types.js";
import { MockRelayerEncryptedInput } from "./MockRelayerEncryptedInput.js";
import { InputVerifier, type InputVerifierProperties } from "./contracts/InputVerifier.js";
import { KMSVerifier, type KMSVerifierProperties } from "./contracts/KMSVerifier.js";
export type MockFhevmInstanceConfigExtra = {
    relayerProvider: MinimalProvider;
    readonlyEthersProvider: EthersT.Provider;
    inputVerifier: InputVerifier;
    kmsVerifier: KMSVerifier;
};
export type MockFhevmInstanceConfig = {
    verifyingContractAddressDecryption: `0x${string}`;
    verifyingContractAddressInputVerification: `0x${string}`;
    kmsContractAddress: `0x${string}`;
    inputVerifierContractAddress: `0x${string}`;
    aclContractAddress: `0x${string}`;
    chainId: number;
    gatewayChainId: number;
};
export declare class MockFhevmInstance implements FhevmInstance {
    #private;
    private constructor();
    get config(): FhevmConfigType;
    get chainId(): number;
    static create(relayerProvider: MinimalProvider, readonlyEthersProvider: EthersT.Provider, config: MockFhevmInstanceConfig, properties: {
        inputVerifierProperties: InputVerifierProperties;
        kmsVerifierProperties: KMSVerifierProperties;
    }): Promise<MockFhevmInstance>;
    static createEIP712({ publicKey, contractAddresses, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, extraData, }: {
        publicKey: string;
        contractAddresses: string[];
        startTimestamp: number;
        durationDays: number;
        verifyingContractAddressDecryption: string;
        contractsChainId: number;
        extraData: BytesHex;
    }): KmsUserDecryptEIP712Type;
    static createDelegatedUserDecryptEIP712({ publicKey, contractAddresses, delegatorAddress, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, extraData, }: {
        publicKey: string;
        contractAddresses: string[];
        delegatorAddress: string;
        startTimestamp: number;
        durationDays: number;
        verifyingContractAddressDecryption: string;
        contractsChainId: number;
        extraData: BytesHex;
    }): KmsDelegatedUserDecryptEIP712Type;
    createEIP712(publicKey: string, contractAddresses: string[], startTimestamp: number, durationDays: number): KmsUserDecryptEIP712Type;
    createDelegatedUserDecryptEIP712(publicKey: string, contractAddresses: string[], delegatorAddress: string, startTimestamp: number, durationDays: number): KmsDelegatedUserDecryptEIP712Type;
    requestZKProofVerification(_zkProof: ZKProofLike, _options?: RelayerInputProofOptionsType): Promise<{
        handles: Uint8Array[];
        inputProof: Uint8Array;
    }>;
    createEncryptedInput(contractAddress: string, userAddress: string): MockRelayerEncryptedInput;
    generateKeypair(): KeypairType<BytesHexNo0x>;
    getPublicKey(): {
        publicKeyId: string;
        publicKey: Uint8Array;
    } | null;
    getPublicParams(_bits: keyof PublicParams<Uint8Array>): {
        publicParams: Uint8Array;
        publicParamsId: string;
    } | null;
    publicDecrypt(handles: (string | Uint8Array)[]): Promise<PublicDecryptResults>;
    userDecrypt(handles: HandleContractPair[], _privateKey: string, publicKey: string, signature: string, contractAddresses: string[], userAddress: string, startTimestamp: number, durationDays: number): Promise<UserDecryptResults>;
    delegatedUserDecrypt(handleContractPairs: HandleContractPair[], _privateKey: string, publicKey: string, signature: string, contractAddresses: string[], delegatorAddress: string, delegateAddress: string, startTimestamp: number, durationDays: number): Promise<UserDecryptResults>;
    static verifyUserDecryptSignature(publicKey: string, signature: string, contractAddresses: string[], userAddress: string, startTimestamp: number, durationDays: number, verifyingContractAddressDecryption: string, contractsChainId: number): Promise<void>;
    static verifyDelegatedUserDecryptSignature({ publicKey, signature, contractAddresses, delegatorAddress, delegateAddress, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, }: {
        publicKey: string;
        signature: string;
        contractAddresses: string[];
        delegatorAddress: string;
        delegateAddress: string;
        startTimestamp: number;
        durationDays: number;
        verifyingContractAddressDecryption: string;
        contractsChainId: number;
    }): Promise<void>;
    static verifyPublicACLPermissions(readonlyEthersProvider: EthersT.Provider, aclContractAddress: string, handles: string[]): Promise<void[]>;
    static verifyUserACLPermissions(readonlyEthersProvider: EthersT.Provider, aclContractAddress: string, handles: HandleContractPair[], userAddress: string): Promise<void[]>;
    static verifyUserDecryptionDelegation(readonlyEthersProvider: EthersT.Provider, aclContractAddress: string, delegatorAddress: string, delegateAddress: string, handles: HandleContractPair[]): Promise<void[]>;
    static verifyHandleContractAddresses(handles: HandleContractPair[], contractAddresses: string[]): void;
}
//# sourceMappingURL=MockFhevmInstance.d.ts.map