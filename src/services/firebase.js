const admin = require('firebase-admin');
const serviceAccount = require("../../etc/secrets/firebase-key.json");
// var serviceAccount = require("/etc/secrets/firebase-key.json");
const BUCKET = "imogoat-oficial-ab14c.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET
});

const bucket = admin.storage().bucket(BUCKET);

const uploadImovel = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const uploadPromises = req.files.map(async (image) => {

    const nomeArquivo = Date.now() + "." + image.originalname.split(".").pop();
    const file = bucket.file("imoveis/" + nomeArquivo);

    const stream = file.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
      resumable: false,
    });

    await new Promise((resolve, reject) => {
      stream.on("error", (e) => {
        console.error(e);
        reject(e);
      });

      stream.on("finish", async () => {
        await file.makePublic();
        image.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/imoveis/${nomeArquivo}`;
        resolve();
      });

      stream.end(image.buffer);
    });
  });
  try {
    await Promise.all(uploadPromises);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = uploadImovel;
