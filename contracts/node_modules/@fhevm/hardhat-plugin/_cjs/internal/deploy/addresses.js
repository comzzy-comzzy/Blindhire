"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRelayerSignerAddress = loadRelayerSignerAddress;
exports.loadRelayerSigner = loadRelayerSigner;
exports.getKMSThreshold = getKMSThreshold;
exports.getInputVerifierThreshold = getInputVerifierThreshold;
exports.getGatewayDecryptionAddress = getGatewayDecryptionAddress;
exports.getGatewayInputVerificationAddress = getGatewayInputVerificationAddress;
exports.loadCoprocessorSigners = loadCoprocessorSigners;
exports.loadKMSSigners = loadKMSSigners;
const mock_utils_1 = require("@fhevm/mock-utils");
const ethers_1 = require("ethers");
const error_1 = require("../../error");
const constants_1 = __importDefault(require("../constants"));
const error_2 = require("../error");
const env_1 = require("../utils/env");
function __isHardhatSignerAddress(hhSigners, address) {
    return hhSigners.findIndex((s) => s.address === address) !== -1;
}
async function loadRelayerSignerAddress(hre, dotEnvFile) {
    const s = await loadRelayerSigner(hre, dotEnvFile);
    const relayerAddress = await s.getAddress();
    return relayerAddress;
}
async function loadRelayerSigner(hre, dotEnvFile) {
    const index = __getRelayerSignerIndex(dotEnvFile);
    const signers = await hre.ethers.getSigners();
    if (index >= signers.length) {
        throw new error_1.HardhatFhevmError(`Hardhat relayer signer index out of bounds (index=${index}). The total number of signers is ${signers.length}.`);
    }
    return signers[index];
}
function __getRelayerSignerIndex(dotEnvFile) {
    try {
        const tStr = (0, env_1.getEnvString)({ name: "HARDHAT_RELAYER_SIGNER_INDEX", dotEnvFile });
        const t = parseInt(tStr);
        if (Number.isNaN(t)) {
            throw new error_1.HardhatFhevmError(`Invalid hardhat relayer signer index: ${tStr}`);
        }
        return t;
    }
    catch {
        return constants_1.default["HARDHAT_RELAYER_SIGNER_INDEX"];
    }
}
function getKMSThreshold(dotEnvFile) {
    return (0, env_1.getEnvUint)({ name: "KMS_THRESHOLD", defaultValue: constants_1.default["KMS_THRESHOLD"], dotEnvFile });
}
function getInputVerifierThreshold(dotEnvFile) {
    return (0, env_1.getEnvUint)({
        name: "INPUT_VERIFIER_THRESHOLD",
        defaultValue: constants_1.default["INPUT_VERIFIER_THRESHOLD"],
        dotEnvFile,
    });
}
function getGatewayDecryptionAddress(dotEnvFile) {
    try {
        const addr = (0, env_1.getEnvString)({ name: "DECRYPTION_ADDRESS", dotEnvFile });
        if (!ethers_1.ethers.isAddress(addr)) {
            throw new error_1.HardhatFhevmError(`Invalid Decryption contract address: ${addr} (KMS Verifying contract source address)`);
        }
        return addr;
    }
    catch {
        return constants_1.default["DECRYPTION_ADDRESS"];
    }
}
function getGatewayInputVerificationAddress(dotEnvFile) {
    try {
        const addr = (0, env_1.getEnvString)({ name: "INPUT_VERIFICATION_ADDRESS", dotEnvFile: dotEnvFile });
        if (!ethers_1.ethers.isAddress(addr)) {
            throw new error_1.HardhatFhevmError(`Invalid InputVerifier verifyingContractSource address: ${addr}`);
        }
        return addr;
    }
    catch {
        return constants_1.default["INPUT_VERIFICATION_ADDRESS"];
    }
}
async function loadCoprocessorSigners({ hre, provider, dotEnvFile, }) {
    try {
        const hhSigners = await hre.ethers.getSigners();
        const coprocessorSignersAddresses = __envGetHardhatSignersAddresses({
            numEnvVarName: "NUM_COPROCESSORS",
            listEnvVarNamePrefix: "COPROCESSOR_SIGNER_ADDRESS_",
            hhSigners,
            dotEnvFile,
        });
        const coprocessorSigners = [];
        for (let idx = 0; idx < coprocessorSignersAddresses.length; idx++) {
            const coprocessorSigner = await hre.ethers.getSigner(coprocessorSignersAddresses[idx]);
            coprocessorSigners.push(coprocessorSigner);
        }
        return coprocessorSigners;
    }
    catch {
    }
    const coprocessorSignerKey = (0, env_1.getEnvString)({
        name: "PRIVATE_KEY_COPROCESSOR_SIGNER",
        defaultValue: constants_1.default["PRIVATE_KEY_COPROCESSOR_SIGNER"],
    });
    const signer = new ethers_1.ethers.Wallet(coprocessorSignerKey).connect(provider ?? null);
    return [signer];
}
async function loadKMSSigners({ hre, provider, dotEnvFile, }) {
    try {
        const hhSigners = await hre.ethers.getSigners();
        const kmsSignersAddresses = __envGetHardhatSignersAddresses({
            numEnvVarName: "NUM_KMS_NODES",
            listEnvVarNamePrefix: "KMS_SIGNER_ADDRESS_",
            hhSigners,
            dotEnvFile,
        });
        const kmsSigners = [];
        for (let idx = 0; idx < kmsSignersAddresses.length; idx++) {
            const kmsSigner = await hre.ethers.getSigner(kmsSignersAddresses[idx]);
            kmsSigners.push(kmsSigner);
        }
        return kmsSigners;
    }
    catch {
        const kmsSignerKey = (0, env_1.getEnvString)({
            name: "PRIVATE_KEY_KMS_SIGNER",
            defaultValue: constants_1.default["PRIVATE_KEY_KMS_SIGNER"],
        });
        const signer = new ethers_1.ethers.Wallet(kmsSignerKey).connect(provider ?? null);
        return [signer];
    }
}
function envGetList(envVarNamePrefix, dotEnvFile) {
    envVarNamePrefix = mock_utils_1.utils.ensureSuffix(envVarNamePrefix, "_");
    const list = [];
    for (let idx = 0; idx < 100; idx++) {
        const value = (0, env_1.getOptionalEnvString)({ name: `${envVarNamePrefix}${idx}`, dotEnvFile });
        if (!value) {
            break;
        }
        list.push(value);
    }
    return list;
}
function removeNonHardhatSignerAddresses(addresses, hhSigners, envVarNamePrefix) {
    envVarNamePrefix = mock_utils_1.utils.ensureSuffix(envVarNamePrefix, "_");
    const hardhatAddresses = [];
    for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];
        if (!__isHardhatSignerAddress(hhSigners, addr)) {
            console.error(`Ingnoring ${envVarNamePrefix}${i}, not an Hardhat signer address.`);
            break;
        }
        hardhatAddresses.push(addr);
    }
    return hardhatAddresses;
}
function __envGetHardhatSignersAddresses({ numEnvVarName, listEnvVarNamePrefix, hhSigners, dotEnvFile, }) {
    const num = (0, env_1.getOptionalEnvUint)({ name: numEnvVarName, dotEnvFile });
    if (num === undefined) {
        throw new error_1.HardhatFhevmError(`Undefined env var name '${numEnvVarName}'`);
    }
    const envList = envGetList(listEnvVarNamePrefix);
    const addresses = removeNonHardhatSignerAddresses(envList, hhSigners, listEnvVarNamePrefix);
    if (addresses.length < num) {
        throw new error_1.HardhatFhevmError(`Unexpected number of addresses. Got '${addresses.length}', expecting at least ${num}`);
    }
    const res = addresses.slice(0, num - 1);
    (0, error_2.assertHHFhevm)(res.length === num);
    return res;
}
//# sourceMappingURL=addresses.js.map