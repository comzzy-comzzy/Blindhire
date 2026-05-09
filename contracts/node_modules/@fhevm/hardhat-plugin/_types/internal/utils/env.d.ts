export declare function getEnvUint({ name, defaultValue, dotEnvFile, }: {
    name: string;
    defaultValue?: number;
    dotEnvFile?: string | undefined;
}): number;
export declare function getEnvString({ name, defaultValue, dotEnvFile, }: {
    name: string;
    defaultValue?: string;
    dotEnvFile?: string | undefined;
}): string;
export declare function getOptionalEnvString(params: {
    name: string;
    defaultValue?: string;
    dotEnvFile?: string | undefined;
}): string | undefined;
export declare function getOptionalEnvUint(params: {
    name: string;
    defaultValue?: number;
    dotEnvFile?: string | undefined;
}): number | undefined;
//# sourceMappingURL=env.d.ts.map