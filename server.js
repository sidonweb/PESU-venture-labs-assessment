import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import routes from './src/routes/userRoutes.js'
dotenv.config();


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Mongo connection error:", err));


app.use("/api/users", routes);

export default app;


// app.listen(PORT, (err) => {
//     if(err){
//         console.log(err)
//     } else {
//         console.log(`Server listeing on PORT ${PORT}`);
//     }
// })