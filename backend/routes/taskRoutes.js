import express from "express";
   import Task from "../models/Task.js";
   import jwt from "jsonwebtoken";
   import { body, query, validationResult } from "express-validator";

   const router = express.Router();

   // Middleware to verify JWT
   const authMiddleware = (req, res, next) => {
     const token = req.header("Authorization")?.replace("Bearer ", "");
     if (!token) {
       return res.status(401).json({ message: "No token provided" });
     }
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (err) {
       res.status(401).json({ message: "Invalid token" });
     }
   };

   // Create Task
   router.post(
     "/",
     authMiddleware,
     [
       body("title").notEmpty().withMessage("Title is required"),
       body("dueDate").isDate().withMessage("Valid due date is required"),
       body("priority").isIn(["Low", "Medium", "High"]).withMessage("Invalid priority"),
     ],
     async (req, res) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }

       const { title, description, dueDate, priority } = req.body;

       try {
         const task = await Task.create({
           title,
           description,
           dueDate,
           priority,
           user: req.user.id,
         });
         res.status(201).json({ message: "Task created", task });
       } catch (err) {
         res.status(500).json({ message: "Server error" });
       }
     }
   );

   // Get All Tasks (with pagination, search, and filter)
   router.get(
     "/",
     authMiddleware,
     [
       query("page").optional().isInt({ min: 1 }).toInt(),
       query("limit").optional().isInt({ min: 1 }).toInt(),
       query("priority").optional().isIn(["Low", "Medium", "High"]),
       query("status").optional().isIn(["Pending", "Completed"]),
       query("search").optional().trim(),
       query("sort").optional().isIn(["dueDate", "priority", "-dueDate", "-priority"]),
     ],
     async (req, res) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }

       const { page = 1, limit = 10, priority, status, search, sort } = req.query;
       const query = { user: req.user.id };
       if (priority) query.priority = priority;
       if (status) query.status = status;
       if (search) query.title = { $regex: search, $options: "i" };

       const sortOptions = sort ? { [sort.replace("-", "")]: sort.startsWith("-") ? -1 : 1 } : {};

       try {
         const tasks = await Task.find(query)
           .sort(sortOptions)
           .skip((page - 1) * limit)
           .limit(limit);
         const total = await Task.countDocuments(query);
         res.status(200).json({ tasks, total, page, limit });
       } catch (err) {
         res.status(500).json({ message: "Server error" });
       }
     }
   );

   // Get Single Task
   router.get("/:id", authMiddleware, async (req, res) => {
     try {
       const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
       if (!task) {
         return res.status(404).json({ message: "Task not found" });
       }
       res.status(200).json(task);
     } catch (err) {
       res.status(500).json({ message: "Server error" });
     }
   });

   // Update Task
   router.put(
     "/:id",
     authMiddleware,
     [
       body("title").optional().notEmpty().withMessage("Title cannot be empty"),
       body("dueDate").optional().isDate().withMessage("Valid due date is required"),
       body("priority").optional().isIn(["Low", "Medium", "High"]).withMessage("Invalid priority"),
       body("status").optional().isIn(["Pending", "Completed"]).withMessage("Invalid status"),
     ],
     async (req, res) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }

       try {
         const task = await Task.findOneAndUpdate(
           { _id: req.params.id, user: req.user.id },
           { $set: req.body },
           { new: true }
         );
         if (!task) {
           return res.status(404).json({ message: "Task not found" });
         }
         res.status(200).json({ message: "Task updated", task });
       } catch (err) {
         res.status(500).json({ message: "Server error" });
       }
     }
   );

   // Delete Task
   router.delete("/:id", authMiddleware, async (req, res) => {
     try {
       const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
       if (!task) {
         return res.status(404).json({ message: "Task not found" });
       }
       res.status(200).json({ message: "Task deleted" });
     } catch (err) {
       res.status(500).json({ message: "Server error" });
     }
   });

   export default router;