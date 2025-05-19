require("dotenv").config({ path: "../.env" });

const MomoConfig = {
    partnerCode: 'MOMO_PARTNER_CODE', 
    accessKey: 'MOMO_ACCESS_KEY',      
    secretKey: 'MOMO_SECRET_KEY',      
    redirectUrl: 'http://your-website.com/redirect',  
    ipnUrl: 'http://your-website.com/ipn',
    endpoint: 'https://test-payment.momo.vn/gw_payment/transactionProcessor', 
  };
  
  module.exports = MomoConfig;
  