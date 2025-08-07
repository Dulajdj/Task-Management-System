import mongoose from "mongoose";

   const taskSchema = new mongoose.Schema(
     {
       title: {
         type: String,
         required: [true, "Title is required"],
         trim: true,
       },
       description: {
         type: String,
         trim: true,
       },
       dueDate: {
         type: Date,
         required: [true, "Due date is required"],
       },
       priority: {
         type: String,
         enum: ["Low", "Medium", "High"],
         default: "Low",
       },
       status: {
         type: String,
         enum: ["Pending", "Completed"],
         default: "Pending",
       },
       user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
       },
     },
     { timestamps: true }
   );

   export default mongoose.model("Task", taskSchema);