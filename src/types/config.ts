export type PrivateKey = 'accessTokenPrivateKey' | 'refreshTokenPrivateKey';

export type PublicKey = 'accessTokenPublicKey' | 'refreshTokenPublicKey';

export type ExpiresIn =
   | 'accessTokenExpiresIn'
   | 'refreshTokenExpiresIn'
   | 'redisCacheExpiresIn';

export type Config =
   | 'port'
   | 'postgresConfig'
   | PrivateKey
   | PublicKey
   | 'smtp'
   | 'origin'
   | ExpiresIn
   | 'emailFrom';
