import express from 'express';
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import urlRoutes from "./routes/urls.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(urlRoutes);



const Port = process.env.PORT || 5000;

app.listen(Port, () => console.log(`Server running in port ${Port}`));
