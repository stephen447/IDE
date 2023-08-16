export function getUnusedImportsPositions(editor){
    /**
     * Function retrieves the positions in the editor of the imported functions and module and returns the position of the functions not used
     * Parameters: The editor for which its parse its fed as a parameter
     * It returns an array with the imported tokens and their positions
     */
    let importPos = [] // Array to store the import string and position in the editor
    let numLines = editor.lineCount() // Number of lines in the editor
    for(let lineNum = 0; lineNum<numLines; lineNum++){ // Parsing through the lines in the editor
        let lineTokens = editor.getLineTokens(lineNum, true) // Get the tokens in each line
        for(let tok = 0; tok<lineTokens.length; tok++){ // Going through each token in the line
            if(lineTokens[tok].type=='keyword'&&lineTokens[tok].string=='import'){ // If the token is import, need to get the module/functions which follow
                let token = getNextToken(lineTokens, tok+1) // Get the next token which is not a space or bracket
                if(token[0]==true){ // If there is a next token
                    let nextToken = token[1]
                    tok = token[2] // Update the position in the line
                    importPos.push(nextToken.string, lineNum, nextToken.start, nextToken.end) // Push the token and correpsonding positioning details
                }

                token = getNextToken(lineTokens, tok+1) // Get the next token
                if(token[0]==true){ // If the token is valid
                    let nextToken = token[1]
                    tok = token[2] // Update the position in the line
                    if(nextToken.type=="keyword"&&nextToken.string=="as"){ // If the 
                        token = getNextToken(lineTokens, tok+1) // Get the next token
                        if(token[0]==true){ // If there is a next token
                            nextToken = token[1]
                            tok = token[2] // Update the position the line
                            if(nextToken.type=='variable'){ // If the token is a variable, add the imported array
                                importPos.push(nextToken.string, lineNum, nextToken.start, nextToken.end)
                            }
                        }
                    }
                    else if(nextToken.type=="variable"){ // If next token after initial import is a variable - multiple imports
                        while(tok<lineTokens.length){ // Cycle through all imports
                            token = getNextToken(lineTokens, tok) // Get next import
                            nextToken = token[1]
                            tok = token[2] // Update the position the line
                            if(nextToken.type=='variable'){ //Push the import and positioning
                                importPos.push(nextToken.string, lineNum, nextToken.start, nextToken.end)
                            }
                            tok++ // Increment position in the line
                        }
                    }
                }
            }
            else if(lineTokens[tok].type=='variable'){ // If an instance of the imported module can remove from list, doesnt need to be dulled
                for(let arrayIndex=0; arrayIndex<importPos.length; arrayIndex=arrayIndex+4){
                    if(importPos[arrayIndex]==lineTokens[tok].string){
                        importPos.splice(arrayIndex, 4)
                        continue
                    }
                }
            }
        }
    }
    //TESTING
    const testImports = document.getElementById("testImports");
    testImports.innerHTML = importPos
    
    return importPos 
}

function getNextToken(tokens, tokenNum){
    /**
     * This function get the next non bracket and non space variable token on a line
     * Its paramters are the line tokens (tokens) and the position the main function is at in the line (tokenNum)
     * It returns true/false - if there is another non-bracket/non-space token on the line, the the next token, and the new position of the string
     */
    for(let i = tokenNum; i<tokens.length; i++){
        if(tokens[i].string!=" "&&tokens[i].string!="("&&tokens[i].type!=null){
            return [true, tokens[i], i]
        }
    }
    return [false, null, tokenNum]
}
