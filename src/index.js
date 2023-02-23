const express = require("express");
const admin = require("firebase-admin");
//added os 
const os = require('os');
//added uuid
const {v4 : uuidv4} = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;
//cors enabled
const cors = require('cors');
// Enable CORS for all routes
app.use(cors());
// Middleware to parse JSON data and extend data limit to 50 MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set the body-parser middleware with the limit property set to 50 MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


//extra cors
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);

// Firebase config
//const serviceAccount = require("./admin.json");
// change to env 
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
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:  process.env.FIREBASE_DATABASE_URL,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN
});

// Firebase database initialization
const db = admin.database();
//changed to mode data
const data_Ref = db.ref("data");

//Add a new data
const add_data = (obj, res) => {
  const one_data = data_Ref.child(obj.id);
  one_data
    .set(obj)
    .then(() => res.status(200).json({ msg: "DATA created successfully" ,data:obj}))
    .catch((err) => res.status(300).json({ msg: "Something went wrong", error: err }));
};

// Add a demo data
const demo_data = (obj, res) => {
  if (!res) {
    return console.error("Response object is undefined.");
  }

  const data_Ref_demo = db.ref("demo_data");
  const one_data = data_Ref_demo.child(obj.id);
  one_data
    .push(obj)
    .then(() => res.status(200).json({ msg: "DATA created successfully" }))
    .catch((err) => res.status(300).json({ msg: "Something went wrong", error: err }));
};

// Get all data
const get_data = (res) => {
  data_Ref.once("value", (snap) => {
    res.status(200).json({ data: snap.val() });
  });
};


// Get a single data
const get_One_data = (obj, res) => {
  const data_Ref_demo = db.ref("data");
  const one_data = data_Ref_demo.child(obj.id);
  one_data.once("value", (snap) => {
    res.status(200).json({ data: snap.val() });
  });
};
// Routes
app.get("/", (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);

  console.log("GET request received");
  var datetime = new Date();
  let data={};
  data['app']='github_vercel_app';
  data['type']='GET';
  data['id']=uuidv4();
  data['dt']=datetime.toISOString();
  data['ip'] = req.ip;
  data['user_agent'] = req.get('user-agent');
  data['server_id'] = os.hostname();
  //   data['GET']=req.query;
  //   data['POST']=req.body;
  add_data(data,res);
  res.send(req.body);
});

// POST route
app.post('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);

  console.log("POST request received");
  const { name } = req.body;
  res.send(`Hello ${name}! This is a POST request`);
});

app.get("/data/:id", (req, res) => {
  const id = req.params.id;
  get_One_data({ id }, res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
