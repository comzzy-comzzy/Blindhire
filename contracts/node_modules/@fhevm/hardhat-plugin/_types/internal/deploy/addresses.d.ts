import { ethers as EthersT } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
export declare function loadRelayerSignerAddress(hre: HardhatRuntimeEnvironment, dotEnvFile?: string): Promise<string>;
export declare function loadRelayerSigner(hre: HardhatRuntimeEnvironment, dotEnvFile?: string): Promise<EthersT.Signer>;
export declare function getKMSThreshold(dotEnvFile?: string): number;
export declare function getInputVerifierThreshold(dotEnvFile?: string): number;
/**
 * Fhevm Gateway contracts
 * @returns Address of the deployed 'Decryption.sol' contract.
 */
export declare function getGatewayDecryptionAddress(dotEnvFile?: string): string;
/**
 * Fhevm Gateway contracts
 * @returns Address of the deployed 'InputVerification.sol' contract.
 */
export declare function getGatewayInputVerificationAddress(dotEnvFile?: string): string;
export declare function loadCoprocessorSigners({ hre, provider, dotEnvFile, }: {
    hre: HardhatRuntimeEnvironment;
    provider?: EthersT.Provider;
    dotEnvFile?: string;
}): Promise<EthersT.Signer[]>;
export declare function loadKMSSigners({ hre, provider, dotEnvFile, }: {
    hre: HardhatRuntimeEnvironment;
    provider?: EthersT.Provider;
    dotEnvFile?: string;
}): Promise<EthersT.Signer[]>;
//# sourceMappingURL=addresses.d.ts.map