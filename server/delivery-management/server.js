import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./config/mongodb.js";
import swaggerDocs from "./config/swagger.js";
import deliveryBoy from "./routes/deliveryBoyRoute.js";
import adminRouter from "./routes/adminRoute.js";
import { connectQueue } from "./utils/messageQueue.js";
import itemRouter from "./routes/ItemRoute.js";
import http from 'http';
import { Server as socketIo } from 'socket.io'; // Correct import for ES module

const app = express();
const server = http.createServer(app);
const io = new socketIo(server); // Initialize with `new` keyword

// Middleware
app.use(express.json());
swaggerDocs(app);

connectDB();
connectQueue();

// Socket.IO connection setup
io.on('connection', (socket) => {
    console.log('A delivery person connected:', socket.id);

    socket.on('locationUpdate', (location) => {
        console.log('Received location update:', location);
        // Emit this location to all connected clients (for example, the admin or customer)
        io.emit('updateLocation', location);
    });

    socket.on('disconnect', () => {
        console.log('A delivery person disconnected:', socket.id);
    });
});

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"]; // Add your frontend origin

app.use(cors({ origin: allowedOrigins, credentials: true }));

// API endpoints
app.get("/", (req, res) => {
    res.send("Server is running properly");
});
app.use('/api/delivery', deliveryBoy);
app.use('/api/admin', adminRouter);
app.use('/api/deliver', itemRouter);

const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
