const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { PORT } = require('./env.js');
const { comparePasswords } = require('./util.js');
const { Pool } = require('./models/Pool.js');

const app = express();
app.use(cors({
  origin: ['http://localhost:3001'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(express.json());

const checkPoolPasswordMiddleware = async (req, res, next) => {
  if (!req.headers.authorization)
    res.status(401).send({ error: "Password required." });

  const password = req.headers.authorization.split(' ')[1];
  console.log(req.headers.authorization);

  let poolId = req.body.poolId || req.params.id;

  try {
    // find pool
    const pool = await Pool.findOne({ id: poolId });
    const isCorrectPassword = await comparePasswords(password, pool.passwordHash);
    if (isCorrectPassword)
      next()
    else
      res.status(401).send({ error: "Password is incorrect." });
  } catch(err) {
    console.error(err);
    res.status(400).send({ error: err });
  }
}

const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.on('open', () => {
  console.log("Mongoose connected to mongodb");
});
mongoose.connect('mongodb://0.0.0.0:27017/player-pools');

app.get('/', (req, res) => res.send("Hello, World!"));

app.get('/pools/:id/view', async (req, res) => {
  if (!req.params.id)
    res.status(400).json({});
  const pool = await Pool.findOne({ id: req.params.id });
  res.status(200).send(pool.toObject());
});

app.get('/pools/:id/edit', checkPoolPasswordMiddleware, async (req, res) => {
  if (!req.params.id)
    res.status(400).json({});
  const pool = await Pool.findOne({ id: req.params.id });
  res.status(200).send(pool.toObject());
});

app.post('/pools/create', (req, res) => {
  const {
    title,
    password,
  } = req.body;

  console.log(title, password);

  if (!title) {
    return res.status(400).send({ error: "Title is required." });
  }
  if (!password) {
    return res.status(400).send({ error: "Password is required." });
  }

  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
        const pool = new Pool({
          id: uuidv4(),
          title,
          passwordHash: hash,
          players: [],
        });
      
        pool.save()
          .then((err) => {
            console.log(err);
            res.status(200).json(pool);
          })
    });
});

  
});

app.post('/pools/join', async (req, res) => {
  try {
    const { poolId, player } = req.body;
    const pool = await Pool.findOne({ id: poolId });
    
    if (pool && poolId && player) {
      player.id = uuidv4();
      pool.players.push(player);
      await pool.save();
      res.status(200).json(pool);
    }
    else if (!poolId) {
      res.status(400).json({ error: 'Pool ID required.' });
    }
    else if (!player) {
      res.status(400).json({ error: 'Player Object required.' }); 
    }
    else if (!pool) {
      res.status(404).json({ error: "Pool not found!" });
    }

  } catch(err) {
    console.error(err);
    res.status(400).json({ error: err })
  }
});

app.patch('/pools/:id/players/add', checkPoolPasswordMiddleware, async (req, res) => {
  try {
    const pool = await Pool.findOne({ id: req.params.id });
    const player = req.body;

    if (pool && player) {
      player.id = uuidv4();
      pool.players.push(player);
      await pool.save();
      res.status(200).send(pool);
    } else if (!pool) {
      res.status(400).send({ error: 'Pool not found.' });
    } else if (!player) {
      res.status(400).send({ error: 'Player object required' });
    }
  } catch(err) {
    res.status(404);
    console.error(err);
    res.send({ error: err });
  }
});

app.patch('/pools/:id/players/edit', checkPoolPasswordMiddleware, async (req, res) => {

  try {
    const pool = await Pool.findOne({ id: req.params.id });
    const playerId = req.body.playerId;
    const newPlayer = req.body.player;

    if (pool && playerId && newPlayer) {
      pool.players = pool.players.map((player) => {
        if (player.id === playerId)
          return { ...player, ...newPlayer };
        else
          return player;
      });
      await pool.save();
      res.status(200).send(pool);
    } else if (!pool) {
      res.status(404).send({ error: 'Pool not found' });
    } else if (!playerId) {
      res.status(400).send({ error: 'Player ID Required '});
    } else if (!player) {
      res.status(400).send({ error: 'Player object required.' });
    }
  } catch(err) {
    console.error(err);
    res.status(400).send({ error: err });
  }
});


app.patch('/pools/:id/players/remove', checkPoolPasswordMiddleware, async (req, res) => {

  try {
    const pool = await Pool.findOne({ id: req.params.id });
    const playerId = req.body.playerId;

    if (pool && playerId) {
      pool.players = pool.players.filter((player) => player.id !== playerId);
      console.log(playerId, pool.players);
      await pool.save();
      res.status(200).send(pool);
    } else if (!pool) {
      res.status(400).send({ error: 'Pool not found' });
    } else if (!playerId) {
      res.status(400).send({ error: 'Player ID Required '});
    }
    
  } catch(err) {
    res.status(404);
    console.error(err);
    res.send({ error: err });
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
