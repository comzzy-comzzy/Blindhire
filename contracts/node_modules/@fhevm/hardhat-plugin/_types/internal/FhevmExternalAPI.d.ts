import { CoprocessorConfig, CoprocessorEvent, FhevmContractName, FhevmPublicDecryptOptions, FhevmTransactionHCUInfo, FhevmTypeEuint, FhevmTypeName, FhevmUserDecryptOptions } from "@fhevm/mock-utils";
import { relayer } from "@fhevm/mock-utils";
import type { KmsDelegatedUserDecryptEIP712Type, KmsUserDecryptEIP712Type, PublicDecryptResults, UserDecryptResults } from "@zama-fhe/relayer-sdk/node";
import type { FhevmInstance, HandleContractPair, RelayerEncryptedInput } from "@zama-fhe/relayer-sdk/node";
import { AddressLike, ethers as EthersT } from "ethers";
import { HardhatFhevmRuntimeDebugger, HardhatFhevmRuntimeEnvironment } from "../types";
import { FhevmEnvironment } from "./FhevmEnvironment";
import { FhevmContractError } from "./errors/FhevmContractError";
/**
 * Public External API
 */
export declare class FhevmExternalAPI implements HardhatFhevmRuntimeEnvironment {
    private _fhevmEnv;
    constructor(fhevmEnv: FhevmEnvironment);
    initializeCLIApi(): Promise<void>;
    get isMock(): boolean;
    get debugger(): HardhatFhevmRuntimeDebugger;
    createInstance(): Promise<FhevmInstance>;
    typeof(handleBytes32: string): FhevmTypeName;
    tryParseFhevmError(e: unknown, options?: {
        encryptedInput?: RelayerEncryptedInput;
        out?: "stderr" | "stdout" | "console";
    }): Promise<FhevmContractError | undefined>;
    revertedWithCustomErrorArgs(contractName: FhevmContractName, customErrorName: string): [{
        interface: EthersT.Interface;
    }, string];
    parseCoprocessorEvents(logs: (EthersT.EventLog | EthersT.Log)[] | null | undefined): CoprocessorEvent[];
    computeTransactionHCU(transactionReceipt: EthersT.TransactionReceipt): FhevmTransactionHCUInfo;
    getRelayerMetadata(): Promise<relayer.RelayerMetadata>;
    encryptUint(fhevmType: FhevmTypeEuint, value: number | bigint, contractAddress: string, userAddress: string): Promise<{
        externalEuint: Uint8Array<ArrayBufferLike>;
        inputProof: Uint8Array<ArrayBufferLike>;
    }>;
    encryptBool(value: boolean, contractAddress: string, userAddress: string): Promise<{
        externalEbool: Uint8Array<ArrayBufferLike>;
        inputProof: Uint8Array<ArrayBufferLike>;
    }>;
    encryptAddress(value: string, contractAddress: string, userAddress: string): Promise<{
        externalEaddress: Uint8Array<ArrayBufferLike>;
        inputProof: Uint8Array<ArrayBufferLike>;
    }>;
    createEncryptedInput(contractAddress: string, userAddress: string): RelayerEncryptedInput;
    createEIP712(publicKey: string, contractAddresses: string[], startTimestamp: number, durationDays: number): KmsUserDecryptEIP712Type;
    createDelegatedUserDecryptEIP712(publicKey: string, contractAddresses: string[], delegatorAddress: string, startTimestamp: number, durationDays: number): KmsDelegatedUserDecryptEIP712Type;
    generateKeypair(): {
        publicKey: string;
        privateKey: string;
    };
    userDecrypt(handles: HandleContractPair[], privateKey: string, publicKey: string, signature: string, contractAddresses: string[], userAddress: string, startTimestamp: number, durationDays: number): Promise<UserDecryptResults>;
    delegatedUserDecrypt(handleContractPairs: HandleContractPair[], privateKey: string, publicKey: string, signature: string, contractAddresses: string[], delegatorAddress: string, delegateAddress: string, startTimestamp: number, durationDays: number): Promise<UserDecryptResults>;
    publicDecrypt(handles: (string | Uint8Array)[]): Promise<PublicDecryptResults>;
    userDecryptEbool(handleBytes32: string, contractAddress: EthersT.AddressLike, user: EthersT.Signer, options?: FhevmUserDecryptOptions): Promise<boolean>;
    publicDecryptEbool(handleBytes32: string, options?: FhevmPublicDecryptOptions): Promise<boolean>;
    userDecryptEuint(fhevmType: FhevmTypeEuint, handleBytes32: string, contractAddress: EthersT.AddressLike, user: EthersT.Signer, options?: FhevmUserDecryptOptions): Promise<bigint>;
    publicDecryptEuint(fhevmType: FhevmTypeEuint, handleBytes32: string, options?: FhevmPublicDecryptOptions): Promise<bigint>;
    userDecryptEaddress(handleBytes32: string, contractAddress: EthersT.AddressLike, user: EthersT.Signer, options?: FhevmUserDecryptOptions): Promise<string>;
    publicDecryptEaddress(handleBytes32: string, options?: FhevmPublicDecryptOptions): Promise<string>;
    getCoprocessorConfig(contractAddress: string): Promise<CoprocessorConfig>;
    assertCoprocessorInitialized(contract: AddressLike, contractName?: string): Promise<void>;
}
//# sourceMappingURL=FhevmExternalAPI.d.ts.map