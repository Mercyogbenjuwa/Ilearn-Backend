const adminData = require("firebase-admin");
const serviceAccount = require("../../server.json")

adminData.initializeApp({
    credential: adminData.credential.cert(serviceAccount)
  });
  
  export default adminData