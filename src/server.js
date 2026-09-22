const app = require('../api/index');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting local HTTP server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`AutoPulse Auth Backend running locally!`);
      console.log(`Port: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log(`Signup: POST http://localhost:${PORT}/api/auth/signup`);
      console.log(`Signin: POST http://localhost:${PORT}/api/auth/signin`);
      console.log(`========================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB on startup:', err.message);
    console.log('Starting server anyway for debugging/health check...');
    app.listen(PORT, () => {
      console.log(`Server running in limited mode on http://localhost:${PORT}`);
    });
  });
