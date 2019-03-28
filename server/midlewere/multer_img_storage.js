var multer  = require('multer')

var storage = (destination)=> multer.diskStorage({
    destination,
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
  var imageFilter = function (req, file, cb) {
      // accept image files only
      console.log(file)
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  var uploadImg = destination => multer({ storage: storage(destination), fileFilter: imageFilter})

  module.exports = uploadImg
