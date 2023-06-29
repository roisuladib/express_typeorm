import jwt, { SignOptions } from 'jsonwebtoken';
import { getConfig } from './config';
import { PrivateKey, PublicKey } from './../types';

/**
 * Signs a JWT token with the provided payload, private key, and options.
 *
 * @param payload - The payload to be included in the JWT.
 * @param keyName - The name of the private key to be used for signing the JWT.
 * @param options - Additional options for signing the JWT.
 * @returns The signed JWT token.
 */
export const signJwt = <T extends string | Buffer | object>(
   payload: T,
   keyName: PrivateKey,
   options: SignOptions
): string => {
   const privateKey = Buffer.from(
      getConfig<string>(keyName),
      'base64'
   ).toString('ascii');

   const encoded = jwt.sign(payload, privateKey, {
      ...(options && options),
      issuer: 'Anonymous',
      algorithm: 'RS256',
   });

   return encoded;
};

/**
 * Verifies the provided JWT token using the specified public key.
 *
 * @param token - The JWT token to be verified.
 * @param keyName - The name of the public key to be used for verifying the JWT.
 * @returns The decoded payload if the token is valid, or null if it is invalid.
 */
export const verifyJwt = <T>(token: string, keyName: PublicKey): T | null => {
   try {
      const publicKey = Buffer.from(
         getConfig<string>(keyName),
         'base64'
      ).toString('ascii');
      const decoded = jwt.verify(token, publicKey) as T;

      return decoded;
   } catch (error) {
      return null;
   }
};

// Versi class
/**
 * Service class for signing and verifying JWT tokens.
 * @example
 * const jwtService = new Jwt('privateKey', 'publicKey');
 *
 * const token = jwtService.signJwt({ userId: 123 }, { expiresIn: '1h' });
 * console.log('Signed JWT:', token);
 *
 * const decoded = jwtService.verifyJwt<{ userId: number }>(token);
 * console.log('Decoded payload:', decoded);
 */
export class Jwt {
   private privateKey: string;
   private publicKey: string;

   /**
    * Creates an instance of JwtService.
    * @param privateKey - The name of the private key for signing JWTs.
    * @param publicKey - The name of the public key for verifying JWTs.
    */
   constructor(privateKey: PrivateKey, publicKey: PublicKey) {
      this.privateKey = Buffer.from(
         getConfig<string>(privateKey),
         'base64'
      ).toString('ascii');
      this.publicKey = Buffer.from(
         getConfig<string>(publicKey),
         'base64'
      ).toString('ascii');
   }

   /**
    * Signs a JWT token with the provided payload and options.
    * @param payload - The payload to be included in the JWT.
    * @param options - Additional options for signing the JWT.
    * @returns The signed JWT token.
    */
   signJwt<T extends string | Buffer | object>(
      payload: T,
      options: SignOptions
   ): string {
      return jwt.sign(payload, this.privateKey, {
         ...(options && options),
         algorithm: 'RS256',
      });
   }

   /**
    * Verifies the provided JWT token using the configured public key.
    * @param token - The JWT token to be verified.
    * @returns The decoded payload if the token is valid, or null if it is invalid.
    */
   verifyJwt<T>(token: string): T | null {
      try {
         const decoded = jwt.verify(token, this.publicKey) as T;
         return decoded;
      } catch (error) {
         return null;
      }
   }
}
