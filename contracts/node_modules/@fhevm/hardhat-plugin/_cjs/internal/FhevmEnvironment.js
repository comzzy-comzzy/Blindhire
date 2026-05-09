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
exports.FhevmEnvironment = void 0;
const mock_utils_1 = require("@fhevm/mock-utils");
const utils_1 = require("@fhevm/mock-utils/utils");
const node_1 = require("@zama-fhe/relayer-sdk/node");
const debug_1 = __importDefault(require("debug"));
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
const path = __importStar(require("path"));
const error_1 = require("../error");
const task_names_1 = require("../task-names");
const FhevmDebugger_1 = require("./FhevmDebugger");
const FhevmEnvironmentPaths_1 = require("./FhevmEnvironmentPaths");
const FhevmExternalAPI_1 = require("./FhevmExternalAPI");
const constants_1 = __importDefault(require("./constants"));
const PrecompiledFhevmHostContracts_1 = require("./deploy/PrecompiledFhevmHostContracts");
const ZamaConfigDotSol_1 = require("./deploy/ZamaConfigDotSol");
const addresses_1 = require("./deploy/addresses");
const setup_1 = require("./deploy/setup");
const error_2 = require("./error");
const env_1 = require("./utils/env");
const hh_1 = require("./utils/hh");
const debugProvider = (0, debug_1.default)("@fhevm/hardhat:provider");
const debugInstance = (0, debug_1.default)("@fhevm/hardhat:instance");
const debugAddresses = (0, debug_1.default)("@fhevm/hardhat:addresses");
class FhevmEnvironment {
    constructor(hre) {
        Object.defineProperty(this, "_hre", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_runningInHHNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_runningInHHTest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_runningInHHFHEVMInstallSolidity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_paths", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_deployRunning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_deployCompleted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_cliAPIInitializing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_cliAPIInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_setupAddressesRunning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_setupAddressesCompleted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_addresses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_fhevmMockProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_minimalInitPromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_initializeCLIApiPromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_contractsRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_instance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_fhevmAPI", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_fhevmDebugger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_mockCoprocessor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_relayerSignerAddress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
        FhevmEnvironment._idCount++;
        this._id = FhevmEnvironment._idCount;
        this._hre = hre;
        this._fhevmAPI = new FhevmExternalAPI_1.FhevmExternalAPI(this);
        this._fhevmDebugger = new FhevmDebugger_1.FhevmDebugger(this);
        this._paths = new FhevmEnvironmentPaths_1.FhevmEnvironmentPaths(hre.config.paths.root);
        (0, hh_1.checkHardhatRuntimeEnvironment)(hre);
    }
    setRunningInHHFHEVMInstallSolidity() {
        (0, error_2.assertHHFhevm)(this._hre.network.name === "hardhat", `Expecting network 'hardhat'. Got '${this._hre.network.name}' instead.`);
        if (this._runningInHHFHEVMInstallSolidity !== undefined) {
            throw new error_1.HardhatFhevmError(`The fhevm hardhat plugin is already running inside a 'hardhat ${task_names_1.SCOPE_FHEVM} ${task_names_1.SCOPE_FHEVM_TASK_INSTALL_SOLIDITY}' command.`);
        }
        this._runningInHHFHEVMInstallSolidity = true;
    }
    unsetRunningInHHFHEVMInstallSolidity() {
        (0, error_2.assertHHFhevm)(this._hre.network.name === "hardhat", `Expecting network 'hardhat'. Got '${this._hre.network.name}' instead.`);
        if (this._runningInHHFHEVMInstallSolidity !== true) {
            throw new error_1.HardhatFhevmError(`The fhevm hardhat plugin is not running inside a 'hardhat ${task_names_1.SCOPE_FHEVM} ${task_names_1.SCOPE_FHEVM_TASK_INSTALL_SOLIDITY}' command.`);
        }
        this._runningInHHFHEVMInstallSolidity = undefined;
    }
    setRunningInHHTest() {
        if (this._runningInHHTest !== undefined) {
            throw new error_1.HardhatFhevmError(`The fhevm hardhat plugin is already running inside a hardhat test command.`);
        }
        if (this._runningInHHNode !== undefined) {
            throw new error_1.HardhatFhevmError(`The fhevm hardhat plugin is already running inside a hardhat node command.`);
        }
        this._runningInHHTest = true;
    }
    setRunningInHHNode() {
        (0, error_2.assertHHFhevm)(this._hre.network.name === "hardhat", `Expecting network 'hardhat'. Got '${this._hre.network.name}' instead.`);
        if (this._runningInHHTest !== undefined) {
            throw new error_1.HardhatFhevmError(`The fhevm hardhat plugin is already running inside a hardhat test command.`);
        }
        if (this._runningInHHNode !== undefined) {
            throw new error_1.HardhatFhevmError(`The fhevm hardhat plugin is already running inside a hardhat node command.`);
        }
        this._runningInHHNode = true;
    }
    get isRunningInHHTest() {
        return this._runningInHHTest === true;
    }
    get isRunningInHHNode() {
        return this._runningInHHNode === true;
    }
    get isRunningInHHFHEVMInstallSolidity() {
        return this._runningInHHFHEVMInstallSolidity === true;
    }
    get useEmbeddedMockEngine() {
        return this.mockProvider.info.type !== mock_utils_1.FhevmMockProviderType.HardhatNode;
    }
    get hre() {
        if (!this._hre) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._hre;
    }
    get relayerProvider() {
        return this.hre.ethers.provider;
    }
    get readonlyEthersProvider() {
        return this.hre.ethers.provider;
    }
    get readonlyEip1193Provider() {
        return this.hre.network.provider;
    }
    get mockProvider() {
        if (!this._fhevmMockProvider) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._fhevmMockProvider;
    }
    get paths() {
        return this._paths;
    }
    get debugger() {
        if (!this._fhevmDebugger) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._fhevmDebugger;
    }
    get coprocessor() {
        if (!this._mockCoprocessor) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._mockCoprocessor;
    }
    getInstanceOrUndefined() {
        return this._instance;
    }
    get instance() {
        if (!this._instance) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._instance;
    }
    getRelayerUrl() {
        const relayerUrl = this.__getAddresses()?.relayerUrl;
        if (!relayerUrl) {
            throw new error_1.HardhatFhevmError(`The relayerUrl is not initialized.`);
        }
        return relayerUrl;
    }
    resolveRelayerUrl(ACLAddress) {
        if (this.mockProvider.isMock) {
            throw new error_1.HardhatFhevmError(`relayerUrl is not defined in mock mode.`);
        }
        if (ACLAddress === constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.ACLAddress) {
            return constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.relayerUrl;
        }
        const dotEnvFile = this._paths.dotEnvFile;
        if (ACLAddress === (0, env_1.getEnvString)({ name: "ACL_CONTRACT_ADDRESS", dotEnvFile })) {
            return (0, env_1.getEnvString)({ name: "RELAYER_URL", dotEnvFile });
        }
        throw new error_1.HardhatFhevmError(`There is no relayerUrl defined for ACL address '${ACLAddress}'.`);
    }
    __getAddresses() {
        if (!this._addresses) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._addresses;
    }
    getACLAddress() {
        if (!this._addresses) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._addresses.CoprocessorConfig.ACLAddress;
    }
    getFHEVMExecutorAddress() {
        if (!this._addresses) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._addresses.CoprocessorConfig.CoprocessorAddress;
    }
    getInputVerifierAddress() {
        if (!this._addresses) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._addresses.InputVerifierAddress;
    }
    getKMSVerifierAddress() {
        if (!this._addresses) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._addresses.CoprocessorConfig.KMSVerifierAddress;
    }
    getCoprocessorSigners() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository.inputVerifier.getCoprocessorSigners();
    }
    getCoprocessorSignersOrThrow() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        const cs = this._contractsRepository.inputVerifier.getCoprocessorSigners();
        if (!cs) {
            throw new error_1.HardhatFhevmError(`Undefined coprocessor signers wallets.`);
        }
        return cs;
    }
    getKMSSigners() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository.kmsVerifier.getKmsSigners();
    }
    getKMSSignersOrThrow() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        const cs = this._contractsRepository.kmsVerifier.getKmsSigners();
        if (!cs) {
            throw new error_1.HardhatFhevmError(`Undefined KMSVerifier signers wallets.`);
        }
        return cs;
    }
    getGatewayInputVerificationAddress() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository.inputVerifier.gatewayInputVerificationAddress;
    }
    getGatewayDecryptionAddress() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository.kmsVerifier.gatewayDecryptionAddress;
    }
    getACLReadOnly() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository.acl.readonlyContract;
    }
    getFHEVMExecutorReadOnly() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository.fhevmExecutor.readonlyContract;
    }
    getInputVerifierReadOnly() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository.inputVerifier.readonlyContract;
    }
    getKMSVerifierReadOnly() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository.kmsVerifier.readonlyContract;
    }
    getGatewayChainId() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return Number(this._contractsRepository.kmsVerifier.gatewayChainId);
    }
    get chainId() {
        if (!this._fhevmMockProvider) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._fhevmMockProvider.chainId;
    }
    getRelayerSignerAddress() {
        if (!this._relayerSignerAddress) {
            throw new error_1.HardhatFhevmError(`Relayer signer address is not defined. Ensure that the Fhevm environment has been properly initialized by calling runSetup() (${this._id}/${FhevmEnvironment._idCount})`);
        }
        return this._relayerSignerAddress;
    }
    get externalFhevmAPI() {
        if (this.isRunningInHHNode) {
            throw new error_1.HardhatFhevmError(`the HardhatFhevmRuntimeEnvironment 'fhevm' is not accessible from the 'hardhat node' server`);
        }
        return this._fhevmAPI;
    }
    getContractsRepository() {
        if (!this._contractsRepository) {
            throw new error_1.HardhatFhevmError(`The Hardhat Fhevm plugin is not initialized.`);
        }
        return this._contractsRepository;
    }
    get isDeployed() {
        return this._deployCompleted;
    }
    async initializeCLIApi() {
        if (this._initializeCLIApiPromise !== undefined) {
            return this._initializeCLIApiPromise;
        }
        this._initializeCLIApiPromise = (async () => {
            try {
                await this.__initializeCLIApi();
            }
            finally {
                this._initializeCLIApiPromise = undefined;
            }
        })();
        return this._initializeCLIApiPromise;
    }
    async __initializeCLIApi() {
        if (this._cliAPIInitialized) {
            return;
        }
        if (this._cliAPIInitializing) {
            throw new error_1.HardhatFhevmError(`The Fhevm CLI initialization is already in progress.`);
        }
        this._cliAPIInitializing = true;
        try {
            if (this.isDeployed) {
                return;
            }
            if (this.hre.network.name === "hardhat") {
                throw new error_1.HardhatFhevmError(`The Fhevm CLI only supports the Hardhat Node (--network localhost) or Sepolia (--network sepolia) networks.`);
            }
            await this.minimalInit();
            if (this.mockProvider.info.type !== mock_utils_1.FhevmMockProviderType.HardhatNode &&
                this.mockProvider.info.type !== mock_utils_1.FhevmMockProviderType.SepoliaEthereumTestnet &&
                this.mockProvider.info.type !== mock_utils_1.FhevmMockProviderType.EthereumMainnet) {
                throw new error_1.HardhatFhevmError(`The Fhevm CLI only supports the Hardhat Node (--network localhost), Sepolia (--network sepolia) or Mainnet (--network mainnet) networks.`);
            }
            await this.deploy();
            this._cliAPIInitialized = true;
        }
        finally {
            this._cliAPIInitializing = false;
        }
    }
    async deploy() {
        if (this._deployCompleted) {
            throw new error_1.HardhatFhevmError("The Fhevm environment is already initialized.");
        }
        if (this._deployRunning) {
            throw new error_1.HardhatFhevmError(`The Fhevm environment initialization is already in progress.`);
        }
        this._deployRunning = true;
        try {
            await this._deployCore();
            this._deployCompleted = true;
        }
        finally {
            this._deployRunning = false;
        }
    }
    __guessDefaultProvider() {
        const url = "url" in this.hre.network.config ? this.hre.network.config.url : undefined;
        if (this.hre.network.name === "hardhat") {
            (0, error_2.assertHHFhevm)(url === undefined);
            return {
                networkName: this.hre.network.name,
                type: mock_utils_1.FhevmMockProviderType.Hardhat,
                chainId: this.hre.network.config.chainId,
                url,
            };
        }
        if (!url) {
            throw new error_1.HardhatFhevmError(`Missing network url`);
        }
        const urlObj = new URL(url);
        if (this.hre.network.name === "localhost") {
            (0, error_2.assertHHFhevm)(urlObj.port === "8545");
            return {
                networkName: "localhost",
                type: mock_utils_1.FhevmMockProviderType.HardhatNode,
                chainId: 31337,
                url,
            };
        }
        if (this.hre.network.name === "anvil") {
            return {
                networkName: this.hre.network.name,
                type: mock_utils_1.FhevmMockProviderType.Anvil,
                chainId: this.hre.network.config.chainId,
                url,
            };
        }
        return {
            networkName: this.hre.network.name,
            type: mock_utils_1.FhevmMockProviderType.Unknown,
            chainId: this.hre.network.config.chainId,
            url,
        };
    }
    async minimalInitWithAddresses(ignoreCache) {
        return this.__minimalInit({ initializeAddresses: true, ignoreAddressesCache: ignoreCache });
    }
    async minimalInit() {
        return this.__minimalInit();
    }
    async __minimalInit(options) {
        if (this._minimalInitPromise !== undefined) {
            return this._minimalInitPromise;
        }
        this._minimalInitPromise = (async () => {
            try {
                await this.__minimalInitCore(options);
            }
            finally {
                this._minimalInitPromise = undefined;
            }
        })();
        return this._minimalInitPromise;
    }
    async __minimalInitCore(options) {
        if (this._fhevmMockProvider === undefined) {
            const defaults = this.__guessDefaultProvider();
            debugProvider(`Default provider network: ${defaults.networkName}, type: ${defaults.type}, url: ${defaults.url}`);
            debugProvider(`Default provider type   : ${defaults.type}, url: ${defaults.url}`);
            debugProvider(`Default provider url    : ${defaults.url}`);
            debugProvider("Resolving provider...");
            this._fhevmMockProvider = await mock_utils_1.FhevmMockProvider.fromReadonlyProvider(this.hre.ethers.provider, this.hre.network.name, defaults.type, defaults.chainId, defaults.url);
            debugProvider(`Provider name: ${this._fhevmMockProvider.info.networkName} chainId: ${this._fhevmMockProvider.info.chainId} type: ${this._fhevmMockProvider.info.type}`);
        }
        if (!this.mockProvider.isMock && !this.mockProvider.isEthereum) {
            throw new error_1.HardhatFhevmError("The current version of the fhevm hardhat plugin only supports the 'hardhat' network, 'localhost' hardhat node, anvil, sepolia or mainnet.");
        }
        if (options?.initializeAddresses === true) {
            await this.__initializeAddresses(options?.ignoreAddressesCache ?? false);
        }
    }
    async _createSigners() {
        const params = { hre: this.hre, provider: this.mockProvider.readonlyEthersProvider };
        const kmsSigners = await (0, addresses_1.loadKMSSigners)(params);
        const coprocessorSigners = await (0, addresses_1.loadCoprocessorSigners)(params);
        const oneAddress = "0x0000000000000000000000000000000000000001";
        const balance = ethers_1.ethers.parseEther("10000");
        let zero = await this.mockProvider.impersonateAddressAndSetBalance(ethers_1.ethers.ZeroAddress, balance);
        if (zero === undefined) {
            zero = await this.hre.ethers.getSigner(ethers_1.ethers.ZeroAddress);
        }
        let one = await this.mockProvider.impersonateAddressAndSetBalance(oneAddress, balance);
        if (one === undefined) {
            one = await this.hre.ethers.getSigner(oneAddress);
        }
        return {
            coprocessor: coprocessorSigners,
            kms: kmsSigners,
            oneAddress,
            zeroAddress: ethers_1.ethers.ZeroAddress,
            zero,
            one,
        };
    }
    async _deployCore() {
        await this.minimalInitWithAddresses(false);
        const fhevmAddresses = this.__getAddresses();
        if (!this.mockProvider.isEthereum) {
            const fhevmSigners = await this._createSigners();
            await this.mockProvider.setTemporaryMinimumBlockGasLimit(0x1fffffffffffffn);
            try {
                const setup = await (0, setup_1.setupMockUsingHostContractsArtifacts)(this.mockProvider, fhevmAddresses, fhevmSigners, this.paths);
                this._contractsRepository = setup.contracts;
                (0, error_2.assertHHFhevm)(setup.gatewayChainId === this.getGatewayChainId());
                (0, error_2.assertHHFhevm)(setup.gatewayDecryptionAddress === this.getGatewayDecryptionAddress());
                (0, error_2.assertHHFhevm)(setup.gatewayInputVerificationAddress === this.getGatewayInputVerificationAddress());
            }
            finally {
                await this.mockProvider.unsetTemporaryMinimumBlockGasLimit();
            }
            if (this.useEmbeddedMockEngine) {
                const readonlyEthersProvider = this.mockProvider.readonlyEthersProvider;
                if (!readonlyEthersProvider) {
                    throw new error_1.HardhatFhevmError(`Missing ethers.Provider. The FhevmMockProvider instance does not have a valid ethers.Provider.`);
                }
                const blockNumber = await this.mockProvider.getBlockNumber();
                const db = new mock_utils_1.FhevmDBMap();
                await db.init(blockNumber);
                this._relayerSignerAddress = await (0, addresses_1.loadRelayerSignerAddress)(this.hre);
                this._mockCoprocessor = await mock_utils_1.MockCoprocessor.create(readonlyEthersProvider, {
                    coprocessorContractAddress: this.getFHEVMExecutorAddress(),
                    coprocessorSigners: this.getCoprocessorSignersOrThrow(),
                    inputVerifierContractAddress: this.getInputVerifierAddress(),
                    db,
                });
            }
        }
        else {
            const repo = await mock_utils_1.contracts.FhevmContractsRepository.create(this.readonlyEthersProvider, {
                aclContractAddress: fhevmAddresses.CoprocessorConfig.ACLAddress,
                kmsContractAddress: fhevmAddresses.CoprocessorConfig.KMSVerifierAddress,
            });
            this._contractsRepository = repo;
            debugAddresses(`Gateway ChainId: ${this.getGatewayChainId()}`);
        }
        if (!this.isRunningInHHNode) {
            this._instance = await this.createInstance();
        }
    }
    async createInstance() {
        (0, error_2.assertHHFhevm)(!this.isRunningInHHNode, "Cannot create a MockFhevmInstance object in the 'hardhat node' server");
        if (this.mockProvider.isMock) {
            return mock_utils_1.MockFhevmInstance.create(this.hre.ethers.provider, this.hre.ethers.provider, {
                verifyingContractAddressDecryption: this.getGatewayDecryptionAddress(),
                verifyingContractAddressInputVerification: this.getGatewayInputVerificationAddress(),
                kmsContractAddress: this.getKMSVerifierAddress(),
                inputVerifierContractAddress: this.getInputVerifierAddress(),
                aclContractAddress: this.getACLAddress(),
                chainId: this.chainId,
                gatewayChainId: this.getGatewayChainId(),
            }, {
                inputVerifierProperties: this._contractsRepository?.inputVerifier.inputVerifierProperties,
                kmsVerifierProperties: this._contractsRepository?.kmsVerifier.kmsVerifierProperties,
            });
        }
        else if (this.mockProvider.isEthereum) {
            debugInstance("Creating @zama-fhe/relayer-sdk instance (might take some time)...");
            const ZAMA_FHEVM_API_KEY = config_1.vars.has("ZAMA_FHEVM_API_KEY")
                ? config_1.vars.get("ZAMA_FHEVM_API_KEY")
                : undefined;
            const instance = await (0, node_1.createInstance)({
                ...this.getContractsRepository().getFhevmInstanceConfig({
                    chainId: this.mockProvider.chainId,
                    relayerUrl: this.getRelayerUrl(),
                }),
                network: this.hre.network.provider,
                ...(ZAMA_FHEVM_API_KEY
                    ? {
                        auth: {
                            __type: "ApiKeyHeader",
                            header: "x-api-key",
                            value: ZAMA_FHEVM_API_KEY,
                        },
                    }
                    : {}),
            });
            debugInstance("@zama-fhe/relayer-sdk instance created.");
            return instance;
        }
        else {
            throw new error_1.HardhatFhevmError(`Unsupported network.`);
        }
    }
    async __initializeAddresses(ignoreCache) {
        if (this._addresses !== undefined) {
            return this._addresses;
        }
        if (this._setupAddressesCompleted) {
            throw new error_1.HardhatFhevmError("The Fhevm environment addresses are already initialized.");
        }
        if (this._setupAddressesRunning) {
            throw new error_1.HardhatFhevmError("The Fhevm environment addresses are already being initialized.");
        }
        this._setupAddressesRunning = true;
        {
            let addresses;
            if (this.mockProvider.isSepoliaEthereumTestnet) {
                const envNetworkName = (0, env_1.getOptionalEnvString)({
                    name: "FHEVM_HARDHAT_NETWORK",
                    dotEnvFile: this.paths.dotEnvFile,
                });
                if (this.mockProvider.info.networkName === "devnet" && envNetworkName !== "devnet") {
                    throw new error_1.HardhatFhevmError(`Network 'devnet' requires an .env file. File '${this._paths.dotEnvFile}' does not exist or is invalid.`);
                }
                if (envNetworkName === this.mockProvider.info.networkName) {
                    addresses = this._initializeAddressesEnv();
                }
                else {
                    addresses = await this._initializeAddressesSepolia();
                }
            }
            else if (this.mockProvider.isEthereumMainnet) {
                addresses = await this._initializeAddressesMainnet();
            }
            else {
                addresses = await this._initializeAddressesMock(ignoreCache);
            }
            Object.freeze(addresses);
            Object.freeze(addresses.CoprocessorConfig);
            this._addresses = addresses;
        }
        this._setupAddressesCompleted = true;
        this._setupAddressesRunning = false;
        return this._addresses;
    }
    _initializeAddressesEnv() {
        const dotEnvFile = this._paths.dotEnvFile;
        debugAddresses(`Resolving addresses using ${dotEnvFile}`);
        const ACLAddress = (0, env_1.getEnvString)({ name: "ACL_CONTRACT_ADDRESS", dotEnvFile });
        const CoprocessorAddress = (0, env_1.getEnvString)({ name: "FHEVM_EXECUTOR_CONTRACT_ADDRESS", dotEnvFile });
        const KMSVerifierAddress = (0, env_1.getEnvString)({ name: "KMS_VERIFIER_CONTRACT_ADDRESS", dotEnvFile });
        const InputVerifierAddress = (0, env_1.getEnvString)({ name: "INPUT_VERIFIER_CONTRACT_ADDRESS", dotEnvFile });
        const HCULimitAddress = (0, env_1.getEnvString)({ name: "HCU_LIMIT_CONTRACT_ADDRESS", dotEnvFile });
        const relayerUrl = (0, env_1.getEnvString)({ name: "RELAYER_URL", dotEnvFile });
        (0, utils_1.assertIsAddress)(ACLAddress, "Environment variable ACL_CONTRACT_ADDRESS");
        (0, utils_1.assertIsAddress)(CoprocessorAddress, "Environment variable FHEVM_EXECUTOR_CONTRACT_ADDRESS");
        (0, utils_1.assertIsAddress)(KMSVerifierAddress, "Environment variable KMS_VERIFIER_CONTRACT_ADDRESS");
        (0, utils_1.assertIsAddress)(InputVerifierAddress, "Environment variable INPUT_VERIFIER_CONTRACT_ADDRESS");
        (0, utils_1.assertIsAddress)(HCULimitAddress, "Environment variable HCU_LIMIT_CONTRACT_ADDRESS");
        debugAddresses(`Using relayerUrl: ${relayerUrl}`);
        const envCoprocessorConfig = {
            ACLAddress,
            CoprocessorAddress,
            KMSVerifierAddress,
        };
        const coprocessorConfigDotSolPath = (0, ZamaConfigDotSol_1.generateZamaConfigDotSol)({
            paths: this.paths,
            localAddresses: envCoprocessorConfig,
            sepoliaAddresses: envCoprocessorConfig,
            mainnetAddresses: envCoprocessorConfig,
        });
        (0, error_2.assertHHFhevm)(path.isAbsolute(coprocessorConfigDotSolPath));
        return {
            CoprocessorConfig: envCoprocessorConfig,
            InputVerifierAddress: InputVerifierAddress,
            HCULimitAddress: HCULimitAddress,
            CoprocessorConfigDotSolPath: coprocessorConfigDotSolPath,
            relayerUrl,
            resolvedUsingEnv: true,
        };
    }
    async _initializeAddressesSepolia() {
        debugAddresses(`Resolving addresses using Sepolia Testnet config`);
        const sepoliaCoprocessorConfig = {
            ACLAddress: constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.ACLAddress,
            CoprocessorAddress: constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.CoprocessorAddress,
            KMSVerifierAddress: constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.KMSVerifierAddress,
        };
        const InputVerifierAddress = constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.InputVerifierAddress;
        const HCULimitAddress = constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.HCULimitAddress;
        const relayerUrl = constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.relayerUrl;
        debugAddresses(`Using relayerUrl: ${relayerUrl}`);
        const coprocessorConfigDotSolPath = (0, ZamaConfigDotSol_1.generateZamaConfigDotSol)({
            paths: this.paths,
        });
        (0, error_2.assertHHFhevm)(path.isAbsolute(coprocessorConfigDotSolPath));
        return {
            CoprocessorConfig: sepoliaCoprocessorConfig,
            CoprocessorConfigDotSolPath: coprocessorConfigDotSolPath,
            InputVerifierAddress,
            HCULimitAddress,
            relayerUrl,
            resolvedUsingEnv: false,
        };
    }
    async _initializeAddressesMainnet() {
        debugAddresses(`Resolving addresses using Mainnet config`);
        const mainnetCoprocessorConfig = {
            ACLAddress: constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.mainnet.ACLAddress,
            CoprocessorAddress: constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.mainnet.CoprocessorAddress,
            KMSVerifierAddress: constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.mainnet.KMSVerifierAddress,
        };
        const InputVerifierAddress = constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.mainnet.InputVerifierAddress;
        const HCULimitAddress = constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.mainnet.HCULimitAddress;
        const relayerUrl = constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.mainnet.relayerUrl;
        debugAddresses(`Using relayerUrl: ${relayerUrl}`);
        const coprocessorConfigDotSolPath = (0, ZamaConfigDotSol_1.generateZamaConfigDotSol)({
            paths: this.paths,
        });
        (0, error_2.assertHHFhevm)(path.isAbsolute(coprocessorConfigDotSolPath));
        return {
            CoprocessorConfig: mainnetCoprocessorConfig,
            CoprocessorConfigDotSolPath: coprocessorConfigDotSolPath,
            InputVerifierAddress,
            HCULimitAddress,
            relayerUrl,
            resolvedUsingEnv: false,
        };
    }
    async _initializeAddressesMock(ignoreCache) {
        debugAddresses(`Resolving addresses using Mock config`);
        const hardcodedAddresses = await (0, PrecompiledFhevmHostContracts_1.loadPrecompiledFhevmHostContractsAddresses)(this.mockProvider, this.paths, ignoreCache, this.isRunningInHHFHEVMInstallSolidity);
        const mockCoprocessorConfig = {
            ACLAddress: hardcodedAddresses.ACLAddress,
            CoprocessorAddress: hardcodedAddresses.CoprocessorAddress,
            KMSVerifierAddress: constants_1.default.ZAMA_FHE_RELAYER_SDK_PACKAGE.sepolia.KMSVerifierAddress,
        };
        const coprocessorConfigDotSolPath = (0, ZamaConfigDotSol_1.generateZamaConfigDotSol)({
            paths: this.paths,
            localAddresses: mockCoprocessorConfig,
        });
        debugAddresses(`No relayerUrl in Mock config`);
        (0, error_2.assertHHFhevm)(path.isAbsolute(coprocessorConfigDotSolPath));
        return {
            CoprocessorConfig: mockCoprocessorConfig,
            InputVerifierAddress: hardcodedAddresses.InputVerifierAddress,
            HCULimitAddress: hardcodedAddresses.HCULimitAddress,
            CoprocessorConfigDotSolPath: coprocessorConfigDotSolPath,
            resolvedUsingEnv: true,
        };
    }
    getRemappings() {
        if (!this.mockProvider.isMock && !this.mockProvider.isEthereum) {
            throw new error_1.HardhatFhevmError(`This network configuration is not yet supported by the FHEVM hardhat plugin`);
        }
        return {
            "@fhevm/solidity/config": this.paths.relCacheFhevmSolidityConfigDirUnix,
        };
    }
    getSoliditySourcePaths() {
        return [];
    }
}
exports.FhevmEnvironment = FhevmEnvironment;
Object.defineProperty(FhevmEnvironment, "_idCount", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -1
});
//# sourceMappingURL=FhevmEnvironment.js.map