import mongoose from "mongoose"

const  subSchema = new mongoose.Schema({

    name:{
        type: String,
        require:  true,    
    },
    amount:{
        type: Number,
        require: true
    },
    days:{
        type: Number
    },
    description:{
        type: String
    },
    productlimit:{
        type:  Number
    }

},{timestamps : true})

export const Subscription =  mongoose.model("Subscription" , subSchema);