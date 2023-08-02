const multer = require( 'multer' );

// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null, './uploads')
//     },
//     filename:(req,file,cb)=>{
//         cb(null, file.originalname)
//     }
// });

// const fileFilter = (req, file, cb)=>{
//     if (!file.mimetype.startsWith('image/')) {
//         cb(null, true)
//     }else{
//         cb(new Error("Only images are allowed"), false);
//     }
// }


// const upload = multer({
//     storage,
//     fileFilter,
//     fileSize:{
//         limit:1024*1024 * 10
//     }

    
// })


const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage }).single("itemImage")


module.exports = upload;