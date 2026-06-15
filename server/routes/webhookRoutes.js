import express from "express";
import { Webhook } from "svix";
import User from "../models/User.js";

const router = express.Router();

router.post("/clerk", async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return res.status(500).json({ message: "Webhook secret not configured" });

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ message: "Missing svix headers" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(req.body, { "svix-id": svix_id, "svix-timestamp": svix_timestamp, "svix-signature": svix_signature });
  } catch (err) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const { type, data } = evt;

  switch (type) {
    case "user.created":
      await User.create({
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        imageUrl: data.image_url || "",
      });
      break;

    case "user.updated":
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          email: data.email_addresses[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        }
      );
      break;

    case "user.deleted":
      await User.findOneAndDelete({ clerkId: data.id });
      break;
  }

  res.json({ success: true });
});

export default router;
