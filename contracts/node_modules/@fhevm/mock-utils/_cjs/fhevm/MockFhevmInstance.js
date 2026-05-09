"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MockFhevmInstance_relayerProvider, _MockFhevmInstance_readonlyEthersProvider, _MockFhevmInstance_chainId, _MockFhevmInstance_gatewayChainId, _MockFhevmInstance_verifyingContractAddressInputVerification, _MockFhevmInstance_verifyingContractAddressDecryption, _MockFhevmInstance_contractsChainId, _MockFhevmInstance_aclContractAddress, _MockFhevmInstance_kmsVerifier, _MockFhevmInstance_inputVerifier;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockFhevmInstance = void 0;
const node_1 = require("@zama-fhe/relayer-sdk/node");
const ethers_1 = require("ethers");
const constants_js_1 = require("../constants.js");
const eip712_js_1 = require("../ethers/eip712.js");
const decryptUtils_js_1 = require("../relayer-sdk/relayer/decryptUtils.js");
const publicDecrypt_js_1 = require("../relayer-sdk/relayer/publicDecrypt.js");
const userDecrypt_js_1 = require("../relayer-sdk/relayer/userDecrypt.js");
const address_js_1 = require("../utils/address.js");
const error_js_1 = require("../utils/error.js");
const hex_js_1 = require("../utils/hex.js");
const math_js_1 = require("../utils/math.js");
const string_js_1 = require("../utils/string.js");
const FhevmHandle_js_1 = require("./FhevmHandle.js");
const MockRelayerEncryptedInput_js_1 = require("./MockRelayerEncryptedInput.js");
const InputVerifier_js_1 = require("./contracts/InputVerifier.js");
const KMSVerifier_js_1 = require("./contracts/KMSVerifier.js");
const relayer = require("./relayer/MockRelayer.js");
class MockFhevmInstance {
    constructor(config, extra) {
        _MockFhevmInstance_relayerProvider.set(this, void 0);
        _MockFhevmInstance_readonlyEthersProvider.set(this, void 0);
        _MockFhevmInstance_chainId.set(this, void 0);
        _MockFhevmInstance_gatewayChainId.set(this, void 0);
        _MockFhevmInstance_verifyingContractAddressInputVerification.set(this, void 0);
        _MockFhevmInstance_verifyingContractAddressDecryption.set(this, void 0);
        _MockFhevmInstance_contractsChainId.set(this, void 0);
        _MockFhevmInstance_aclContractAddress.set(this, void 0);
        _MockFhevmInstance_kmsVerifier.set(this, void 0);
        _MockFhevmInstance_inputVerifier.set(this, void 0);
        (0, address_js_1.assertIsAddress)(config.verifyingContractAddressInputVerification, "config.verifyingContractAddressInputVerification");
        (0, address_js_1.assertIsAddress)(config.verifyingContractAddressDecryption, "config.verifyingContractAddressDecryption");
        (0, math_js_1.assertIsNumber)(config.gatewayChainId, "config.gatewayChainId");
        __classPrivateFieldSet(this, _MockFhevmInstance_relayerProvider, extra.relayerProvider, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_readonlyEthersProvider, extra.readonlyEthersProvider, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_chainId, config.chainId, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_gatewayChainId, config.gatewayChainId, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_verifyingContractAddressInputVerification, config.verifyingContractAddressInputVerification, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_verifyingContractAddressDecryption, config.verifyingContractAddressDecryption, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_contractsChainId, config.chainId, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_aclContractAddress, config.aclContractAddress, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_kmsVerifier, extra.kmsVerifier, "f");
        __classPrivateFieldSet(this, _MockFhevmInstance_inputVerifier, extra.inputVerifier, "f");
    }
    get config() {
        return {
            chainId: BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_chainId, "f")),
            aclContractAddress: __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"),
            coprocessorSignerThreshold: __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f").getThreshold(),
            kmsContractAddress: __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").address,
            verifyingContractAddressDecryption: __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").gatewayDecryptionAddress,
            verifyingContractAddressInputVerification: __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f").gatewayInputVerificationAddress,
            inputVerifierContractAddress: __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f").address,
            gatewayChainId: BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f")),
            coprocessorSigners: __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f").getCoprocessorSignersAddresses(),
            kmsSigners: __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").getKmsSignersAddresses(),
            kmsSignerThreshold: __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").getThreshold(),
        };
    }
    get chainId() {
        return __classPrivateFieldGet(this, _MockFhevmInstance_chainId, "f");
    }
    static async create(relayerProvider, readonlyEthersProvider, config, properties) {
        const kmsVerifier = await KMSVerifier_js_1.KMSVerifier.create(readonlyEthersProvider, config.kmsContractAddress, undefined, properties.kmsVerifierProperties);
        const inputVerifier = await InputVerifier_js_1.InputVerifier.create(readonlyEthersProvider, config.inputVerifierContractAddress, undefined, properties.inputVerifierProperties);
        const instance = new MockFhevmInstance(config, {
            relayerProvider,
            readonlyEthersProvider,
            inputVerifier,
            kmsVerifier,
        });
        return instance;
    }
    static createEIP712({ publicKey, contractAddresses, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, extraData, }) {
        (0, address_js_1.assertIsAddressArray)(contractAddresses, "contractAddresses");
        const k = new node_1.KmsEIP712({ chainId: BigInt(contractsChainId), verifyingContractAddressDecryption });
        const eip712 = k.createUserDecryptEIP712({
            publicKey,
            contractAddresses,
            startTimestamp,
            durationDays,
            extraData,
        });
        (0, error_js_1.assertFhevm)(eip712.domain.version === constants_js_1.default.PUBLIC_DECRYPT_EIP712.domain.version.toString());
        (0, error_js_1.assertFhevm)(eip712.domain.name === constants_js_1.default.PUBLIC_DECRYPT_EIP712.domain.name);
        return eip712;
    }
    static createDelegatedUserDecryptEIP712({ publicKey, contractAddresses, delegatorAddress, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, extraData, }) {
        (0, address_js_1.assertIsAddressArray)(contractAddresses, "contractAddresses");
        const k = new node_1.KmsEIP712({ chainId: BigInt(contractsChainId), verifyingContractAddressDecryption });
        const eip712 = k.createDelegatedUserDecryptEIP712({
            publicKey,
            contractAddresses,
            startTimestamp,
            durationDays,
            extraData,
            delegatorAddress,
        });
        (0, error_js_1.assertFhevm)(eip712.domain.version === constants_js_1.default.PUBLIC_DECRYPT_EIP712.domain.version.toString());
        (0, error_js_1.assertFhevm)(eip712.domain.name === constants_js_1.default.PUBLIC_DECRYPT_EIP712.domain.name);
        return eip712;
    }
    createEIP712(publicKey, contractAddresses, startTimestamp, durationDays) {
        (0, address_js_1.assertIsAddressArray)(contractAddresses, "contractAddresses");
        const eip712 = MockFhevmInstance.createEIP712({
            publicKey,
            contractAddresses,
            startTimestamp,
            durationDays,
            contractsChainId: __classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f"),
            verifyingContractAddressDecryption: __classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressDecryption, "f"),
            extraData: "0x00",
        });
        (0, error_js_1.assertFhevm)(BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f")) === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.chainId);
        (0, error_js_1.assertFhevm)(eip712.domain.verifyingContract === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.verifyingContract);
        (0, error_js_1.assertFhevm)(eip712.domain.version === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.version);
        (0, error_js_1.assertFhevm)(eip712.domain.name === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.name);
        (0, error_js_1.assertFhevm)(BigInt(eip712.domain.chainId) === BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f")));
        return eip712;
    }
    createDelegatedUserDecryptEIP712(publicKey, contractAddresses, delegatorAddress, startTimestamp, durationDays) {
        (0, address_js_1.assertIsAddressArray)(contractAddresses, "contractAddresses");
        const eip712 = MockFhevmInstance.createDelegatedUserDecryptEIP712({
            publicKey,
            contractAddresses,
            delegatorAddress,
            startTimestamp,
            durationDays,
            contractsChainId: __classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f"),
            verifyingContractAddressDecryption: __classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressDecryption, "f"),
            extraData: "0x00",
        });
        (0, error_js_1.assertFhevm)(BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f")) === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.chainId);
        (0, error_js_1.assertFhevm)(eip712.domain.verifyingContract === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.verifyingContract);
        (0, error_js_1.assertFhevm)(eip712.domain.version === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.version);
        (0, error_js_1.assertFhevm)(eip712.domain.name === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.name);
        (0, error_js_1.assertFhevm)(BigInt(eip712.domain.chainId) === BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f")));
        return eip712;
    }
    async requestZKProofVerification(_zkProof, _options) {
        throw new error_js_1.FhevmError("Not Implemented in Mock mode");
    }
    createEncryptedInput(contractAddress, userAddress) {
        (0, error_js_1.assertFhevm)(__classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressInputVerification, "f") === __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f").eip712Domain.verifyingContract);
        (0, error_js_1.assertFhevm)(BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f")) === __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f").eip712Domain.chainId);
        return new MockRelayerEncryptedInput_js_1.MockRelayerEncryptedInput(__classPrivateFieldGet(this, _MockFhevmInstance_relayerProvider, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_chainId, "f"), contractAddress, userAddress, __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f"));
    }
    generateKeypair() {
        return node_1.TKMSPkeKeypair.generate().toBytesHexNo0x();
    }
    getPublicKey() {
        throw new error_js_1.FhevmError("Not supported in mock mode");
    }
    getPublicParams(_bits) {
        throw new error_js_1.FhevmError("Not supported in mock mode");
    }
    async publicDecrypt(handles) {
        const extraData = "0x00";
        for (let i = 0; i < handles.length; ++i) {
            (0, error_js_1.assertFhevm)(typeof handles[i] === "string" || handles[i] instanceof Uint8Array, "handle is not a string or a Uint8Array");
        }
        const handlesBytes32Hex = handles.map((h) => typeof h === "string" ? (0, hex_js_1.toHexString)((0, hex_js_1.fromHexString)(h)) : (0, hex_js_1.toHexString)(h));
        const fhevmHandles = handlesBytes32Hex.map((h) => FhevmHandle_js_1.FhevmHandle.fromBytes32Hex(h));
        (0, decryptUtils_js_1.checkEncryptedBits)(handlesBytes32Hex);
        await MockFhevmInstance.verifyPublicACLPermissions(__classPrivateFieldGet(this, _MockFhevmInstance_readonlyEthersProvider, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"), handlesBytes32Hex);
        const payloadForRequest = {
            ciphertextHandles: handlesBytes32Hex,
            extraData,
        };
        const json = await relayer.requestRelayerV1PublicDecrypt(__classPrivateFieldGet(this, _MockFhevmInstance_relayerProvider, "f"), payloadForRequest);
        const result = json.response[0];
        const decryptedResult = (0, string_js_1.ensure0x)(result.decrypted_value);
        const kmsSignatures = result.signatures.map(string_js_1.ensure0x);
        const domain = {
            name: constants_js_1.default.PUBLIC_DECRYPT_EIP712.domain.name,
            version: constants_js_1.default.PUBLIC_DECRYPT_EIP712.domain.version,
            chainId: __classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f"),
            verifyingContract: __classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressDecryption, "f"),
        };
        const types = constants_js_1.default.PUBLIC_DECRYPT_EIP712.types;
        const signedExtraData = "0x00";
        const recoveredAddresses = kmsSignatures.map((signature) => {
            (0, error_js_1.assertFhevm)(signature.startsWith("0x"));
            const recoveredAddress = ethers_1.ethers.verifyTypedData(domain, types, { ctHandles: handles, decryptedResult, extraData: signedExtraData }, signature);
            return recoveredAddress;
        });
        const thresholdReached = (0, eip712_js_1.isThresholdReached)(__classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").getKmsSignersAddresses(), recoveredAddresses, __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").getThreshold(), "KMS");
        if (!thresholdReached) {
            throw Error("KMS signers threshold is not reached");
        }
        const clearValues = (0, publicDecrypt_js_1.deserializeClearValues)(fhevmHandles, decryptedResult);
        const abiEnc = KMSVerifier_js_1.KMSVerifier.abiEncodeClearValues(clearValues);
        const decryptionProof = KMSVerifier_js_1.KMSVerifier.buildDecryptionProof(kmsSignatures, signedExtraData);
        return { clearValues, abiEncodedClearValues: abiEnc.abiEncodedClearValues, decryptionProof };
    }
    async userDecrypt(handles, _privateKey, publicKey, signature, contractAddresses, userAddress, startTimestamp, durationDays) {
        const extraData = "0x00";
        for (let i = 0; i < handles.length; ++i) {
            (0, error_js_1.assertFhevm)(typeof handles[i].handle === "string" || handles[i].handle instanceof Uint8Array, "handle is not a string or a Uint8Array");
        }
        const relayerHandles = handles.map((h) => ({
            handle: typeof h.handle === "string" ? (0, hex_js_1.toHexString)((0, hex_js_1.fromHexString)(h.handle)) : (0, hex_js_1.toHexString)(h.handle),
            contractAddress: h.contractAddress,
        }));
        (0, decryptUtils_js_1.checkEncryptedBits)(relayerHandles.map((h) => h.handle));
        (0, userDecrypt_js_1.checkDeadlineValidity)(BigInt(startTimestamp), BigInt(durationDays));
        await MockFhevmInstance.verifyUserACLPermissions(__classPrivateFieldGet(this, _MockFhevmInstance_readonlyEthersProvider, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"), relayerHandles, userAddress);
        (0, userDecrypt_js_1.checkMaxContractAddresses)(contractAddresses);
        MockFhevmInstance.verifyHandleContractAddresses(relayerHandles, contractAddresses);
        await MockFhevmInstance.verifyUserDecryptSignature(publicKey, signature, contractAddresses, userAddress, startTimestamp, durationDays, __classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressDecryption, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f"));
        const payloadForRequest = {
            handleContractPairs: relayerHandles,
            requestValidity: {
                startTimestamp: startTimestamp.toString(),
                durationDays: durationDays.toString(),
            },
            contractsChainId: __classPrivateFieldGet(this, _MockFhevmInstance_chainId, "f").toString(),
            contractAddresses: contractAddresses.map((c) => ethers_1.ethers.getAddress(c)),
            userAddress: ethers_1.ethers.getAddress(userAddress),
            signature: (0, string_js_1.remove0x)(signature),
            publicKey: (0, string_js_1.remove0x)(publicKey),
            extraData,
        };
        const json = await relayer.requestRelayerV1UserDecrypt(__classPrivateFieldGet(this, _MockFhevmInstance_relayerProvider, "f"), payloadForRequest);
        const result = json.response[0];
        const clearTextHexList = result.payload.decrypted_values;
        const listBigIntDecryptions = clearTextHexList.map(ethers_1.ethers.toBigInt);
        const results = (0, userDecrypt_js_1.buildUserDecryptResults)(relayerHandles.map((h) => h.handle), listBigIntDecryptions);
        return results;
    }
    async delegatedUserDecrypt(handleContractPairs, _privateKey, publicKey, signature, contractAddresses, delegatorAddress, delegateAddress, startTimestamp, durationDays) {
        const extraData = "0x00";
        for (let i = 0; i < handleContractPairs.length; ++i) {
            (0, error_js_1.assertFhevm)(typeof handleContractPairs[i].handle === "string" || handleContractPairs[i].handle instanceof Uint8Array, "handle is not a string or a Uint8Array");
        }
        const relayerHandles = handleContractPairs.map((h) => ({
            handle: typeof h.handle === "string" ? (0, hex_js_1.toHexString)((0, hex_js_1.fromHexString)(h.handle)) : (0, hex_js_1.toHexString)(h.handle),
            contractAddress: h.contractAddress,
        }));
        (0, decryptUtils_js_1.checkEncryptedBits)(relayerHandles.map((h) => h.handle));
        (0, userDecrypt_js_1.checkDeadlineValidity)(BigInt(startTimestamp), BigInt(durationDays));
        await MockFhevmInstance.verifyUserACLPermissions(__classPrivateFieldGet(this, _MockFhevmInstance_readonlyEthersProvider, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"), relayerHandles, delegatorAddress);
        (0, userDecrypt_js_1.checkMaxContractAddresses)(contractAddresses);
        const payloadForRequest = {
            handleContractPairs: relayerHandles,
            contractsChainId: __classPrivateFieldGet(this, _MockFhevmInstance_chainId, "f").toString(),
            contractAddresses: contractAddresses.map((c) => ethers_1.ethers.getAddress(c)),
            delegatorAddress: ethers_1.ethers.getAddress(delegatorAddress),
            delegateAddress: ethers_1.ethers.getAddress(delegateAddress),
            requestValidity: {
                startTimestamp: startTimestamp.toString(),
                durationDays: durationDays.toString(),
            },
            signature: (0, string_js_1.remove0x)(signature),
            publicKey: (0, string_js_1.remove0x)(publicKey),
            extraData,
        };
        const json = await relayer.requestRelayerV1DelegatedUserDecrypt(__classPrivateFieldGet(this, _MockFhevmInstance_relayerProvider, "f"), payloadForRequest);
        const result = json.response[0];
        const clearTextHexList = result.payload.decrypted_values;
        const listBigIntDecryptions = clearTextHexList.map(ethers_1.ethers.toBigInt);
        const results = (0, userDecrypt_js_1.buildUserDecryptResults)(relayerHandles.map((h) => h.handle), listBigIntDecryptions);
        return results;
    }
    static async verifyUserDecryptSignature(publicKey, signature, contractAddresses, userAddress, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId) {
        publicKey = (0, string_js_1.ensure0x)(publicKey);
        signature = (0, string_js_1.ensure0x)(signature);
        const eip712 = MockFhevmInstance.createEIP712({
            publicKey,
            contractAddresses,
            startTimestamp,
            durationDays,
            verifyingContractAddressDecryption,
            contractsChainId,
            extraData: "0x00",
        });
        const types = {
            [eip712.primaryType]: eip712.types[eip712.primaryType],
        };
        const signerAddress = ethers_1.ethers.verifyTypedData(eip712.domain, types, eip712.message, signature);
        const normalizedSignerAddress = ethers_1.ethers.getAddress(signerAddress);
        const normalizedUserAddress = ethers_1.ethers.getAddress(userAddress);
        if (normalizedSignerAddress !== normalizedUserAddress) {
            throw new error_js_1.FhevmError("Invalid EIP-712 signature!");
        }
    }
    static async verifyDelegatedUserDecryptSignature({ publicKey, signature, contractAddresses, delegatorAddress, delegateAddress, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, }) {
        publicKey = (0, string_js_1.ensure0x)(publicKey);
        signature = (0, string_js_1.ensure0x)(signature);
        const eip712 = MockFhevmInstance.createDelegatedUserDecryptEIP712({
            publicKey,
            contractAddresses,
            delegatorAddress,
            startTimestamp,
            durationDays,
            verifyingContractAddressDecryption,
            contractsChainId,
            extraData: "0x00",
        });
        const types = {
            [eip712.primaryType]: eip712.types[eip712.primaryType],
        };
        const signerAddress = ethers_1.ethers.verifyTypedData(eip712.domain, types, eip712.message, signature);
        const normalizedSignerAddress = ethers_1.ethers.getAddress(signerAddress);
        const normalizedDelegateAddress = ethers_1.ethers.getAddress(delegateAddress);
        if (normalizedSignerAddress !== normalizedDelegateAddress) {
            throw new error_js_1.FhevmError("Invalid EIP-712 signature!");
        }
    }
    static async verifyPublicACLPermissions(readonlyEthersProvider, aclContractAddress, handles) {
        const aclABI = ["function isAllowedForDecryption(bytes32 handle) view returns (bool)"];
        const acl = new ethers_1.ethers.Contract(aclContractAddress, aclABI, readonlyEthersProvider);
        const verifications = handles.map(async (h) => {
            const ctHandleHex = ethers_1.ethers.toBeHex(ethers_1.ethers.toBigInt(h), 32);
            const allowed = await acl.isAllowedForDecryption(ctHandleHex);
            if (!allowed) {
                throw new error_js_1.FhevmError(`Handle ${h} is not allowed for public decryption!`);
            }
        });
        return Promise.all(verifications).catch((e) => {
            throw e;
        });
    }
    static async verifyUserACLPermissions(readonlyEthersProvider, aclContractAddress, handles, userAddress) {
        const aclABI = ["function persistAllowed(bytes32 handle, address account) view returns (bool)"];
        const acl = new ethers_1.ethers.Contract(aclContractAddress, aclABI, readonlyEthersProvider);
        const verifications = handles.map(async ({ handle, contractAddress }) => {
            const ctHandleHex = ethers_1.ethers.toBeHex(ethers_1.ethers.toBigInt(handle), 32);
            const userAllowed = await acl.persistAllowed(ctHandleHex, userAddress);
            const contractAllowed = await acl.persistAllowed(ctHandleHex, contractAddress);
            if (!userAllowed) {
                throw new error_js_1.FhevmError(`User ${userAddress} is not authorized to user decrypt handle ${handle}!`);
            }
            if (!contractAllowed) {
                throw new error_js_1.FhevmError(`dapp contract ${contractAddress} is not authorized to user decrypt handle ${handle}!`);
            }
            if (userAddress === contractAddress) {
                throw new error_js_1.FhevmError(`userAddress ${userAddress} should not be equal to contractAddress when requesting decryption!`);
            }
        });
        return Promise.all(verifications).catch((e) => {
            throw e;
        });
    }
    static async verifyUserDecryptionDelegation(readonlyEthersProvider, aclContractAddress, delegatorAddress, delegateAddress, handles) {
        const aclABI = [
            "function isHandleDelegatedForUserDecryption(address delegator, address delegate, address contractAddress, bytes32 handle) view returns (bool)",
        ];
        const acl = new ethers_1.ethers.Contract(aclContractAddress, aclABI, readonlyEthersProvider);
        const verifications = handles.map(async ({ handle, contractAddress }) => {
            const ctHandleHex = ethers_1.ethers.toBeHex(ethers_1.ethers.toBigInt(handle), 32);
            const isDelegated = await acl.isHandleDelegatedForUserDecryption(delegatorAddress, delegateAddress, contractAddress, ctHandleHex);
            if (!isDelegated) {
                throw new error_js_1.FhevmError(`Delegate ${delegateAddress} is not authorized to user decrypt handle ${handle} on behalf of ${delegatorAddress}!`);
            }
        });
        return Promise.all(verifications).catch((e) => {
            throw e;
        });
    }
    static verifyHandleContractAddresses(handles, contractAddresses) {
        const set = new Set();
        for (let i = 0; i < contractAddresses.length; ++i) {
            const add = contractAddresses[i].toLowerCase();
            if (!set.has(add)) {
                set.add(add);
            }
        }
        for (let i = 0; i < handles.length; ++i) {
            if (!set.has(handles[i].contractAddress.toLowerCase())) {
                throw new error_js_1.FhevmError(`Contract address ${handles[i].contractAddress} associated to handle ${handles[i].handle} is not listed in the contractAddresses array argument.`);
            }
        }
    }
}
exports.MockFhevmInstance = MockFhevmInstance;
_MockFhevmInstance_relayerProvider = new WeakMap(), _MockFhevmInstance_readonlyEthersProvider = new WeakMap(), _MockFhevmInstance_chainId = new WeakMap(), _MockFhevmInstance_gatewayChainId = new WeakMap(), _MockFhevmInstance_verifyingContractAddressInputVerification = new WeakMap(), _MockFhevmInstance_verifyingContractAddressDecryption = new WeakMap(), _MockFhevmInstance_contractsChainId = new WeakMap(), _MockFhevmInstance_aclContractAddress = new WeakMap(), _MockFhevmInstance_kmsVerifier = new WeakMap(), _MockFhevmInstance_inputVerifier = new WeakMap();
//# sourceMappingURL=MockFhevmInstance.js.map