// import { clerkClient } from "@clerk/clerk-sdk-node";

// export const requireAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const session = await clerkClient.sessions.verifySession(token, token);
//     req.userId = session.userId;
//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
//   }
// };

export const requireAuth = async (req, res, next) => {
  try {
    console.log("AUTH BYPASS ACTIVE");

    req.userId = "debug-user";

    next();
  } catch (error) {
    console.error("Auth Error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};