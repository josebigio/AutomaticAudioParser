import fs from "fs"

const FILE_DIR = "./fear_and_loathing";
const LENGHT_OF_FILE = 3600

fs.readdir(FILE_DIR, function(err, items) {
    let result = []
    for (var i=0; i<items.length; i++) {
        const fileItems = getItemsFromFile(FILE_DIR + "/" + items[i])
        const parsedArray = getParsedArray(fileItems, i*LENGHT_OF_FILE)
        result = result.concat(parsedArray)
    }
    fs.writeFileSync('output.json',JSON.stringify({"words":result}),'utf8');
});

const getItemsFromFile = (filePath) => {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const items = json.results.items
    return items
}

const getParsedArray = (items, offset) => {
    const result = []
    for(let item of items) {
        const word = item.alternatives[0].content;
        if( item.start_time ) {
            result.push(
                {
                "word": item.alternatives[0].content,
                "startTime": parseFloat(item.start_time) + offset + "",
                "endTime": parseFloat(item.end_time) + offset + ""
                }
            )
        }
        else {
            result[result.length-1].word = result[result.length-1].word + word
        }
    }
    return result
}
