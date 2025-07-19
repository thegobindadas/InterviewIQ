import dotenv from "dotenv";
import express from "express";
import cors from "cors";


dotenv.config({ 
    path: "./.env"
});



const app = express();
const PORT = Number(process.env.PORT ?? 8000)



// Body parser middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));



// CORS middleware configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "device-remember-token",
            "Access-Control-Allow-Origin",
            "Origin",
            "Accept",
        ],
    })
);



// import routes
import interviewRoute from "./routes/interview.route.js";



// use routes
app.use("/interview", interviewRoute);

app.get("/", (_, res) => res.send("AI Mock Interview API"));





app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});