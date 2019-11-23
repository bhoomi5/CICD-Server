/*************************************************************************
 * Execution        : 1. default node      
 * 
 * Purpose          : Here, Amazon S3 can be employed to store any type of object which allows for uses like storage for cloud storage.
 *                    
 *                     
 *                    
 * 
 * @file            : s3.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
const AWS = require('aws-sdk');
require('dotenv').config({ path: './.env' })

//initialize the S3 interface by passing our access keys:
const s3Client = new AWS.S3({
    accessKeyId: process.env.AWSAccessKeyId, 
    secretAccessKey: process.env.AWSSecretKey,

});

module.exports = s3Client;

