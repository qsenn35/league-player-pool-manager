const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = require("./secret.js");
const { PORT } = require("./env.js");
const { getAccessToken, comparePasswords, verifyToken } = require("./util.js");
const { Pool } = require("./models/Pool.js");
const { generateBootcampTeams } = require("./sorters/bootcampSort/index.js");
const { User } = require("./models/User.js");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3001", "http://iandev:3001"],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(express.json());

const router = express.Router();

app.use('/api', router);

const db = mongoose.connection;
db.on('open', () => console.log("Connected to Mongo DB"));
db.on('error', () => console.log("Error connecting to Mongo DB"));

mongoose.connect("mongodb://127.0.0.1:27017/player-pools");

const isAuthed = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "User is not authenticated." });

  const token = getAccessToken(req.headers);
  const tokenVerified = verifyToken(token);

  if (!tokenVerified)
    return res.status(401).json({ error: "User is not authenticated." });

  next();
};

const ownsPool = async (req, res, next) => {
  const accessToken = getAccessToken(req.headers);
  const poolId = req.params.id || req.body.poolId;

  try {
    const user = await User.findOne({ accessToken });
    const pool = await Pool.findOne({ id: poolId });

    if (!user) return res.status(404).json({ error: "User not found." });
    if (!pool) return res.status(404).json({ error: "Pool not found." });
    if (pool.creator !== user.id)
      return res.status(403).json({ error: "User does not own this pool." });

    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "An unknown error occured." });
  }
};

router.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const saltRounds = 10;

    if (!username) return res.status(400).json({ error: "Username required." });
    else if (!password)
      return res.status(400).json({ error: "Password required." });

    const userExists = await User.findOne({ username: username });
    if (userExists)
      return res.status(400).json({ error: "Username already exists" });

    bcrypt.hash(password, saltRounds).then((hash) => {
      const user = new User({
        id: uuidv4(),
        username,
        passwordHash: hash,
      });

      user.save().then(() => {
        res.status(200).json(user);
      });
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) return res.status(400).json({ error: "Username required." });
    if (!password) return res.status(400).json({ error: "Password required." });

    const user = await User.findOne({ username: username });
    if (!user)
      return res.status(401).send({ error: "Username or Password is incorrect." });

    const isCorrectPassword = await comparePasswords(
      password,
      user.passwordHash
    );
    const accessToken = jwt.sign(
      JSON.stringify({
        id: user.id,
        username: user.username,
        created: user.created,
      }),
      secret.TOKEN_SECRET
    );

    // save access token to user object for future lookups
    try {
      user.accessToken = accessToken;
      await user.save();
    } catch (err) {
      console.error(err);
      return res.status(400).error({ error: "Unknown error occurred." });
    }

    if (!isCorrectPassword)
      return res
        .status(403)
        .json({ error: "Username or Password is incorrect." });

    return res.status(200).json({
      id: user.id,
      username,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "An unknown error occurred." });
  }
});

// get user's pools
router.get("/pools", async (req, res) => {
  try {
    // get access token
    const accessToken = getAccessToken(req.headers);

    // get user by access token
    const user = await User.findOne({ accessToken });
    // return 404 status if user isn't found
    if (!user) return res.status(404).json({ error: "User not found." });

    const { id } = user;

    // get pools by id and sort by created date.
    const pools = await Pool.find({ creator: id }).sort("created");
    // return 404 if no pools are found
    if (!pools) return res.status(404).json({ error: "No pools found" });

    // finally, return pools
    return res.status(200).json(pools);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "An unknown error occurred." });
  }
});

router.get("/pools/:id/view", async (req, res) => {
  try {
    if (!req.params.id) res.status(400).json({});
    const pool = await Pool.findOne({ id: req.params.id });
    if (!pool) return res.status(404).json({ error: "Pool not found." });
    res.status(200).json(pool.toObject());
  } catch(error) {
    console.error(error);
    res.status(400).json({ error: "An unknown error occurred." });
  }
});

router.get("/pools/:id/edit", [isAuthed, ownsPool], async (req, res) => {
  try {
    const pool = await Pool.findOne({ id: req.params.id });
    if (!pool) return res.status(404).json({ error: "Pool not found" });
    res.status(200).json(pool.toObject());
  } catch(error) {
    console.error(error);
    res.status(400).json({ error: "An unknown error occurred." });
  }
});

router.delete("/pools/:id/delete", [isAuthed, ownsPool], async (req, res) => {
  try {
    const pool = await Pool.findOne({ id: req.params.id });
    if (!pool) return res.status(404).json({ error: "Pool not found" });

    await Pool.deleteOne({ id: pool.id });

    res.status(200).json({ success: true });
  } catch(error) {
    console.error(error);
    res.status(400).json({ error: "An unknown error occurred." });
  }
});

router.post("/pools/create", [isAuthed], async (req, res) => {
  const title = req.body.title;
  const accessToken = getAccessToken(req.headers);

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const user = await User.findOne({ accessToken });

    if (!user)
      return res.status(401).json({ error: "User not authenticated." });

    const pool = new Pool({
      id: uuidv4(),
      creator: user.id,
      title,
      players: [],
    });

    await pool.save();
    res.status(200).json(pool);
  } catch (err) {
    console.error("::: /pools/create/ error :::", err);
    res.status(400).json({ error: err });
  }
});

router.patch("/pools/join", async (req, res) => {
  try {
    const { poolId, player } = req.body;
    const pool = await Pool.findOne({ id: poolId });

    if (pool && poolId && player) {
      player.id = uuidv4();
      pool.players.push(player);
      await pool.save();
      res.status(200).json(pool);
    } else if (!poolId) {
      res.status(400).json({ error: "Pool ID required." });
    } else if (!player) {
      res.status(400).json({ error: "Player Object required." });
    } else if (!pool) {
      res.status(404).json({ error: "Pool not found!" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

router.patch("/pools/:id/players/add", [isAuthed, ownsPool], async (req, res) => {
  try {
    const pool = await Pool.findOne({ id: req.params.id });
    const player = req.body;

    if (pool && player) {
      player.id = uuidv4();
      pool.players.push(player);
      await pool.save();
      res.status(200).json(pool);
    } else if (!pool) {
      res.status(400).json({ error: "Pool not found." });
    } else if (!player) {
      res.status(400).json({ error: "Player object required" });
    }
  } catch (err) {
    res.status(404);
    console.error(err);
    res.json({ error: err });
  }
});

router.patch("/pools/:id/players/edit", [isAuthed, ownsPool], async (req, res) => {
  try {
    const pool = await Pool.findOne({ id: req.params.id });
    const playerId = req.body.playerId;
    const newPlayer = req.body.player;

    if (pool && playerId && newPlayer) {
      pool.players = pool.players.map((player) => {
        if (player.id === playerId) return { ...player, ...newPlayer };

        return player;
      });
      await pool.save();
      res.status(200).json(pool);
    } else if (!pool) {
      res.status(404).json({ error: "Pool not found" });
    } else if (!playerId) {
      res.status(400).json({ error: "Player ID Required " });
    } else if (!player) {
      res.status(400).json({ error: "Player object required." });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

router.patch(
  "/pools/:id/players/remove",
  [isAuthed, ownsPool],
  async (req, res) => {
    try {
      const pool = await Pool.findOne({ id: req.params.id });
      const playerId = req.body.playerId;

      if (pool && playerId) {
        pool.players = pool.players.filter((player) => player.id !== playerId);
        await pool.save();
        res.status(200).json(pool);
      } else if (!pool) {
        res.status(400).json({ error: "Pool not found" });
      } else if (!playerId) {
        res.status(400).json({ error: "Player ID Required " });
      }
    } catch (err) {
      res.status(404);
      console.error(err);
      res.json({ error: err });
    }
  }
);

router.patch(
  "/pools/:id/teams/generate",
  [isAuthed, ownsPool],
  async (req, res) => {
    try {
      const { teamsType } = req.body;

      if (!teamsType)
        return res.status(400).json({ error: "Teams type required." });

      const poolId = req.params.id;
      const pool = await Pool.findOne({ id: poolId });

      if (!pool) return res.status(404).json({ error: "Pool not found." });

      switch (teamsType) {
        case "customs":
          break;
        case "tournament":
          break;
        case "bootcamp":
          if (pool.players.length === 10) {
            const [lowEloTeams, midEloTeams, highEloTeams] =
              generateBootcampTeams(pool.players);
            const teams = [...lowEloTeams, ...midEloTeams, ...highEloTeams];
            pool.teams = teams;
            await pool.save();
            return res.status(200).status(pool);
          }
          return res.status(400).json({
            error: `Invalid number for players for teams type: ${teamsType}`,
          });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err });
    }
  }
);

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
