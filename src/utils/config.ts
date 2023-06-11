import config, { IUtil } from 'config';
import { Config } from '../types';

/**
 * Get the value of a configuration setting.
 * @param setting - The name of the configuration setting.
 * @returns The value of the configuration setting.
 */
export function getConfig<T>(setting: Config): T {
   return config.get<T>(setting);
}

/**
 * Check if a configuration setting exists.
 * @param setting - The name of the configuration setting.
 * @returns A boolean indicating whether the configuration setting exists.
 */
export function hasConfig(setting: Config): boolean {
   return config.has(setting);
}

/**
 * Utility functions provided by the configuration module.
 */
export const utilConfig: IUtil = config.util;
