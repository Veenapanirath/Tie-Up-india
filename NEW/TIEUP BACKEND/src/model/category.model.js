import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image:{
      type: String,
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    sub_category: 
      [
        {
          name: {
            type: String
          }
        }
      ]
    
  },{timestamps:true}
);

export const Category = mongoose.model("Category", categorySchema);
