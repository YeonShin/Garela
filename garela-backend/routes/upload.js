const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const fs = require('fs');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  logger: console // 디버깅 정보를 콘솔에 출력
});

// Multer 설정
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

router.post('/upload-image', upload.single('image'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded.');

  try {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `images/${Date.now().toString()}${path.extname(file.originalname)}`,
      Body: fs.createReadStream(file.path),
    };

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const result = await upload.done();
    fs.unlinkSync(file.path); // 로컬 저장소에서 파일 삭제
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

    res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error("Error uploading image:", err); // 에러 메시지 출력
    res.status(500).send(err.message);
  }
});

module.exports = router;
