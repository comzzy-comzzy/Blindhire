"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeClearValues = deserializeClearValues;
const ethers_1 = require("ethers");
const CiphertextType = {
    0: "bool",
    2: "uint256",
    3: "uint256",
    4: "uint256",
    5: "uint256",
    6: "uint256",
    7: "address",
    8: "uint256",
};
function deserializeClearValues(orderedFhevmHandles, decryptedResult) {
    let fheTypeIdList = [];
    for (const fhevmHandle of orderedFhevmHandles) {
        fheTypeIdList.push(fhevmHandle.fhevmType);
    }
    const restoredEncoded = "0x" +
        "00".repeat(32) +
        decryptedResult.slice(2) +
        "00".repeat(32);
    const abiTypes = fheTypeIdList.map((t) => {
        const abiType = CiphertextType[t];
        return abiType;
    });
    const coder = new ethers_1.ethers.AbiCoder();
    const decoded = coder.decode(["uint256", ...abiTypes, "bytes[]"], restoredEncoded);
    const rawValues = decoded.slice(1, 1 + fheTypeIdList.length);
    const results = {};
    orderedFhevmHandles.forEach((fhevmHandle, idx) => (results[fhevmHandle.toHandleBytes32Hex()] = rawValues[idx]));
    return results;
}
//# sourceMappingURL=publicDecrypt.js.map