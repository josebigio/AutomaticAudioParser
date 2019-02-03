import AWS from 'aws-sdk';
import {RateLimiter} from 'limiter';
import fs from 'fs';

const FILE_LENGTH = 3600
const BUCKET_NAME = "piyin.corp";
const BOOK_FOLDER_NAME = "testDestination";
const PREFIX_NAME = "SOCIAL_LEAP_LARGE"
const URL_PREFIX = `https://s3.us-east-2.amazonaws.com/${BUCKET_NAME}`;
const s3Service = new AWS.S3();
const transcribeService = new AWS.TranscribeService({ region: 'us-east-2' });
const limiter = new RateLimiter(1, 10000); // at most 1 request every 100 ms

export function getUrlFromKey(key) {
  return `${URL_PREFIX}/${key.replace(" ", "+")}`
}

export function startTranscriptionJob(input, jobName) {
   return transcribeService
          .startTranscriptionJob(makeTranscribeParams(jobName, input))
          .promise()
      
}

export function getAllFileNames(prefix) {
  return getAllFiles(prefix)
        .then((response)=>{
          return response.map((fileObject)=>fileObject.Key)
        })
}

export function getJSONOutputFromS3File(fileName) {
    return s3Service.getObject({Bucket: BUCKET_NAME, Key: fileName}).promise()
    .then(response => {
      return JSON.parse(response.Body.toString('utf-8'))
    })
}

export function uploadFile(source, destination) {
console.log("uploadFile")
  return new Promise((resolve, reject) => {
    fs.readFile(source, (err, data) => {
      if (err) {reject(err) }
  
        const base64data = new Buffer(data, 'binary');
        s3Service.putObject({
          Bucket: BUCKET_NAME,
          Key: destination,
          Body: base64data,
        }).promise()
        .then(response=>{
          console.log(`Success uploading ${source} to ${destination}`, response)
          resolve(response);
        })
        .catch(error=>{
          console.error(`error uploading ${source} to ${destination}`, error)
          reject(error)
        })
    })
  });
  

}

function getAllFiles(prefix) {
  return s3Service
    .listObjects({
      Delimiter: "/",
      Prefix: prefix,
      Bucket: BUCKET_NAME
    }).promise()
    .then((response) => {
      if (response && response.Contents) {
        return response.Contents
          .filter(fileObject => {
            return fileObject.Size && fileObject.Size > 0 && fileObject.Key
          })
      }
      return []
    })
}

const makeTranscribeParams = function (jobName ,url) {
  return {
    LanguageCode: "en-US",
    Media: {
      MediaFileUri: url
    },
    MediaFormat: "mp3",
    TranscriptionJobName: jobName,
    OutputBucketName: BUCKET_NAME
  }

};