import { upsertStreamUser } from "./src/lib/stream.js";
import User from "./src/models/User.js";
import { connectDB } from "./src/lib/db.js";
import dotenv from "dotenv";

dotenv.config();

async function syncAllUsers() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const users = await User.find({});
    console.log(`Found ${users.length} users to sync`);

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
        console.log(`✅ Synced user: ${user.fullName} (${user._id})`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to sync user ${user.fullName} (${user._id}):`, error.message);
      }
    }

    console.log(`\n🎉 Sync completed!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error in sync script:", error);
    process.exit(1);
  }
}

syncAllUsers();
