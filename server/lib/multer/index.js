const multer = require('multer')
const path = require('path')
const fs = require('fs')

const { generateSlug } = require('../../utils')

/**
 * Storage solution for demo purposes only.
 * In a production application, you should consider using a cloud storage service like AWS S3.
 */
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const { username } = req.user
    const uploadPath = path.join(__dirname, `../../../static/${username}/`)

    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true })

    cb(null, uploadPath)
  },
  filename: (_req, file, cb) => {
    const fileNameSplit = file.originalname.split('.')
    const extension = fileNameSplit.pop()
    const filename = `${generateSlug()}.${extension}`
    cb(null, filename)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/i
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  )
  const mimetype = allowedFileTypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(
      new Error('Invalid file type. Only image and document files are allowed.')
    )
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
})

module.exports = upload
