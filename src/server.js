const os = require('os');
const app = require('../api/index');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Function to find local network IPv4 address
const getNetworkIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

const networkIP = getNetworkIP();

// Connect to MongoDB before starting local HTTP server
connectDB()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`========================================`);
      console.log(`AutoPulse Auth Backend running!`);
      console.log(`Local:       http://localhost:${PORT}`);
      console.log(`Network IP:  http://${networkIP}:${PORT}`);
      console.log(`Emulator:    http://10.0.2.2:${PORT}`);
      console.log(`----------------------------------------`);
      console.log(`Health:      http://${networkIP}:${PORT}/api/health`);
      console.log(`Signup: POST http://${networkIP}:${PORT}/api/auth/signup`);
      console.log(`Signin: POST http://${networkIP}:${PORT}/api/auth/signin`);
      console.log(`Logout: POST http://${networkIP}:${PORT}/api/auth/logout`);
      console.log(`========================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB on startup:', err.message);
    console.log('Starting server anyway for debugging/health check...');
    app.listen(PORT, HOST, () => {
      console.log(`Server running in limited mode on http://${networkIP}:${PORT}`);
    });
  });
