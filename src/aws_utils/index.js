// import AWS from 'aws-sdk';
// import {RateLimiter} from 'limiter';
// import fs from 'fs';

// const FILE_LENGTH = 3600
// const BUCKET_NAME = "piyin.corp";
// const BOOK_FOLDER_NAME = "social leap";
// const PREFIX_NAME = "SOCIAL_LEAP_LARGE"
// const URL_PREFIX = `https://s3.us-east-2.amazonaws.com/${BUCKET_NAME}/${BOOK_FOLDER_NAME.replace(" ", "+")}/`;
// const s3Service = new AWS.S3();
// const transcribeService = new AWS.TranscribeService({ region: 'us-east-2' });
// const limiter = new RateLimiter(1, 10000); // at most 1 request every 100 ms

// interface BookPart {
//   url: string,
//   fileName: string
// }

// function getAllFiles(prefix: string): Promise<AWS.S3.Types.ObjectList> {
//   return s3Service
//     .listObjects({
//       Delimiter: "/",
//       Prefix: prefix,
//       Bucket: "piyin.corp"
//     }).promise()
//     .then((response) => {
//       if (response && response.Contents) {
//         return response.Contents
//           .filter(fileObject => {
//             return fileObject.Size && fileObject.Size > 0 && fileObject.Key
//           })
//       }
//       return []
//     })
// }


// function getAllBooks(prefix: string): Promise<Array<BookPart>> {
//  return getAllFiles(prefix)
//     .then((response) => {
//         return response
//           .map((fileObject) => {
//             const fileName = fileObject.Key!.replace(BOOK_FOLDER_NAME, "").replace("/", "")
//             const result: BookPart = {
//               url: URL_PREFIX + fileName,
//               fileName: fileName
//             }
//             return result;
//           });
//     })
// }

// // getAllBooks("social leap/")
// //   .then(response => {
// //     for (let i = 10; i < response.length; i++) {
// //       limiter.removeTokens(1,()=>{
// //         const bookPart = response[i]
// //         const params = makeTranscribeParams(`${PREFIX_NAME}-${i}`, bookPart.url)
// //         transcribeService.startTranscriptionJob(params).promise().then((response)=>{
// //           console.log("TRANSCRIBE RESPONSE: ", response)
// //         })
// //       })
// //     }
// //   })

// const promiseList = getAllFiles("")
//   .then(response=>{
//     return response.filter((fileObject)=>{
//       return fileObject.Key!.includes(PREFIX_NAME)
//     }).map(responseObject=>responseObject.Key!)
//     .sort((key1, key2)=>{
//       return Number(key1.replace(PREFIX_NAME,"").replace("-","").replace(".json",""))
//      - Number(key2.replace(PREFIX_NAME,"").replace("-","").replace(".json",""))
//     })
//     .map(key => {
//       console.log(key);
//       return s3Service.getObject({Bucket: "piyin.corp", Key: key}).promise()
//     })
//   })

//   promiseList.then((promiseList)=>{
//     return Promise.all(promiseList).then( result => {
//       return result.map((s3Object, index)=>{
//         const jsonString =  s3Object.Body!.toString()
//         const json = JSON.parse(jsonString);
//         return makeArray(json.results.items, index*FILE_LENGTH)
//       })
//     })
//   })
//   .then(listOfWords => {
//     var wordList: any[] = []
//     for(const miniWordList of listOfWords) {
//       wordList = wordList.concat(miniWordList);
//     }
//     fs.writeFileSync('output.json',JSON.stringify({"words":wordList}),'utf8');

//   })

//   const makeArray = (items: any, offset: number)=>{
//     const result = []
//     for(let item of items) {
//         const word = item.alternatives[0].content;
//         if( item.start_time ) {
//             result.push(
//                 {
//                 "word": item.alternatives[0].content,
//                 "startTime": "" + (Number(item.start_time) + offset).toFixed(3),
//                 "endTime": "" + (Number(item.end_time) + offset).toFixed(3)
//                 }
//             )
//         }
//         else {
//             result[result.length-1].word = result[result.length-1].word + word
//         }
//     }
//     return result;
//   }


  
//   // .then(
//   //   response=>{
//   //     return  s3Service.getObject({Bucket: "piyin.corp", Key: key}).promise();
//   //     for(const key of response) {
//   //       s3Service.getObject({Bucket: "piyin.corp", Key: key}).promise().then(object=>{
//   //         const jsonString =  object.Body!.toString()
//   //         const json = JSON.parse(jsonString);
//   //         const items = json.results.items
//   //         console.log(resultList);
//   //       })
//   //     }
//   //   }
//     // s3Service.getObject(
//     //   { Bucket: "my-bucket", Key: "my-picture.jpg" },
//     //   function (error, data) {
//     //     if (error != null) {
//     //       alert("Failed to retrieve an object: " + error);
//     //     } else {
//     //       alert("Loaded " + data.ContentLength + " bytes");
//     //       // do something with data.Body
//     //     }
//     //   }
//     // );









// const makeTranscribeParams = function (jobName: string, url: string): AWS.TranscribeService.StartTranscriptionJobRequest {
//   return {
//     LanguageCode: "en-US",
//     Media: {
//       MediaFileUri: url
//     },
//     MediaFormat: "mp3",
//     TranscriptionJobName: jobName,
//     OutputBucketName: BUCKET_NAME
//   }

// };