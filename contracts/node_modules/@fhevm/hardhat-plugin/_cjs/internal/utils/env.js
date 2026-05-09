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
exports.getEnvUint = getEnvUint;
exports.getEnvString = getEnvString;
exports.getOptionalEnvString = getOptionalEnvString;
exports.getOptionalEnvUint = getOptionalEnvUint;
const debug_1 = __importDefault(require("debug"));
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const picocolors = __importStar(require("picocolors"));
const error_1 = require("../../error");
const debug = (0, debug_1.default)("@fhevm/hardhat:env");
function __logDefaultValue(name, defaultValue) {
    debug(`Resolve ${picocolors.magentaBright(name)}=${defaultValue}, using default value.`);
}
function __logEnvValue(name, value) {
    debug(`Resolve ${picocolors.yellowBright(name)}=${value}, using env variable ${name}.`);
}
function __logDotEnvValue(name, value, dotEnvFile) {
    debug(`Resolve ${picocolors.greenBright(name)}=${value}, using .env variable stored at ${path.resolve(dotEnvFile)}`);
}
function getEnvUint({ name, defaultValue, dotEnvFile, }) {
    let int = Number.NaN;
    try {
        const str = getEnvString({ name, ...(dotEnvFile ? { dotEnvFile: dotEnvFile } : {}) });
        int = parseInt(str);
    }
    catch {
        int = Number.NaN;
    }
    if (!Number.isNaN(int)) {
        return int;
    }
    if (defaultValue !== undefined) {
        __logDefaultValue(name, defaultValue);
        return defaultValue;
    }
    throw new error_1.HardhatFhevmError(`Unable to determine integer constant ${name}`);
}
function getEnvString({ name, defaultValue, dotEnvFile, }) {
    if (dotEnvFile !== undefined && fs.existsSync(dotEnvFile)) {
        const parsedEnv = dotenv.parse(fs.readFileSync(dotEnvFile));
        const addr = parsedEnv[name];
        if (addr) {
            __logDotEnvValue(name, addr, dotEnvFile);
            return addr;
        }
    }
    if (name in process.env && process.env[name] !== undefined) {
        const addr = process.env[name];
        __logEnvValue(name, addr);
        return addr;
    }
    if (defaultValue) {
        __logDefaultValue(name, defaultValue);
        return defaultValue;
    }
    throw new error_1.HardhatFhevmError(`Environment variable ${name} is undefined`);
}
function getOptionalEnvString(params) {
    try {
        return getEnvString(params);
    }
    catch {
        return undefined;
    }
}
function getOptionalEnvUint(params) {
    try {
        return getEnvUint(params);
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=env.js.map