import mongoose from "mongoose";

export const connectDb  = async () => {
    await mongoose.connect(process.env.MONGO_CONNECTION_URI!)
    .then((connectionInstance) => {console.log(`Mongo Connnected  ${connectionInstance.connection.host}`)})
    .catch((error) => {
        console.log(`error connecting db ${ error}`)
    })
}