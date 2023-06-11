import jwt, { SignOptions } from 'jsonwebtoken';
import { getConfig } from './config';
import { PrivateKey, PublicKey } from './../types';

export const signJwt = <T extends object>(
   payload: T,
   keyName: PrivateKey,
   options: SignOptions
) => {
   const privateKey = Buffer.from(
      getConfig<string>(keyName),
      'base64'
   ).toString('ascii');
   return jwt.sign(payload, privateKey, {
      ...(options && options),
      algorithm: 'RS256',
   });
};

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
