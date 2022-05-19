const http = require("http");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = require("./src/app");
const port = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port, () => console.log(`Server is listening on port ${port}`));
