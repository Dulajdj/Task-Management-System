import express from "express";
   import dotenv from "dotenv";
   import cors from "cors";
   import { connectDB } from "./config/db.js";
   import userRoutes from "./routes/userRoutes.js";
   import taskRoutes from "./routes/taskRoutes.js";

   dotenv.config();

   const PORT = process.env.PORT || 5000;

   const app = express();
   app.use(cors());
   app.use(express.json());

   app.get("/", (req, res) => {
     res.send("Task Manager API");
   });

   app.use("/api/users", userRoutes);
   app.use("/api/tasks", taskRoutes);

   connectDB();

   app.listen(PORT, () => {
     console.log(`Server is ready at port ${PORT}`);
   });