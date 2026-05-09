"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_utils_1 = require("@fhevm/mock-utils");
const utils_1 = require("@fhevm/mock-utils/utils");
const config_1 = require("hardhat/config");
const error_1 = require("../error");
const EnvironmentExtender_1 = require("../internal/EnvironmentExtender");
const log_1 = require("../internal/utils/log");
const task_names_1 = require("../task-names");
const picocolors = require("picocolors");
const fhevmScope = (0, config_1.scope)(task_names_1.SCOPE_FHEVM, "Fhevm related commands");
fhevmScope
    .subtask(task_names_1.SCOPE_FHEVM_TASK_INSTALL_SOLIDITY)
    .setDescription("Install all the required fhevm solidity files associated with the selected network.")
    .addFlag("ignoreCache", "Force recompute addresses.")
    .setAction(async ({ ignoreCache, }, hre) => {
    if (hre.network.name !== "hardhat") {
        throw new error_1.HardhatFhevmError(`Please run 'npx hardhat ${task_names_1.SCOPE_FHEVM} ${task_names_1.SCOPE_FHEVM_TASK_INSTALL_SOLIDITY}' using the '--network hardhat' option. The current network is '${hre.network.name}'`);
    }
    const fhevmEnv = EnvironmentExtender_1.fhevmContext.get();
    if (fhevmEnv.isRunningInHHFHEVMInstallSolidity) {
        throw new error_1.HardhatFhevmError(`Command hardhat ${task_names_1.SCOPE_FHEVM} ${task_names_1.SCOPE_FHEVM_TASK_INSTALL_SOLIDITY} is already running`);
    }
    fhevmEnv.setRunningInHHFHEVMInstallSolidity();
    try {
        await fhevmEnv.minimalInitWithAddresses(ignoreCache);
    }
    finally {
        try {
            fhevmEnv.unsetRunningInHHFHEVMInstallSolidity();
        }
        catch {
        }
    }
});
fhevmScope
    .task(task_names_1.SCOPE_FHEVM_TASK_USER_DECRYPT)
    .setDescription("Performs a user decryption of the specified byte-32 handle")
    .addParam("type", "Specify the FHEVM primitive type name (e.g. ebool, euint8, euint16, etc.)")
    .addParam("handle", "Specify the byte-32 handle to decrypt")
    .addParam("user", "Specify which user account index")
    .addParam("contract", "Specify the contract address")
    .setAction(async ({ type, handle, user, contract, }, hre) => {
    const fhevmEnv = EnvironmentExtender_1.fhevmContext.get();
    await fhevmEnv.initializeCLIApi();
    const t = (0, mock_utils_1.tryParseFhevmType)(type);
    if (t === undefined) {
        throw new error_1.HardhatFhevmError(`Unknown FHEVM primitive type name ${type}`);
    }
    let accountIndex;
    accountIndex = Number.parseInt(user);
    if (Number.isNaN(accountIndex) || !Number.isInteger(accountIndex) || accountIndex < 0) {
        throw new error_1.HardhatFhevmError(`Invalid account index '${user}', expecting a positive integer.`);
    }
    const signers = await hre.ethers.getSigners();
    if (accountIndex >= signers.length) {
        throw new error_1.HardhatFhevmError(`Invalid account index '${user}', expecting a positive integer between 0 and ${signers.length - 1}.`);
    }
    if ((0, mock_utils_1.isFhevmEuint)(t)) {
        try {
            const clearUint = await hre.fhevm.userDecryptEuint(t, handle, contract, signers[accountIndex]);
            console.log(clearUint);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new error_1.HardhatFhevmError(e.message, e);
            }
            else {
                throw e;
            }
        }
    }
    else if ((0, mock_utils_1.isFhevmEbool)(t)) {
        try {
            const clearBool = await hre.fhevm.userDecryptEbool(handle, contract, signers[accountIndex]);
            console.log(clearBool);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new error_1.HardhatFhevmError(e.message, e);
            }
            else {
                throw e;
            }
        }
    }
    else if ((0, mock_utils_1.isFhevmEaddress)(t)) {
        try {
            const clearAddress = await hre.fhevm.userDecryptEaddress(handle, contract, signers[accountIndex]);
            console.log(clearAddress);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new error_1.HardhatFhevmError(e.message, e);
            }
            else {
                throw e;
            }
        }
    }
    else {
        throw new error_1.HardhatFhevmError(`Unsupported FHEVM type: ${t}`);
    }
});
fhevmScope
    .task(task_names_1.SCOPE_FHEVM_TASK_PUBLIC_DECRYPT)
    .setDescription("Performs a public decryption of the specified byte-32 handle")
    .addParam("type", "Specify the FHEVM primitive type name (e.g. ebool, euint8, euint16, etc.)")
    .addParam("handle", "Specify the byte-32 handle to decrypt")
    .setAction(async ({ type, handle, }, hre) => {
    const fhevmEnv = EnvironmentExtender_1.fhevmContext.get();
    await fhevmEnv.initializeCLIApi();
    const t = (0, mock_utils_1.tryParseFhevmType)(type);
    if (t === undefined) {
        throw new error_1.HardhatFhevmError(`Unknown FHEVM primitive type name ${type}`);
    }
    if ((0, mock_utils_1.isFhevmEuint)(t)) {
        try {
            const clearUint = await hre.fhevm.publicDecryptEuint(t, handle);
            console.log(clearUint);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new error_1.HardhatFhevmError(e.message, e);
            }
            else {
                throw e;
            }
        }
    }
    else if ((0, mock_utils_1.isFhevmEbool)(t)) {
        try {
            const clearBool = await hre.fhevm.publicDecryptEbool(handle);
            console.log(clearBool);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new error_1.HardhatFhevmError(e.message, e);
            }
            else {
                throw e;
            }
        }
    }
    else if ((0, mock_utils_1.isFhevmEaddress)(t)) {
        try {
            const clearAddress = await hre.fhevm.publicDecryptEaddress(handle);
            console.log(clearAddress);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new error_1.HardhatFhevmError(e.message, e);
            }
            else {
                throw e;
            }
        }
    }
    else {
        throw new error_1.HardhatFhevmError(`Unsupported FHEVM type: ${t}`);
    }
});
fhevmScope
    .task(task_names_1.SCOPE_FHEVM_TASK_CHECK_FHEVM_COMPATIBILITY)
    .setDescription("Checks if a FHEVM contract is well configured to perform FHEVM operations")
    .addParam("address", "Specify the contract address")
    .setAction(async ({ address, }, hre) => {
    if (!hre.ethers.isAddress(address)) {
        throw new error_1.HardhatFhevmError(`Invalid --address parameter value. '${address}' is not a valid address.`);
    }
    const fhevmEnv = EnvironmentExtender_1.fhevmContext.get();
    await fhevmEnv.minimalInitWithAddresses(false);
    const coprocessorConfig = await (0, mock_utils_1.getCoprocessorConfig)(hre.ethers.provider, address);
    if (coprocessorConfig.ACLAddress === hre.ethers.ZeroAddress &&
        coprocessorConfig.CoprocessorAddress === hre.ethers.ZeroAddress &&
        coprocessorConfig.KMSVerifierAddress === hre.ethers.ZeroAddress) {
        const deployedCode = await fhevmEnv.mockProvider.getCodeAt(address);
        if (deployedCode === undefined || deployedCode === "0x") {
            throw new error_1.HardhatFhevmError(`The address '${address}' does not correspond to a deployed contract.`);
        }
    }
    const expected = {
        ACLAddress: fhevmEnv.getACLAddress(),
        CoprocessorAddress: fhevmEnv.getFHEVMExecutorAddress(),
        KMSVerifierAddress: fhevmEnv.getKMSVerifierAddress(),
    };
    if (coprocessorConfig.ACLAddress !== expected.ACLAddress ||
        coprocessorConfig.CoprocessorAddress !== expected.CoprocessorAddress ||
        coprocessorConfig.KMSVerifierAddress !== expected.KMSVerifierAddress) {
        console.log(picocolors.red(`The contract deployed at ${address} is configured with an invalid FHEVM Coprocessor Configuration.`));
        console.log(picocolors.red("The contract's configuration is:"));
        console.log(picocolors.red(JSON.stringify(coprocessorConfig, null, 2)));
        console.log(picocolors.red("The expected configuration is:"));
        console.log(picocolors.red(JSON.stringify(expected, null, 2)));
        throw new error_1.HardhatFhevmError(`The contract deployed at ${address} is not using a valid Coprocessor configuration`);
    }
    console.log(picocolors.green(`The contract deployed at ${address} is configured with the valid FHEVM Coprocessor Configuration:`));
    console.log(JSON.stringify(coprocessorConfig, null, 2));
});
fhevmScope
    .task(task_names_1.SCOPE_FHEVM_TASK_RESOLVE_FHEVM_CONFIG)
    .setDescription("Resolve full FHEVM configuration")
    .addParam("acl", "Specify the acl contract address")
    .addParam("kms", "Specify the kms contract address")
    .setAction(async ({ acl, kms, }, hre) => {
    const fhevmEnv = EnvironmentExtender_1.fhevmContext.get();
    await fhevmEnv.minimalInit();
    (0, utils_1.assertIsAddress)(acl, "acl");
    (0, utils_1.assertIsAddress)(kms, "kms");
    const repo = await mock_utils_1.contracts.FhevmContractsRepository.create(hre.ethers.provider, {
        aclContractAddress: acl,
        kmsContractAddress: kms,
    });
    let relayerUrl = "N/A";
    try {
        relayerUrl = fhevmEnv.resolveRelayerUrl(acl);
    }
    catch {
    }
    const cfg = repo.getFhevmInstanceConfig({
        chainId: fhevmEnv.chainId,
        relayerUrl,
    });
    const inputEIP712 = repo.inputVerifier.eip712Domain;
    const kmsEIP712 = repo.kmsVerifier.eip712Domain;
    const res = {
        config: cfg,
        inputVerifierEIP712: inputEIP712,
        kmsVerifierEIP712: kmsEIP712,
        HCULimit: repo.hcuLimit.address,
    };
    console.log((0, log_1.jsonStringifyBigInt)(res, 2));
});
//# sourceMappingURL=fhevm.js.map