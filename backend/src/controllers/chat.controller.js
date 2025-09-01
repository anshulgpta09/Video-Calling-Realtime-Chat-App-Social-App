import { generateStreamToken, upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";

export async function getStreamToken(req, res) {
  try {
    // First, ensure the current user exists in Stream
    try {
      await upsertStreamUser({
        id: req.user.id,
        name: req.user.fullName,
        image: req.user.profilePic || "",
      });
      console.log(`Ensured Stream user exists for ${req.user.fullName}`);
    } catch (streamError) {
      console.error("Error ensuring Stream user exists:", streamError.message);
      // Continue anyway, as the user might already exist
    }

    const token = generateStreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Utility function to sync all users with Stream
export async function syncAllUsersWithStream(req, res) {
  try {
    const users = await User.find({});
    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        await upsertStreamUser({
          id: user._id.toString(),
          name: user.fullName,
          image: user.profilePic || "",
        });
        successCount++;
        console.log(`Synced user: ${user.fullName}`);
      } catch (error) {
        errorCount++;
        console.error(`Failed to sync user ${user.fullName}:`, error.message);
      }
    }

    res.status(200).json({
      message: `Sync completed. Success: ${successCount}, Errors: ${errorCount}`,
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("Error in syncAllUsersWithStream:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
