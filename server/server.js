require("dotenv").config();
require('./db/mongoose');
const express = require("express");
const jsonParser = express.json();
const request = require("request");
const RateLimit = require('express-rate-limit');
const apicache = require('apicache');
const cors = require("cors");
const cache = apicache.middleware;
const usersRouter = require('./routers/users');
const tierListRouter = require('./routers/tierList');

const { config, logPort, routes, assignKey, puuidsArr } = require("./config/config");

const app = express();

const limiter = RateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

// Set default cache options
apicache.options({
  statusCodes: {
    exclude: [404, 429, 500],
    include: [200, 304]
  }
});

const middleware = [
  cors(),
  limiter,
  jsonParser,
  usersRouter,
  tierListRouter
]

app.use(middleware);

const requestHandler = async (req, res) => {
  const { region } = req.query || 'na1';
  const options = Object.assign({}, req.query, req.params);
  const path = req.route.path;
  const method = routes[path].method;
  const hasCache = routes[path].cache;

  // Create cache groups
  if (hasCache) {
    if (path.startsWith('/account')) {
      req.apicacheGroup = `accountId-${req.params.accountId}`;
    } else if (path.includes('/summoner')) {
      req.apicacheGroup = `summonerName-${req.query.summonerName}`;
    }
  }

  try {
    request({ qs: assignKey(req.query), uri: encodeURI(`https://${region}.${config.apiUrl}${method(options)}`)}, (error, response, body) => {
      if (error || body.status) { return res.status(500).send(body); }
      res.send(body);
    });
  } catch (e) {
    res.status(500).send(e);
  }

};

app.get('/', cache('1 day'), (req, res) => {
  res.status(200).json({
    name: 'League of Stats API',
  });
});


// Cache cleaning
app.get('/clear-cache/account/:accountId', (req, res) => {
  apicache.clear(`accountId-${req.params.accountId}`);
  res.status(200).json({ message: 'Cache cleared' });
});

// Cache cleaning
app.get('/clear-cache/summoner/:summonerName', (req, res) => {
  apicache.clear(`summonerName-${req.params.summonerName}`);
  res.status(200).json({ message: 'Cache cleared' });
});

// Dynamic API routes with cache
Object.keys(routes).forEach(route => {
  app.get(route, cache(route.cache), requestHandler);
});

// Error Handling
app.use((req, res) => {
  res.status(404).json({
      error: 404,
      message: 'Not Found'
  });
});

app.use((req, res) => {
  res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
  });
});

app.use((req, res) => {
  res.status(429).json({
      error: 429,
      message: 'Too many requests'
  });
});

//Start the server by listening on a port
app.listen(config.port, logPort(config.port));
