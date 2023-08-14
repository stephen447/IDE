export function getUnusedFunctionPositions(editor){
    /**
     * Function to get the defined functions and returns the unused ones of them and their positions
     * The editor is passed as a parameter
     * It returns the unused functions and their positions of the document
     */
    let unusedUserDefinedFunctions = [] // Array to store user defined functions
    const totalNumLines = editor.lineCount() // Number of lines in editor
    // Search through editor for user defined funtion definitions and instances of these functions
    for(let lineNumber=0; lineNumber<totalNumLines; lineNumber++){
        let lineTokens = editor.getLineTokens(lineNumber, true) // Get the line tokens
        for(let tokenNumber = 0; tokenNumber<lineTokens.length; tokenNumber++){
            let token = lineTokens[tokenNumber]
            if(token.type=='def'){ // If its a definition, add it to the unusedUserDefinedFunctions array along with line, start char, end char
                unusedUserDefinedFunctions.push(token.string, lineNumber, token.start, token.end)
                continue
            }
            else if(token.type=='variable'){ // Else if its an instance, remove from array as the function is used
                for(let arrayIndex=0; arrayIndex<unusedUserDefinedFunctions.length; arrayIndex=arrayIndex+4){
                    if(unusedUserDefinedFunctions[arrayIndex]==token.string){
                        unusedUserDefinedFunctions.splice(arrayIndex, 4)
                        continue
                    }
                }
            }
        }
    }
    // TESTING
    const unusedFunctions = document.getElementById("unusedFunctions");
    unusedFunctions.innerHTML = unusedUserDefinedFunctions
    return unusedUserDefinedFunctions
}