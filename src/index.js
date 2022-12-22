import express from 'express';
import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoutes);



const Port = 5000;

app.listen(Port, () => console.log(`Server running in port ${Port}`));
