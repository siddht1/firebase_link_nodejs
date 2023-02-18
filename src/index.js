const express = require("express");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 3000;
//cors enabled
const cors = require('cors');

// Enable CORS for all routes
router.use(cors());
// Firebase config
//const serviceAccount = require("./admin.json");
const serviceAccount={
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
 "private_key": process.env.FIREBASE_PRIVATE_KEY,
  "client_email":process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri":  process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
//   "databaseURL":  process.env.FIREBASE_DATABASE_URL,
//   "authDomain": process.env.FIREBASE_AUTH_DOMAIN
  
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:  process.env.FIREBASE_DATABASE_URL,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN
});

// // Firebase database reference
const db = admin.database();
const userRef = db.ref("users");

//Add a new user
const addUser = (obj, res) => {
  const oneUser = userRef.child(obj.roll);
  oneUser
    .set(obj)
    .then(() => res.status(200).json({ msg: "User created successfully" }))
    .catch((err) => res.status(300).json({ msg: "Something went wrong", error: err }));
};

// // Add a demo user
// const demoUser = (obj, res) => {
//   if (!res) {
//     return console.error("Response object is undefined.");
//   }

//   const userRefdemo = db.ref("demousers");
//   const oneUser = userRefdemo.child(obj.roll);
//   oneUser
//     .push(obj)
//     .then(() => res.status(200).json({ msg: "User created successfully" }))
//     .catch((err) => res.status(300).json({ msg: "Something went wrong", error: err }));
// };

// // Get all users
// const getUsers = (res) => {
//   userRef.once("value", (snap) => {
//     res.status(200).json({ users: snap.val() });
//   });
// };

// // Get a single user
// const getOneUser = (obj, res) => {
//   const userRefdemo = db.ref("users");
//   const oneUser = userRefdemo.child(obj.roll);
//   oneUser.once("value", (snap) => {
//     res.status(200).json({ user: snap.val() });
//   });
// };

// Routes
app.get("/", (req, res) => {
  let data={'type':'github_vercel_app','roll':51};
res.send(addUser(data,res));
});

app.get("/users", (req, res) => {
  getUsers(res);
});

app.get("/users/:roll", (req, res) => {
  const roll = req.params.roll;
  getOneUser({ roll }, res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
