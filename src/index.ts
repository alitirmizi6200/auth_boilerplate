import { configDotenv } from "dotenv";
import { connectDb } from './config/index.db.js';
import { createApp } from './app.js';
configDotenv();

const startServer = async () => {
    try {
      // Wait for the MongoDB connection to establish
      await connectDb();
      console.log('MongoDB Connected Successfully');
  
      // Create and initialize the app only after DB connection
      const app = await createApp();
  
      // Start the server
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1); // Exit the process with failure
    }
  };


startServer();