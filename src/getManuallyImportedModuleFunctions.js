export function getManuallyImportedModuleFunctions(editor){
    /**
     * This functions get the manually imported functions from modules e.g. from axel import move_forward
     * It takes the editor as a parameter
     * returns an array of objects with the manually imported functions
     */
    let importedFunctions = [] //Array for stroing function objects
    let numLines = editor.lineCount() // Get the total number of lines in editor
    for(let lineNum=0; lineNum<numLines; lineNum++){
        let lineTokens = editor.getLineTokens(lineNum, true) // Get the line tokens
        if(lineTokens.length>5){ // If more than 5 line tokens - minimum needed for 'from x import y'
            let startToken = lineTokens[0] // Get the start token
            if(lineTokens[0].type==null){ // If the start token type is a space - shift start token to the next token
                startToken = lineTokens[1]
            }
            if(startToken.string=="from"){ // If start token is 'from' could be manually imported function on this line
                let imports = getImportedFunctions(lineTokens) // Line imports
                importedFunctions=importedFunctions.concat(imports) // Add to imported functions
            }
        }
    }
    return importedFunctions 
}
function getImportedFunctions(lineTokens){
    /**
     * Traverses the line tokens searching for functions
     * takes the line tokens as an parameter
     * returns the imported functions from that line
     */
    let importedFunctions = [] // Array for storing functions
    for(let i=4;i<lineTokens.length; i++){ // Traverse the line
        if(lineTokens[i].type=='variable'){ // If its a variable, its a function - stroe in array as object
            importedFunctions.push({text:lineTokens[i].string, className:'function', alternative:'null'})
        }
    }
    return importedFunctions
}