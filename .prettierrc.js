/** @type {import('prettier').Config} */
module.exports = {
   singleQuote: true,
   bracketSameLine: true,
   tabWidth: 3,
   arrowParens: 'avoid',
   quoteProps: 'consistent',
   proseWrap: 'always',
   singleAttributePerLine: true,
   overrides: [
      {
         files: './src/migrations/**',
         options: {
            printWidth: null,
         },
      },
   ],
};
