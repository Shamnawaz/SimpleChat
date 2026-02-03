import app from "./src/app";
import { connectDB } from "./src/config/database";
import { createServer } from  'http';
import { initializeSocket } from "./src/utils/socket";

const PORT = Number(process.env.PORT);

const httpServeer = createServer(app);

initializeSocket(httpServeer);

connectDB()
    .then(() => {
        httpServeer.listen(PORT, () => {
            console.log('server is running on port:', PORT);
    })
})
    .catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    })