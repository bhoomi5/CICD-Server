/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : Multer is a node.js middleware for handling multipart/form-data ,
 *                    which is primarily used for uploading files
 *                    
 *                     
 *                    
 * 
 * @file            : multer.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
const multer = require('multer');

// node js middleware
const multerS3 = require('multer-s3')
const s3 = require('../config/s3');

require('dotenv').config()
// create a function that accepts a fileName parameter, representing the file we want to upload:
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.bucket,
        key: (req, file, callback) => {
            
             console.log("\n\n\tFile received in config --> multer ", file);
            callback(null, file.originalname);
        }
    })
});

module.exports = upload;