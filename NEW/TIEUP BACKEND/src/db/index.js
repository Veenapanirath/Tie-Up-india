import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const  connectDb =  async() => {
    try {
        // const db = await mongoose.connect(`${process.env.MONGO_DB_URl}/${DB_NAME}?authSource=admin`)

        const mongoUri = `${process.env.MONGO_DB_URl_local}/${DB_NAME}`;
        console.log(mongoUri);
        
        const db = await mongoose.connect(mongoUri);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.log(error)
        // throw new Error(error)
        process.exit(1)
        
    }
}

export default connectDb;