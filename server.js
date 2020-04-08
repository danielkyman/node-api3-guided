const express = require("express"); // importing a CommonJS module
const morgan = require("morgan");
const hubsRouter = require("./hubs/hubs-router.js");
const helmet = require("helmet");

const server = express();

server.use(gateKeeper("password"));
server.use(logger);
server.use(helmet());
// server.use(morgan("dev"));

server.use(express.json());

server.use("/api/hubs", gateKeeper("password"), hubsRouter);
server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.use((error, req, res, next) => {
  res
    .status(400)
    .json({ error: "error handling middleware has been triggered" });
});

module.exports = server;

function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.originalUrl}`);
  next();
}
function gateKeeper(password) {
  return function (req, res, next) {
    const { pass } = req.query;

    if (pass !== password) {
      next("error");
    } else if (pass == password) {
      next();
    }
  };
}
