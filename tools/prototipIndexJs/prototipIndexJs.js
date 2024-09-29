const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const SupportModel = require("./models/Support.js");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");

const mime = require("mime-types");
const { dbConnectionString } = require("./db-config.js");
const PlaceModel = require("./models/Place.js");
const path = require("path");
const { users } = require("./superAdmin-config.js");

require("dotenv").config();
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";
const redis = require("redis");

// const options = {
//   key: fs.readFileSync("ssl/privkey.pem"),
//   cert: fs.readFileSync("ssl/fullchain.pem"),
// };

// https.createServer(options, app).listen(4002, () => {
//   console.log("Server is running on https://bnbback.ru:4002");
// });

// ########################################
// ########################################
// ########################################
const https = require("https");
const fs = require("fs");
// ########################################
// ########################################
// ########################################

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis",
    port: 6379,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

console.log("****************");
redisClient.connect().then(() => {
  if (redisClient.isOpen) {
    console.log("Connected to Redis...");

    // Выполняем простую команду Redis, чтобы проверить соединение
    redisClient
      .ping()
      .then((pong) => {
        console.log("Redis ping response:", pong);
      })
      .catch((err) => {
        console.log("Redis ping error:", err);
      });
  } else {
    console.log("Failed to connect to Redis");
  }
});

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(cors());

mongoose.set("strictQuery", false);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;
    // console.log("Received token:", token);

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error("Token verification error:", err);
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
}

async function initializeSuperAdmin() {
  await mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  for (const user of users) {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      const hashedPassword = bcrypt.hashSync(user.password, bcryptSalt);
      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      });
      // console.log(`${user.role} ${user.name} created successfully.`);
    } else {
      // console.log(`${user.role} ${user.name} already exists.`);
    }
  }
}
//qqq
// initializeSuperAdmin().catch(console.error);

app.get("/api/test", (req, res) => {
  mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  res.json("test ok new");
});

let isDynamicCachingEnabled = true;

app.post("/api/disable-dynamic-caching", (req, res) => {
  isDynamicCachingEnabled = false;
  res.status(200).send("Dynamic caching disabled");
});
// async function cacheMiddleware(req, res, next) {
//   if (!isDynamicCachingEnabled) {
//     return next();
//   }
// }

const registrationCounter = {
  Sunday: 0,
  Monday: 12,
  Tuesday: 0,
  Wednesday: 0,
  Thursday: 22,
  Friday: 30,
  Saturday: 0,
};

function getDayOfWeek(dateString) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
}
const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ error: "Access denied. No token provided." });
      }

      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role !== role) {
        return res
          .status(403)
          .json({ error: "Access denied. You do not have the correct role." });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

async function cacheMiddleware(req, res, next) {
  if (!isDynamicCachingEnabled || req.method !== "GET") {
    return next();
  }

  const key = `__express__${req.originalUrl || req.url}`;
  try {
    const cachedData = await redisClient.get(key);
    console.log("***  req.originalUrl  ***");
    console.log(req.originalUrl);
    console.log("***  req.url  ***");
    console.log(req.url);
    if (cachedData != null) {
      // console.log("Using cached data");
      return res.send(JSON.parse(cachedData));
    } else {
      const sendResponse = res.send.bind(res);
      res.send = async (body) => {
        await redisClient.set(key, JSON.stringify(body), {
          EX: 3600, // TTL in seconds
        });
        sendResponse(body);
      };
      next();
    }
  } catch (error) {
    console.error(error);
    next();
  }
}

async function invalidateCache(key) {
  await redisClient.del(key);
}
const downloadTasksDir = path.join(__dirname, "download-tasks");

if (!fs.existsSync(downloadTasksDir)) {
  fs.mkdirSync(downloadTasksDir, { recursive: true });
}

app.use((req, res, next) => {
  if (req.method === "GET") {
    cacheMiddleware(req, res, next);
    // console.log("it's working");
  } else {
    next();
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.post("/api/register", checkRole("super_admin"), async (req, res) => {
  mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // console.log("Received registration data:", req.body);
  const { name, email, password, role } = req.body;
  let userRole = role;
  if (
    email === superAdminCredentials.email &&
    password === superAdminCredentials.password
  ) {
    userRole = "super_admin";
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });
    const dayOfWeek = getDayOfWeek(new Date().toDateString());
    registrationCounter[dayOfWeek]++;
    const key = `__express__${req.originalUrl || req.url}`;
    await invalidateCache(key);
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.get("/api/registration-stats", (req, res) => {
  res.json(registrationCounter);
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    mongoose.connect(dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json("User not found");
    }

    const passOk = await bcrypt.compare(password, userDoc.password);
    if (!passOk) {
      return res.status(422).json("Password is incorrect");
    }

    const userToken = jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret
    );

    res.cookie("token", userToken).json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});
app.get("/api/profile", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.log(`Error verifying token:`, err);
        res.status(500).json({ message: "Token verification error" });
      } else {
        try {
          const user = await User.findById(userData.id);
          if (!user) {
            console.log(`User not found for ID: ${userData.id}`);
            res.status(404).json({ message: "User not found" });
          } else {
            const { name, email, role, _id } = user;
            console.log(`Sending response with user data:`, {
              name,
              email,
              role,
              _id,
            });
            res.json({ name, email, role, _id });
          }
        } catch (dbError) {
          console.log(`Database error:`, dbError);
          res.status(500).json({ message: "Internal server error" });
        }
      }
    });
  } else {
    console.log(`No token provided, sending null response`);
    res.json(null);
  }
});

app.post("/api/logout", (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
    res.clearCookie("token", { path: "/" });
    res.status(200).json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Error logging out" });
  }
});

const photosMiddleware = multer({ dest: "/tmp" });

const saveToLocal = async (sourcePath, originalname, mimetype) => {
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000);
  const ext = path.extname(originalname);
  const newName = `${timestamp}-${randomPart}${ext}`;
  const destPath = path.join(uploadsDir, newName);

  fs.copyFileSync(sourcePath, destPath);

  return `/uploads/${newName}`;
};
app.post(
  "/api/upload",
  photosMiddleware.array("photos", 100),
  async (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname, mimetype } = req.files[i];
      const url = await saveToLocal(path, originalname, mimetype);
      uploadedFiles.push({ url });
    }
    const key = `__express__${req.originalUrl || req.url}`;
    await invalidateCache(key);
    res.json(uploadedFiles);
  }
);

app.post("/api/download", async (req, res) => {
  const { userId, url, method } = req.body;

  const baseDir = path.dirname(
    require.resolve("../client/src/pagesAdmin/downloadList/downloadList.jsx")
  );
  const filePath = path.join(baseDir, "tasks.json");

  let tasks = [];

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    try {
      const tasksRaw = fs.readFileSync(filePath);
      tasks = JSON.parse(tasksRaw);
      if (!Array.isArray(tasks)) {
        console.warn(
          "The tasks file does not contain an array, initializing with an empty array."
        );
        tasks = [];
      }
    } catch (error) {
      console.error("Error reading or parsing the tasks file:", error);
      tasks = [];
    }
  }

  const task = { userId, url, method };
  tasks.push(task);

  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

  res.send({ message: "Download task created", task });
});

app.post("/api/create-download-task", async (req, res) => {
  const { username, url } = req.body;
  const taskId = Date.now();

  const task = {
    id: taskId,
    username: username,
    url: url,
    method: "SELECT",
  };

  const filePath = path.join(downloadTasksDir, `task-${taskId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(task));

  res.json({ message: "Задача на скачивание создана", task: task });
});

app.post("/api/places", async (req, res) => {
  mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const { token } = req.cookies;
  console.log("Received data:", req.body);
  const {
    title,
    address,
    photos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    publishDate,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const newPlace = {
      owner: userData.id,
      price,
      title,
      address,
      photos: req.body.addedPhotos.map((photo) => photo.url),
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      publishDate: new Date(publishDate),
    };

    if (publishDate === 0 || new Date(publishDate) <= new Date()) {
      const placeDoc = await Place.create(newPlace);
      console.log("Place created immediately:", placeDoc);
      res.json(placeDoc);
    } else {
      const currentTime = new Date().getTime();
      const publishTime = new Date(publishDate).getTime();
      const delay = publishTime - currentTime;

      setTimeout(async () => {
        const placeDoc = await Place.create(newPlace);
        console.log("Place created after delay:", placeDoc);
        res.json(placeDoc);
      }, delay);
    }
  });
});

app.get("/api/user-places", (req, res) => {
  mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/api/places/:id", async (req, res) => {
  try {
    mongoose.connect(dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const { id } = req.params;
    const place = await Place.findById(id);

    if (place) {
      await place.save();
      await redisClient.set(id, JSON.stringify(place), {
        EX: 3600,
      });
      res.json(place);
      console.log(place);
    } else {
      res.status(404).send("Place not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.post("/api/places/view/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (place) {
      place.viewersCount = (place.viewersCount || 0) + 1;
      await place.save();
      res.status(200).send("View count updated");
    } else {
      res.status(404).send("Place not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/api/places", async (req, res) => {
  mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.findById(id);
    if (!photoUrls.every((url) => typeof url === "string")) {
      return res.status(400).send("Invalid photo URLs format");
    }

    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: photoUrls,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      try {
        await placeDoc.save();
        res.json("ok");
      } catch (saveError) {
        console.error("Error saving place:", saveError);
        res.status(500).send("Error saving place");
      }
    } else {
      res.status(403).send("Unauthorized to edit this place");
    }
  });
});

app.get("/api/places", async (req, res) => {
  mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  res.json(await Place.find());
});

app.post("/api/support", async (req, res) => {
  const { title, description, fullname, telefonnumber, email, status } =
    req.body;
  try {
    const supportData = new SupportModel({
      title,
      description,
      fullname,
      telefonnumber,
      email,
      status: status || 0,
    });

    const savedSupport = await supportData.save();
    console.log("Support data saved:", savedSupport);

    res.json(savedSupport);
  } catch (error) {
    res.status(500).json({ error: "Failed to save support data." });
  }
});

app.delete("/api/deletesupport/:id", async (req, res) => {
  const supportId = req.params.id;

  try {
    await SupportModel.findByIdAndDelete(supportId);
    res.json({ message: "Support data deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete support data." });
  }
});

app.get("/api/allsupport", async (req, res) => {
  try {
    const supportData = await SupportModel.find();
    res.json(supportData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch support data." });
  }
});

const getMonthName = (monthIndex) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[monthIndex];
};

app.get("/api/places-count", async (req, res) => {
  try {
    mongoose.connect(dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const id = req.params.id;

    const period = req.query.period;
    let filter = {};

    if (period === "week") {
      let lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filter.publishDate = { $gte: lastWeek };
    } else if (period === "month") {
      let lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filter.publishDate = { $gte: lastMonth };
    }

    const count = await PlaceModel.countDocuments(filter);
    res.json({ count });
  } catch (error) {
    console.error("Error occurred in /api/places/count:", error);
    res.status(500).json({ error: "Failed to fetch places count." });
  }
});

app.get("/api/views-stats", async (req, res) => {
  try {
    mongoose.connect(dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const period = req.query.period;
    let aggregation;

    switch (period) {
      case "week":
        // Агрегация по дням недели
        aggregation = [
          {
            $match: {
              /* Ваш фильтр для недели */
            },
          },
          {
            $group: {
              _id: { $dayOfWeek: "$publishDate" },
              totalViews: { $sum: "$viewersCount" },
            },
          },
          { $sort: { _id: 1 } },
        ];
        break;
      case "month":
        // Агрегация по дням месяца
        aggregation = [
          {
            $match: {
              /* Ваш фильтр для месяца */
            },
          },
          {
            $group: {
              _id: { $dayOfMonth: "$publishDate" },
              totalViews: { $sum: "$viewersCount" },
            },
          },
          { $sort: { _id: 1 } },
        ];
        break;
      case "all":
        // Агрегация по месяцам
        aggregation = [
          {
            $group: {
              _id: { $month: "$publishDate" },
              totalViews: { $sum: "$viewersCount" },
            },
          },
          { $sort: { _id: 1 } },
        ];
        break;
      default:
        return res.status(400).json({ error: "Invalid period specified." });
    }

    const result = await PlaceModel.aggregate(aggregation);

    const formattedData = result.map((item) => {
      return {
        "Месяц/День":
          period === "all" ? getMonthName(item._id - 1) : item._id.toString(),
        Просмотров: item.totalViews,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error("Error occurred in /api/views-stats:", error);
    res.status(500).json({ error: "Failed to fetch view statistics." });
  }
});
app.post("/api/track-click", async (req, res) => {
  const { placeId, url } = req.body;
  console.log("Received track-click for:", placeId, url);

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).send("Place not found");
    }

    let linkClick = place.linkClicks.find((lc) => lc.url === url);
    if (linkClick) {
      linkClick.count++;
    } else {
      place.linkClicks.push({ url, count: 1 });
    }

    await place.save();
    console.log("Updated place with new link click:", place);
    res.status(200).send("Click tracked");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/api/all-link-clicks", async (req, res) => {
  try {
    mongoose.connect(dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const places = await PlaceModel.find({}, "linkClicks _id").populate(
      "linkClicks"
    );

    const allLinkClicks = places.flatMap((place) =>
      place.linkClicks.map((linkClick) => ({
        postId: place._id,
        ...linkClick._doc,
      }))
    );

    res.json(allLinkClicks);
  } catch (error) {
    console.error("Error occurred in /api/all-link-clicks:", error);
    res.status(500).json({ error: "Failed to fetch link clicks." });
  }
});
app.delete("/api/delete-link/:placeId/:linkId", async (req, res) => {
  const { placeId, linkId } = req.params;

  try {
    // Находим документ Place
    const place = await PlaceModel.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    place.linkClicks = place.linkClicks.filter(
      (link) => link._id.toString() !== linkId
    );

    await place.save();

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: "Failed to delete link" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.use((req, res, next) => {
  if (req.method === "GET") {
    cacheMiddleware(req, res, next);
    console.log("it's working");
  } else {
    next();
  }
});

app.listen(4000);
