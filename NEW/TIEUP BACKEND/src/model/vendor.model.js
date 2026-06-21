import mongoose, { Schema } from "mongoose";

const vendorSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

     firmType: { 
      type: String,
       default: "Select Firm Type"
       },

        companyAddress: { 
          type: String,
           default: "" },

    companyName: { type: String, trim: true, default: "" },
    companyAddress:
    {
      type: String,
      default:""
    },
    officialPhone: { type: String, trim: true, default: "" },
    officialMail: { type: String, trim: true, lowercase: true, default: "" },
    signupPerson: {
      designation: { type: String, default: "" },
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    category: { type: String, default: "" },
    products: { type: String, default: "" },
    numberOfProducts: { type: Number, default: 0 },
    annualIncome: { type: Number, default: 0 },
    companyDocuments: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    website: { type: String, default: "" },
    teamSize: { type: Number, default: 1 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Vendor = mongoose.model("Vendor", vendorSchema);
