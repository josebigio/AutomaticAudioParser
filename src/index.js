import fs from "fs"
import { getAllFileNames, getJSONOutputFromS3File } from './aws_utils'
import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";


const FILE_DIR = "./fear_and_loathing";
const LENGHT_OF_FILE = 3600
const AWS_PREFIX = "fear and loathing in las vegas/transcription/"

getAllFileNames(AWS_PREFIX).then(listOfFilesNames => {
    const fileNamesPromises = listOfFilesNames.map((fileName) => {
        return getJSONOutputFromS3File(fileName)
    });
    return Promise.all(fileNamesPromises);
}).then(fileJsons => {
    console.log("got responses")
    var result = []
    for (var i = 0; i < fileJsons.length; i++) {
        const items = fileJsons[i].results.items
        const parsedArray = getParsedArray(items, i * LENGHT_OF_FILE)
        result = result.concat(parsedArray)
    }
    fs.writeFileSync('output.json',JSON.stringify({"words":result}),'utf8');
});

// getAllFileNames(AWS_PREFIX).then(result => {
//    return result[0]
// }).then(fileName => {
//     return getJSONOutputFromS3File(fileName)
// })
// .then(output => {
//     console.log(output)
// })
// fs.readdir(FILE_DIR, function(err, items) {
//     let result = []
//     for (var i=0; i<items.length; i++) {
//         const fileItems = getItemsFromFile(FILE_DIR + "/" + items[i])
//         const parsedArray = getParsedArray(fileItems, i*LENGHT_OF_FILE)
//         result = result.concat(parsedArray)
//     }
//     fs.writeFileSync('output.json',JSON.stringify({"words":result}),'utf8');
// });

const getItemsFromFile = (filePath) => {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const items = json.results.items
    return items
}

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
