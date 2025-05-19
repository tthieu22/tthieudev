const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    count: {
      type: Number,
      required: true,
      min: 1,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },
    products: {
      type: [orderItemSchema],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPay", "Momo", "BankTransfer"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentDetails: {
      transactionId: String,
      payDate: Date,
      bankCode: String,
      responseCode: String,
    },
    orderStatus: {
      type: String,
      enum: [
        "Not Processed",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
        "Returned",
        "Completed",
        "Refunded",
        "Failed",
        "Pending",
        "Confirmed",
      ],
      default: "Not Processed",
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      district: String,
      postalCode: String,
      country: String,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAfterDiscount: {
      type: Number,
      min: 0,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
orderSchema.pre("save", function (next) {
  if (!this.orderCode) {
    const timestamp = Date.now().toString();  
    this.orderCode = `ORD${timestamp}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
