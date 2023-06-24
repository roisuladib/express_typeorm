import nodemailer from 'nodemailer';

(async function () {
   const credentials = await nodemailer.createTestAccount();
   console.log(credentials);

   // res
   // {
   //    user: 'ece54yplzqo2hjkc@ethereal.email',
   //    pass: 'RMuDJpr7qTsgUfNQJW',
   //    smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
   //    imap: { host: 'imap.ethereal.email', port: 993, secure: true },
   //    pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
   //    web: 'https://ethereal.email'
   //  }
})();
