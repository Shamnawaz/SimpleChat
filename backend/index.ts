import app from "./src/app";
import { connectDB } from "./src/config/database";

const PORT = Number(process.env.PORT);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('server is running on port:', PORT);
    })
})