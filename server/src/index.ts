import { Express } from "express";
import { Request, Response } from "express";

const port = 3001;
const express = require("express");
const app = express();

app.get('/', (req:Request, res:Response) => {
    res.send("Hello Saujanya");
})

app.listen(port, ()=> {
    console.log(`Server is running on port http://localhost:${port}`);
})

