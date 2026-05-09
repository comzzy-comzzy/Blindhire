"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZamaConfigDotSol = generateZamaConfigDotSol;
const debug_1 = __importDefault(require("debug"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const picocolors = __importStar(require("picocolors"));
const error_1 = require("../../error");
const constants_1 = __importDefault(require("../constants"));
const error_2 = require("../error");
const debug = (0, debug_1.default)("@fhevm/hardhat:addresses");
function generateZamaConfigDotSol({ paths, localAddresses, sepoliaAddresses, mainnetAddresses, }) {
    const origPath = paths.fhevmSolidityConfigFile;
    const filename = path.basename(origPath);
    if (!fs.existsSync(origPath)) {
        throw new error_1.HardhatFhevmError(`Unable to retrieve ${origPath}, make sure the package '${constants_1.default.FHEVM_SOLIDITY_PACKAGE.name}' is properly installed'`);
    }
    const expectedLocalACLAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.LocalConfig.ACLAddress;
    const expectedLocalFHEVMExecutorAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.LocalConfig.CoprocessorAddress;
    const expectedLocalKMSVerifierAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.LocalConfig.KMSVerifierAddress;
    const expectedSepoliaACLAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.SepoliaConfig.ACLAddress;
    const expectedSepoliaFHEVMExecutorAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.SepoliaConfig.CoprocessorAddress;
    const expectedSepoliaKMSVerifierAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.SepoliaConfig.KMSVerifierAddress;
    const expectedEthereumACLAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.EthereumConfig.ACLAddress;
    const expectedEthereumFHEVMExecutorAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.EthereumConfig.CoprocessorAddress;
    const expectedEthereumKMSVerifierAddress = constants_1.default.FHEVM_SOLIDITY_PACKAGE.EthereumConfig.KMSVerifierAddress;
    const origContent = fs.readFileSync(origPath, "utf8");
    try {
        (0, error_2.assertHHFhevm)(origContent.indexOf("../lib/FHE.sol") >= 0);
        (0, error_2.assertHHFhevm)(origContent.indexOf("../lib/Impl.sol") >= 0);
        (0, error_2.assertHHFhevm)(origContent.indexOf("library ZamaConfig {") >= 0);
    }
    catch {
        throw new error_1.HardhatFhevmError(`Unexpected '${filename}' file content. File located at '${origPath}' is not supported. (version=${constants_1.default.FHEVM_SOLIDITY_PACKAGE.version}).`);
    }
    const expectedAddresses = [
        { key: "ACLAddress", value: expectedLocalACLAddress, network: "local" },
        { key: "ACLAddress", value: expectedSepoliaACLAddress, network: "sepolia" },
        { key: "ACLAddress", value: expectedEthereumACLAddress, network: "ethereum" },
        { key: "CoprocessorAddress", value: expectedLocalFHEVMExecutorAddress, network: "local" },
        { key: "CoprocessorAddress", value: expectedSepoliaFHEVMExecutorAddress, network: "sepolia" },
        { key: "CoprocessorAddress", value: expectedEthereumFHEVMExecutorAddress, network: "ethereum" },
        { key: "KMSVerifierAddress", value: expectedLocalKMSVerifierAddress, network: "local" },
        { key: "KMSVerifierAddress", value: expectedSepoliaKMSVerifierAddress, network: "sepolia" },
        { key: "KMSVerifierAddress", value: expectedEthereumKMSVerifierAddress, network: "ethereum" },
    ];
    for (const { key, value, network } of expectedAddresses) {
        if (origContent.indexOf(`${key}: ${value}`) < 0) {
            throw new error_1.HardhatFhevmError(`Unexpected ${filename} file. File located at '${origPath}' has changed and is not supported. Expected ${network} ${key}=${value} (version=${constants_1.default.FHEVM_SOLIDITY_PACKAGE.version}).`);
        }
    }
    const expectedLocalConfig = `function _getLocalConfig() private pure returns (CoprocessorConfig memory) {
        return
            CoprocessorConfig({
                ACLAddress: ${expectedLocalACLAddress},
                CoprocessorAddress: ${expectedLocalFHEVMExecutorAddress},
                KMSVerifierAddress: ${expectedLocalKMSVerifierAddress}
            });
    }`;
    const expectedSepoliaConfig = `function _getSepoliaConfig() private pure returns (CoprocessorConfig memory) {
        return
            CoprocessorConfig({
                ACLAddress: ${expectedSepoliaACLAddress},
                CoprocessorAddress: ${expectedSepoliaFHEVMExecutorAddress},
                KMSVerifierAddress: ${expectedSepoliaKMSVerifierAddress}
            });
    }`;
    const expectedEthereumConfig = `function _getEthereumConfig() private pure returns (CoprocessorConfig memory) {
        // The addresses below are placeholders and should be replaced with actual addresses
        // once deployed on the Ethereum mainnet.
        return
            CoprocessorConfig({
                ACLAddress: ${expectedEthereumACLAddress},
                CoprocessorAddress: ${expectedEthereumFHEVMExecutorAddress},
                KMSVerifierAddress: ${expectedEthereumKMSVerifierAddress}
            });
    }`;
    const newLocalConfig = localAddresses
        ? `function _getLocalConfig() private pure returns (CoprocessorConfig memory) {
        return
            CoprocessorConfig({
                ACLAddress: ${localAddresses.ACLAddress},
                CoprocessorAddress: ${localAddresses.CoprocessorAddress},
                KMSVerifierAddress: ${localAddresses.KMSVerifierAddress}
            });
    }`
        : expectedLocalConfig;
    const newSepoliaConfig = sepoliaAddresses
        ? `function _getSepoliaConfig() private pure returns (CoprocessorConfig memory) {
        return
            CoprocessorConfig({
                ACLAddress: ${sepoliaAddresses.ACLAddress},
                CoprocessorAddress: ${sepoliaAddresses.CoprocessorAddress},
                KMSVerifierAddress: ${sepoliaAddresses.KMSVerifierAddress}
            });
    }`
        : expectedSepoliaConfig;
    const newEthereumConfig = mainnetAddresses
        ? `function _getEthereumConfig() private pure returns (CoprocessorConfig memory) {
        return
            CoprocessorConfig({
                ACLAddress: ${mainnetAddresses.ACLAddress},
                CoprocessorAddress: ${mainnetAddresses.CoprocessorAddress},
                KMSVerifierAddress: ${mainnetAddresses.KMSVerifierAddress}
            });
    }`
        : expectedEthereumConfig;
    if (origContent.indexOf(expectedLocalConfig) < 0) {
        throw new error_1.HardhatFhevmError(`Unexpected ${filename} file. File located at '${origPath}' has changed and is not supported (local).`);
    }
    if (origContent.indexOf(expectedSepoliaConfig) < 0) {
        throw new error_1.HardhatFhevmError(`Unexpected ${filename} file. File located at '${origPath}' has changed and is not supported (sepolia).`);
    }
    if (origContent.indexOf(expectedEthereumConfig) < 0) {
        throw new error_1.HardhatFhevmError(`Unexpected ${filename} file. File located at '${origPath}' has changed and is not supported (ethereum).`);
    }
    let dstContent = origContent
        .replaceAll("../lib/FHE.sol", "@fhevm/solidity/lib/FHE.sol")
        .replaceAll("../lib/Impl.sol", "@fhevm/solidity/lib/Impl.sol")
        .replaceAll(expectedLocalConfig, newLocalConfig)
        .replaceAll(expectedSepoliaConfig, newSepoliaConfig)
        .replaceAll(expectedEthereumConfig, newEthereumConfig);
    const dstPath = paths.cacheCoprocessorConfigSol;
    if (fs.existsSync(dstPath)) {
        const existingContent = fs.readFileSync(dstPath, "utf8");
        if (existingContent === dstContent) {
            debug(`Skip ${picocolors.yellowBright(filename)} generation. File ${dstPath} already exists with exact same content.`);
            return dstPath;
        }
    }
    const dstDir = path.dirname(dstPath);
    if (!fs.existsSync(dstDir)) {
        fs.mkdirSync(dstDir, { recursive: true });
    }
    fs.writeFileSync(dstPath, dstContent, "utf8");
    debug(`Generate ${picocolors.yellowBright(filename)} at ${dstPath}. Source ${origPath}`);
    return dstPath;
}
//# sourceMappingURL=ZamaConfigDotSol.js.map