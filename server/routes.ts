import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tasks = await storage.getTasks(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const task = await storage.createTask({
      ...result.data,
      userId: req.user.id,
    });
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const task = await storage.getTask(Number(req.params.id));
    if (!task) return res.sendStatus(404);
    if (task.userId !== req.user.id) return res.sendStatus(403);

    const result = insertTaskSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const updatedTask = await storage.updateTask(task.id, result.data);
    res.json(updatedTask);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const task = await storage.getTask(Number(req.params.id));
    if (!task) return res.sendStatus(404);
    if (task.userId !== req.user.id) return res.sendStatus(403);

    await storage.deleteTask(task.id);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
