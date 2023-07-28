import robotifyFunctions from './robotifyFunctions';

export function getImports(totalNumLines, editor){
    /**
     * Function which get the alternative names of the imported robotify modules and the names of the manually importing functions from robotify modules
     * Parameter totalNumLines - line number which was clicked on
     */
    var alternativeModuleNames = new Set() // Set for the alternative module names
    var manuallyimportedFunctions = new Set() // Set for the manually imported functions from modules
    
    for(let lineNum = 0; lineNum<totalNumLines; lineNum++){ // Going through the the editor looking for imports
        let lineTokens = editor.getLineTokens(lineNum, true) // Getting the line tokens
        let start = 0 // Start position of the line - used for skipping white spaces/tab indents
    
        if(lineTokens.length>6){ // Need minimum six tokens in a line for an import
            let startToken = lineTokens[0].string // Getting the start token
            let startTokenType = lineTokens[0].type // Getting first token type for identifying tab indent
            if(startToken==' '||startTokenType==null){ // If start token is a space/tab indent - shift starttoken by 1
                start++
                startToken = lineTokens[1].string
            }
            // 2 import cases - 'import x as y', 'from x import y...'
            if(startToken=='import'){
                if(lineTokens[start+4].string=='as'){ // If there is an alternative name, need to store otherwise it is stored
                    if(robotifyFunctions.has(lineTokens[start+2].string)==true){ // If its stored already, no need to duplicate
                        alternativeModuleNames.add(lineTokens[start+6].string)
                    }
                }
            }
            // If importing from a robotify module or another imported module
            else if(startToken=='from'&&(robotifyFunctions.has(lineTokens[start+2].string)||alternativeModuleNames.has(lineTokens[start+2].string||lineTokens[start+2].type=='variable'))){
                for(let lineTokenNum = start+6; lineTokenNum<lineTokens.length; lineTokenNum++){ // search through rest of the line for functions
                    if(lineTokens[lineTokenNum].string!=','&&lineTokens[lineTokenNum].string!='*'&&lineTokens[lineTokenNum].string!=' '&&lineTokens[lineTokenNum].type!='comment'){ // If the import is a function, add to functions list
                        manuallyimportedFunctions.add(lineTokens[lineTokenNum].string)
                    }
                }
            }
            // If an imported function has been redefined it overrides the module imported function, so delete from list
            else if(lineTokens[start+2].type=='def'){
                if(manuallyimportedFunctions.has(lineTokens[start+2].string)){
                    manuallyimportedFunctions.delete(lineTokens[start+2].string)
                }
            }
        } // else if it a standard import - 'import x'
        else if(lineTokens.length==3||lineTokens.length==4){ //Length of 3/4 depending if there is a space at the beginning
            if(lineTokens.length==3&&lineTokens[0].string=="import"){
                alternativeModuleNames.add(lineTokens[2].string)
            }
            else if(lineTokens.length==4&&lineTokens[1].string=="import"){
                alternativeModuleNames.add(lineTokens[3].string)
            }
        }
    }
    return [manuallyimportedFunctions, alternativeModuleNames]
}

export function getImportPositions(editor){
    /**
     * Function retrieve the positions in the editor of the imported functions and module and return the position of the one 
     * The editor for which its parse its fed as a parameter
     * It returns the the array with the imported tokens and their positions
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
                    else if(nextToken.type=="variable"){ // If token is a variable - multiple imports
                        while(tok<lineTokens.length){ // Cycle through all imports
                            token = getNextToken(lineTokens, tok) // Get next import
                            nextToken = token[1]
                            tok = token[2]
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
