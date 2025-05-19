require("dotenv").config({ path: "../.env" });

const { VNPay } = require("vnpay");

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE ,
  secureSecret: process.env.VNPAY_SECRET_KEY ,
  vnpayHost: process.env.VNPAY_PAY_URL ,
  testMode: true,
  hashAlgorithm: "SHA512",
});

module.exports = vnpay;
