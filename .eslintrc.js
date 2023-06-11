/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
   root: true,
   parser: '@typescript-eslint/parser',
   plugins: ['@typescript-eslint'],
   rules: {
      '@typescript-eslint/ban-types': [
         'error',
         {
            types: {
               '{}': false,
            },
            extendDefaults: true,
         },
      ],
      '@typescript-eslint/no-unused-vars': [
         'error',
         {
            vars: 'all',
            args: 'none',
            ignoreRestSiblings: true,
         },
      ],
      '@typescript-eslint/no-explicit-any': [
         'error',
         { ignoreRestArgs: false },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
   },
   overrides: [
      {
         files: ['*.ts'],
         extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
         ],
         parserOptions: { project: ['./tsconfig.json'] },
      },
   ],
   ignorePatterns: ['*!.*', 'dist', 'build', 'node_modules'],
};
