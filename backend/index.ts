import app from "./src/app";
import { connectDB } from "./src/config/database";

const PORT = process.env.PORT

connectDB().then(() => {
    app.listen(PORT || 3000, () => {
        console.log('server is running on port:', PORT);
    })
})