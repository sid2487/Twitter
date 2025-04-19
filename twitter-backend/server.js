import dotenv from "dotenv";
import app from "./app/app.js";
import connectDB from "./app/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;  

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})