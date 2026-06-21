import dotenv from "dotenv";
import connectDb from "./db/index.js";
import {app} from "./app.js";
import { startCleanupScheduler } from "./utils/scheduler.js";
dotenv.config({path:"../.env"});

connectDb()
.then(() => {
 app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    
    // Start the cleanup scheduler
    startCleanupScheduler();
 })
})
.catch((error) => {
console.log(`Error: ${error}`);
})