import express from 'express';
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());



const Port = 5000;

app.listen(Port, () => console.log(`Server running in port ${Port}`));
