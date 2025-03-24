import  Express  from "express";
import { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";


import userClerkRoute from "./routes/userClerkRoute.ts";
const port = 3001;
const app = Express();

app.use(bodyParser.json());
app.get('/', (req:Request, res:Response) => {
    res.send("Hello Saujanya");
})

app.use("/api/clerk", userClerkRoute )

app.listen(port, ()=> {
    console.log(`Server is running on port http://localhost:${port}`);
})

