const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const { sql } = require("@vercel/postgres");
const path = require("path");
const fs = require("fs");
const render = require("koa-ejs");

const app = new Koa();
const router = new Router();

// Middleware for parsing request bodies
app.use(bodyParser());

// Middleware for serving static files
app.use(serve("public"));

// EJS template engine setup
render(app, {
  root: path.join(__dirname, "components"),
  layout: false,
  viewExt: "htm",
  cache: false,
  debug: true,
});

// Example endpoint to fetch members from the database
router.get("/members", async (ctx) => {
  try {
    const members = await sql`SELECT * FROM Members;`; // Replace with your actual table name
    ctx.body = members;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = "Error retrieving members";
  }
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});

module.exports = app;