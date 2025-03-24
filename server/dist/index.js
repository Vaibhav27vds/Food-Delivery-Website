const port = 3001;
const express = require("express");
const app = express();
app.get('/', (req, res) => {
    res.send("Hello Saujanya");
});
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
export {};
