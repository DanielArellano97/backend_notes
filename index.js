require('dotenv').config();
require('./mongo');

const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const express = require('express');
const app = express();
const cors = require('cors');
const notFound = require('./middleware/notFound.js');
const handleErrors = require('./middleware/handleErrors.js');
const usersRouter = require('./controllers/users');
const notesRouter = require('./controllers/notes');
const loginRouter = require('./controllers/login');

app.use(cors());
app.use(express.json());

Sentry.init({
  dsn: "https://f67a6e962ed040dd868cc4ad50c8b3ae@o1178157.ingest.sentry.io/6289067",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

let notes = [];

const generateId = () => {
  const ids = notes.map((note) => note.id);
  const maxId = ids.length ? Math.max(...ids) : 0;
  const newId = maxId + 1;
  return newId;
}

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.use('/api/notes', notesRouter);

app.use('/api/users', usersRouter);

app.use('/api/login', loginRouter);

app.use(notFound);

app.use(Sentry.Handlers.errorHandler());

app.use(handleErrors);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };