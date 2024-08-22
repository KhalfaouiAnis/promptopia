import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(isConnected){
        console.log("Mongo BD is connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI,
            {
                dbName: "share_prompt",
            }            
        )

        isConnected = true;
        console.log("MONGODB connected");
        
    } catch (error) {
        console.log(error);
        
    }
}