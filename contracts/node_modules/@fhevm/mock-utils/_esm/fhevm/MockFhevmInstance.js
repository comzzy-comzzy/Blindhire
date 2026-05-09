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
import { KmsEIP712, TKMSPkeKeypair } from "@zama-fhe/relayer-sdk/node";
import { ethers as EthersT } from "ethers";
import constants from "../constants.js";
import { isThresholdReached } from "../ethers/eip712.js";
import { checkEncryptedBits } from "../relayer-sdk/relayer/decryptUtils.js";
import { deserializeClearValues } from "../relayer-sdk/relayer/publicDecrypt.js";
import { buildUserDecryptResults, checkDeadlineValidity, checkMaxContractAddresses, } from "../relayer-sdk/relayer/userDecrypt.js";
import { assertIsAddress, assertIsAddressArray } from "../utils/address.js";
import { FhevmError, assertFhevm } from "../utils/error.js";
import { fromHexString, toHexString } from "../utils/hex.js";
import { assertIsNumber } from "../utils/math.js";
import { ensure0x, remove0x } from "../utils/string.js";
import { FhevmHandle } from "./FhevmHandle.js";
import { MockRelayerEncryptedInput } from "./MockRelayerEncryptedInput.js";
import { InputVerifier } from "./contracts/InputVerifier.js";
import { KMSVerifier } from "./contracts/KMSVerifier.js";
import * as relayer from "./relayer/MockRelayer.js";
/*
  Only one instance is created for the whole HH session (including tests)
*/
export class MockFhevmInstance {
    constructor(config, extra) {
        _MockFhevmInstance_relayerProvider.set(this, void 0);
        _MockFhevmInstance_readonlyEthersProvider.set(this, void 0);
        _MockFhevmInstance_chainId.set(this, void 0); //provider's chainId
        _MockFhevmInstance_gatewayChainId.set(this, void 0);
        _MockFhevmInstance_verifyingContractAddressInputVerification.set(this, void 0);
        _MockFhevmInstance_verifyingContractAddressDecryption.set(this, void 0);
        _MockFhevmInstance_contractsChainId.set(this, void 0);
        _MockFhevmInstance_aclContractAddress.set(this, void 0);
        _MockFhevmInstance_kmsVerifier.set(this, void 0);
        _MockFhevmInstance_inputVerifier.set(this, void 0);
        assertIsAddress(config.verifyingContractAddressInputVerification, "config.verifyingContractAddressInputVerification");
        assertIsAddress(config.verifyingContractAddressDecryption, "config.verifyingContractAddressDecryption");
        assertIsNumber(config.gatewayChainId, "config.gatewayChainId");
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
        const kmsVerifier = await KMSVerifier.create(readonlyEthersProvider, config.kmsContractAddress, undefined, properties.kmsVerifierProperties);
        const inputVerifier = await InputVerifier.create(readonlyEthersProvider, config.inputVerifierContractAddress, undefined, properties.inputVerifierProperties);
        const instance = new MockFhevmInstance(config, {
            relayerProvider,
            readonlyEthersProvider,
            inputVerifier,
            kmsVerifier,
        });
        return instance;
    }
    static createEIP712({ publicKey, contractAddresses, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, extraData, }) {
        assertIsAddressArray(contractAddresses, "contractAddresses");
        const k = new KmsEIP712({ chainId: BigInt(contractsChainId), verifyingContractAddressDecryption });
        const eip712 = k.createUserDecryptEIP712({
            publicKey,
            contractAddresses,
            startTimestamp,
            durationDays,
            extraData,
        });
        //Debug Make sure we are in sync with KMSVerifier.sol
        assertFhevm(eip712.domain.version === constants.PUBLIC_DECRYPT_EIP712.domain.version.toString());
        assertFhevm(eip712.domain.name === constants.PUBLIC_DECRYPT_EIP712.domain.name);
        return eip712;
    }
    static createDelegatedUserDecryptEIP712({ publicKey, contractAddresses, delegatorAddress, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, extraData, }) {
        assertIsAddressArray(contractAddresses, "contractAddresses");
        const k = new KmsEIP712({ chainId: BigInt(contractsChainId), verifyingContractAddressDecryption });
        const eip712 = k.createDelegatedUserDecryptEIP712({
            publicKey,
            contractAddresses,
            startTimestamp,
            durationDays,
            extraData,
            delegatorAddress,
        });
        //Debug Make sure we are in sync with KMSVerifier.sol
        assertFhevm(eip712.domain.version === constants.PUBLIC_DECRYPT_EIP712.domain.version.toString());
        assertFhevm(eip712.domain.name === constants.PUBLIC_DECRYPT_EIP712.domain.name);
        return eip712;
    }
    // Create EIP712 for decryption
    createEIP712(publicKey, contractAddresses, startTimestamp, durationDays) {
        assertIsAddressArray(contractAddresses, "contractAddresses");
        const eip712 = MockFhevmInstance.createEIP712({
            publicKey,
            contractAddresses,
            startTimestamp,
            durationDays,
            contractsChainId: __classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f"),
            verifyingContractAddressDecryption: __classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressDecryption, "f"),
            extraData: "0x00",
        });
        //Debug Make sure we are in sync with KMSVerifier.sol
        assertFhevm(BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f")) === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.chainId);
        assertFhevm(eip712.domain.verifyingContract === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.verifyingContract);
        assertFhevm(eip712.domain.version === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.version);
        assertFhevm(eip712.domain.name === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.name);
        assertFhevm(BigInt(eip712.domain.chainId) === BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f")));
        return eip712;
    }
    createDelegatedUserDecryptEIP712(publicKey, contractAddresses, delegatorAddress, startTimestamp, durationDays) {
        assertIsAddressArray(contractAddresses, "contractAddresses");
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
        //Debug Make sure we are in sync with KMSVerifier.sol
        assertFhevm(BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f")) === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.chainId);
        assertFhevm(eip712.domain.verifyingContract === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.verifyingContract);
        assertFhevm(eip712.domain.version === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.version);
        assertFhevm(eip712.domain.name === __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").eip712Domain.name);
        assertFhevm(BigInt(eip712.domain.chainId) === BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f")));
        return eip712;
    }
    async requestZKProofVerification(_zkProof, _options) {
        throw new FhevmError("Not Implemented in Mock mode");
    }
    createEncryptedInput(contractAddress, userAddress) {
        //Debug Make sure we are in sync with InputVerifier.sol
        assertFhevm(__classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressInputVerification, "f") === __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f").eip712Domain.verifyingContract);
        assertFhevm(BigInt(__classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f")) === __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f").eip712Domain.chainId);
        return new MockRelayerEncryptedInput(__classPrivateFieldGet(this, _MockFhevmInstance_relayerProvider, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_chainId, "f"), contractAddress, userAddress, __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_inputVerifier, "f"));
    }
    generateKeypair() {
        return TKMSPkeKeypair.generate().toBytesHexNo0x();
    }
    getPublicKey() {
        throw new FhevmError("Not supported in mock mode");
    }
    getPublicParams(_bits) {
        throw new FhevmError("Not supported in mock mode");
    }
    async publicDecrypt(handles) {
        const extraData = "0x00";
        // Intercept future type change...
        for (let i = 0; i < handles.length; ++i) {
            assertFhevm(typeof handles[i] === "string" || handles[i] instanceof Uint8Array, "handle is not a string or a Uint8Array");
        }
        // Casting handles if string
        const handlesBytes32Hex = handles.map((h) => typeof h === "string" ? toHexString(fromHexString(h)) : toHexString(h));
        const fhevmHandles = handlesBytes32Hex.map((h) => FhevmHandle.fromBytes32Hex(h));
        // relayer-sdk
        checkEncryptedBits(handlesBytes32Hex);
        await MockFhevmInstance.verifyPublicACLPermissions(__classPrivateFieldGet(this, _MockFhevmInstance_readonlyEthersProvider, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"), handlesBytes32Hex);
        // relayer-sdk
        const payloadForRequest = {
            ciphertextHandles: handlesBytes32Hex,
            extraData,
        };
        // Return a json object basically following the @zama-fhe/relayer-sdk format
        const json = await relayer.requestRelayerV1PublicDecrypt(__classPrivateFieldGet(this, _MockFhevmInstance_relayerProvider, "f"), payloadForRequest);
        const result = json.response[0];
        // Add "0x" prefix if needed
        const decryptedResult = ensure0x(result.decrypted_value);
        const kmsSignatures = result.signatures.map(ensure0x);
        // verify signatures on decryption:
        const domain = {
            name: constants.PUBLIC_DECRYPT_EIP712.domain.name,
            version: constants.PUBLIC_DECRYPT_EIP712.domain.version,
            chainId: __classPrivateFieldGet(this, _MockFhevmInstance_gatewayChainId, "f"),
            verifyingContract: __classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressDecryption, "f"),
        };
        const types = constants.PUBLIC_DECRYPT_EIP712.types;
        // The `signedExtraData` variable is following the @zama-fhe/relayer-sdk implementation
        // TODO: in relayer-sdk, signedExtraData === "0x". However, here, we use "0x00".
        const signedExtraData = "0x00";
        const recoveredAddresses = kmsSignatures.map((signature) => {
            assertFhevm(signature.startsWith("0x"));
            const recoveredAddress = EthersT.verifyTypedData(domain, types, { ctHandles: handles, decryptedResult, extraData: signedExtraData }, signature);
            return recoveredAddress;
        });
        const thresholdReached = isThresholdReached(__classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").getKmsSignersAddresses(), recoveredAddresses, __classPrivateFieldGet(this, _MockFhevmInstance_kmsVerifier, "f").getThreshold(), "KMS");
        if (!thresholdReached) {
            throw Error("KMS signers threshold is not reached");
        }
        const clearValues = deserializeClearValues(fhevmHandles, decryptedResult);
        const abiEnc = KMSVerifier.abiEncodeClearValues(clearValues);
        const decryptionProof = KMSVerifier.buildDecryptionProof(kmsSignatures, signedExtraData);
        return { clearValues, abiEncodedClearValues: abiEnc.abiEncodedClearValues, decryptionProof };
    }
    //////////////////////////////////////////////////////////////////////////////
    async userDecrypt(handles, _privateKey, publicKey, signature, contractAddresses, userAddress, startTimestamp, durationDays) {
        const extraData = "0x00";
        // Intercept future type change...
        for (let i = 0; i < handles.length; ++i) {
            assertFhevm(typeof handles[i].handle === "string" || handles[i].handle instanceof Uint8Array, "handle is not a string or a Uint8Array");
        }
        // Casting handles if string
        const relayerHandles = handles.map((h) => ({
            handle: typeof h.handle === "string" ? toHexString(fromHexString(h.handle)) : toHexString(h.handle),
            contractAddress: h.contractAddress,
        }));
        // relayer-sdk
        checkEncryptedBits(relayerHandles.map((h) => h.handle));
        // relayer-sdk
        checkDeadlineValidity(BigInt(startTimestamp), BigInt(durationDays));
        await MockFhevmInstance.verifyUserACLPermissions(__classPrivateFieldGet(this, _MockFhevmInstance_readonlyEthersProvider, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"), relayerHandles, userAddress);
        // relayer-sdk
        checkMaxContractAddresses(contractAddresses);
        MockFhevmInstance.verifyHandleContractAddresses(relayerHandles, contractAddresses);
        // Redundant: the mock relayer already performs this check, so it could be removed
        await MockFhevmInstance.verifyUserDecryptSignature(publicKey, signature, contractAddresses, userAddress, startTimestamp, durationDays, __classPrivateFieldGet(this, _MockFhevmInstance_verifyingContractAddressDecryption, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_contractsChainId, "f"));
        // relayer-sdk
        const payloadForRequest = {
            handleContractPairs: relayerHandles,
            requestValidity: {
                startTimestamp: startTimestamp.toString(), // Convert to string
                durationDays: durationDays.toString(), // Convert to string
            },
            contractsChainId: __classPrivateFieldGet(this, _MockFhevmInstance_chainId, "f").toString(), // Convert to string
            contractAddresses: contractAddresses.map((c) => EthersT.getAddress(c)),
            userAddress: EthersT.getAddress(userAddress),
            signature: remove0x(signature),
            publicKey: remove0x(publicKey),
            extraData,
        };
        // Return a json object basically following the @zama-fhe/relayer-sdk format
        const json = await relayer.requestRelayerV1UserDecrypt(__classPrivateFieldGet(this, _MockFhevmInstance_relayerProvider, "f"), payloadForRequest);
        const result = json.response[0];
        // The `decrypted_values` field is specific to the mock relayer.
        const clearTextHexList = result.payload.decrypted_values;
        const listBigIntDecryptions = clearTextHexList.map(EthersT.toBigInt);
        const results = buildUserDecryptResults(relayerHandles.map((h) => h.handle), listBigIntDecryptions);
        return results;
    }
    async delegatedUserDecrypt(handleContractPairs, _privateKey, publicKey, signature, contractAddresses, delegatorAddress, delegateAddress, startTimestamp, durationDays) {
        const extraData = "0x00";
        // Intercept future type change...
        for (let i = 0; i < handleContractPairs.length; ++i) {
            assertFhevm(typeof handleContractPairs[i].handle === "string" || handleContractPairs[i].handle instanceof Uint8Array, "handle is not a string or a Uint8Array");
        }
        // Casting handles if string
        const relayerHandles = handleContractPairs.map((h) => ({
            handle: typeof h.handle === "string" ? toHexString(fromHexString(h.handle)) : toHexString(h.handle),
            contractAddress: h.contractAddress,
        }));
        // relayer-sdk
        checkEncryptedBits(relayerHandles.map((h) => h.handle));
        // relayer-sdk
        checkDeadlineValidity(BigInt(startTimestamp), BigInt(durationDays));
        await MockFhevmInstance.verifyUserACLPermissions(__classPrivateFieldGet(this, _MockFhevmInstance_readonlyEthersProvider, "f"), __classPrivateFieldGet(this, _MockFhevmInstance_aclContractAddress, "f"), relayerHandles, delegatorAddress);
        // relayer-sdk
        checkMaxContractAddresses(contractAddresses);
        // relayer-sdk
        const payloadForRequest = {
            handleContractPairs: relayerHandles,
            contractsChainId: __classPrivateFieldGet(this, _MockFhevmInstance_chainId, "f").toString(), // Convert to string
            contractAddresses: contractAddresses.map((c) => EthersT.getAddress(c)),
            delegatorAddress: EthersT.getAddress(delegatorAddress),
            delegateAddress: EthersT.getAddress(delegateAddress),
            requestValidity: {
                startTimestamp: startTimestamp.toString(),
                durationDays: durationDays.toString(),
            },
            signature: remove0x(signature),
            publicKey: remove0x(publicKey),
            extraData,
        };
        // Return a json object basically following the @zama-fhe/relayer-sdk format
        const json = await relayer.requestRelayerV1DelegatedUserDecrypt(__classPrivateFieldGet(this, _MockFhevmInstance_relayerProvider, "f"), payloadForRequest);
        const result = json.response[0];
        // The `decrypted_values` field is specific to the mock relayer.
        const clearTextHexList = result.payload.decrypted_values;
        const listBigIntDecryptions = clearTextHexList.map(EthersT.toBigInt);
        const results = buildUserDecryptResults(relayerHandles.map((h) => h.handle), listBigIntDecryptions);
        return results;
    }
    //////////////////////////////////////////////////////////////////////////////
    // Static function called by:
    // - MockFhevmInstance.userDecrypt()
    // - packages/hardhat-plugin/src/internal/provider/FhevmProviderExtender._handleFhevmRelayerV1UserDecrypt()
    static async verifyUserDecryptSignature(publicKey, signature, contractAddresses, userAddress, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId) {
        publicKey = ensure0x(publicKey);
        signature = ensure0x(signature);
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
        const signerAddress = EthersT.verifyTypedData(eip712.domain, types, eip712.message, signature);
        const normalizedSignerAddress = EthersT.getAddress(signerAddress);
        const normalizedUserAddress = EthersT.getAddress(userAddress);
        if (normalizedSignerAddress !== normalizedUserAddress) {
            throw new FhevmError("Invalid EIP-712 signature!");
        }
    }
    static async verifyDelegatedUserDecryptSignature({ publicKey, signature, contractAddresses, delegatorAddress, delegateAddress, startTimestamp, durationDays, verifyingContractAddressDecryption, contractsChainId, }) {
        publicKey = ensure0x(publicKey);
        signature = ensure0x(signature);
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
        const signerAddress = EthersT.verifyTypedData(eip712.domain, types, eip712.message, signature);
        const normalizedSignerAddress = EthersT.getAddress(signerAddress);
        const normalizedDelegateAddress = EthersT.getAddress(delegateAddress);
        if (normalizedSignerAddress !== normalizedDelegateAddress) {
            throw new FhevmError("Invalid EIP-712 signature!");
        }
    }
    //////////////////////////////////////////////////////////////////////////////
    static async verifyPublicACLPermissions(readonlyEthersProvider, aclContractAddress, handles) {
        const aclABI = ["function isAllowedForDecryption(bytes32 handle) view returns (bool)"];
        const acl = new EthersT.Contract(aclContractAddress, aclABI, readonlyEthersProvider);
        const verifications = handles.map(async (h) => {
            const ctHandleHex = EthersT.toBeHex(EthersT.toBigInt(h), 32);
            const allowed = await acl.isAllowedForDecryption(ctHandleHex);
            if (!allowed) {
                throw new FhevmError(`Handle ${h} is not allowed for public decryption!`);
            }
        });
        return Promise.all(verifications).catch((e) => {
            throw e;
        });
    }
    //////////////////////////////////////////////////////////////////////////////
    // (Duplicated code) Should be imported from @zama-fhe/relayer-sdk
    static async verifyUserACLPermissions(readonlyEthersProvider, aclContractAddress, handles, userAddress) {
        const aclABI = ["function persistAllowed(bytes32 handle, address account) view returns (bool)"];
        const acl = new EthersT.Contract(aclContractAddress, aclABI, readonlyEthersProvider);
        const verifications = handles.map(async ({ handle, contractAddress }) => {
            const ctHandleHex = EthersT.toBeHex(EthersT.toBigInt(handle), 32);
            const userAllowed = await acl.persistAllowed(ctHandleHex, userAddress);
            const contractAllowed = await acl.persistAllowed(ctHandleHex, contractAddress);
            if (!userAllowed) {
                throw new FhevmError(`User ${userAddress} is not authorized to user decrypt handle ${handle}!`);
            }
            if (!contractAllowed) {
                throw new FhevmError(`dapp contract ${contractAddress} is not authorized to user decrypt handle ${handle}!`);
            }
            if (userAddress === contractAddress) {
                throw new FhevmError(`userAddress ${userAddress} should not be equal to contractAddress when requesting decryption!`);
            }
        });
        return Promise.all(verifications).catch((e) => {
            throw e;
        });
    }
    //////////////////////////////////////////////////////////////////////////////
    static async verifyUserDecryptionDelegation(readonlyEthersProvider, aclContractAddress, delegatorAddress, delegateAddress, handles) {
        const aclABI = [
            "function isHandleDelegatedForUserDecryption(address delegator, address delegate, address contractAddress, bytes32 handle) view returns (bool)",
        ];
        const acl = new EthersT.Contract(aclContractAddress, aclABI, readonlyEthersProvider);
        const verifications = handles.map(async ({ handle, contractAddress }) => {
            const ctHandleHex = EthersT.toBeHex(EthersT.toBigInt(handle), 32);
            const isDelegated = await acl.isHandleDelegatedForUserDecryption(delegatorAddress, delegateAddress, contractAddress, ctHandleHex);
            if (!isDelegated) {
                throw new FhevmError(`Delegate ${delegateAddress} is not authorized to user decrypt handle ${handle} on behalf of ${delegatorAddress}!`);
            }
        });
        return Promise.all(verifications).catch((e) => {
            throw e;
        });
    }
    //////////////////////////////////////////////////////////////////////////////
    static verifyHandleContractAddresses(handles, contractAddresses) {
        const set = new Set();
        // Build a list of unique allowed contact addresses.
        for (let i = 0; i < contractAddresses.length; ++i) {
            const add = contractAddresses[i].toLowerCase();
            if (!set.has(add)) {
                set.add(add);
            }
        }
        // Check that every handle contract (in HandleContractPair) is actually listed in the contractAddresses argument.
        for (let i = 0; i < handles.length; ++i) {
            if (!set.has(handles[i].contractAddress.toLowerCase())) {
                throw new FhevmError(`Contract address ${handles[i].contractAddress} associated to handle ${handles[i].handle} is not listed in the contractAddresses array argument.`);
            }
        }
    }
}
_MockFhevmInstance_relayerProvider = new WeakMap(), _MockFhevmInstance_readonlyEthersProvider = new WeakMap(), _MockFhevmInstance_chainId = new WeakMap(), _MockFhevmInstance_gatewayChainId = new WeakMap(), _MockFhevmInstance_verifyingContractAddressInputVerification = new WeakMap(), _MockFhevmInstance_verifyingContractAddressDecryption = new WeakMap(), _MockFhevmInstance_contractsChainId = new WeakMap(), _MockFhevmInstance_aclContractAddress = new WeakMap(), _MockFhevmInstance_kmsVerifier = new WeakMap(), _MockFhevmInstance_inputVerifier = new WeakMap();
//# sourceMappingURL=MockFhevmInstance.js.map