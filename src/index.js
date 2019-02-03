import fs from "fs"
import { getAllFileNames, getJSONOutputFromS3File, uploadFile, startTranscriptionJob, getUrlFromKey } from './aws_utils'
import yargs from 'yargs'
import {RateLimiter} from 'limiter';


const limiter = new RateLimiter(1,'sec'); //1 request per second
const LENGHT_OF_FILE = 3600
const AWS_PREFIX = "fear and loathing in las vegas/transcription/"
const AUDIO_FOLDER = "./mp3s/segments"
const S3_AUDIO_DESTINATION = "testDestination/segments"

// const inputUrl = getUrlFromKey(S3_AUDIO_DESTINATION + "/FEAR_AND_LOATHING000.mp3")
// startTranscriptionJob(inputUrl, "testJob")

// for(var i = 0; i< 30; i++) {
//     limiter.removeTokens(1, function(err, remainingRequests) {
//         console.log("remaining requests: " + remainingRequests)
//     });
// }

getAllFileNames("SOCIAL_LEAP").then(response=>console.log(response))

// fs.readdir("testDestination/segments", (err, files) => {
//     console.log(files)
//     const uploadFilePromiseList = files.map(file=>uploadFile(`${AUDIO_FOLDER}/${file}`,`${S3_AUDIO_DESTINATION}/${file}`))
//     Promise.all(uploadFilePromiseList)
//     .then(result=>{
//         console.log(result)
//     })
//     .catch(error=>{
//         console.log(error)
//     })
// })



// console.log("fileName: " + yargs.argv.fileName)

// fs.readdir(AUDIO_FOLDER, (err, files) => {
//     console.log(files)
//     const uploadFilePromiseList = files.map(file=>uploadFile(`${AUDIO_FOLDER}/${file}`,`${S3_AUDIO_DESTINATION}/${file}`))
//     Promise.all(uploadFilePromiseList)
//     .then(result=>{
//         console.log(result)
//     })
//     .catch(error=>{
//         console.log(error)
//     })
// })


// getAllFileNames(AWS_PREFIX).then(listOfFilesNames => {
//     const fileNamesPromises = listOfFilesNames.map((fileName) => {
//         return getJSONOutputFromS3File(fileName)
//     });
//     return Promise.all(fileNamesPromises);
// }).then(fileJsons => {
//     console.log("got responses")
//     var result = []
//     for (var i = 0; i < fileJsons.length; i++) {
//         const items = fileJsons[i].results.items
//         const parsedArray = getParsedArray(items, i * LENGHT_OF_FILE)
//         result = result.concat(parsedArray)
//     }
//     fs.writeFileSync('jsons/output.json',JSON.stringify({"words":result}),'utf8');
// });

const getParsedArray = (items, offset) => {
    const result = []
    for (let item of items) {
        const word = item.alternatives[0].content;
        if (item.start_time) {
            result.push(
                {
                    "word": item.alternatives[0].content,
                    "startTime": parseFloat(item.start_time) + offset + "",
                    "endTime": parseFloat(item.end_time) + offset + ""
                }
            )
        }
        else {
            result[result.length - 1].word = result[result.length - 1].word + word
        }
    }
    return result
}
