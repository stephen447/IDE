export function getModuleObjects(editor){
    /**
     * This function gets the imported modules and the alternative names stored as an array of objects
     * Its passed the codeMirror editor instance
     * It returns an array of objects and 
     */
    
    let totalNumberLines = editor.lineCount() // Number of lines in the editor
    var moduleObjects = [] // Array to store the objects
    for(let lineNum = 0; lineNum<totalNumberLines; lineNum++){ // Going through the the editor looking for imports
        let lineTokens = editor.getLineTokens(lineNum, true) // Getting the line tokens
        //Getting rid of comments at the end of lines
        for(let i=0; i<lineTokens.length; i++){
            if(lineTokens[i].type=='comment'){
                lineTokens = lineTokens.slice(0, i)
                break;
            }
        }
        //Getting rid of spaces at the end of lines
        if(lineTokens.length>0){
            if(lineTokens[lineTokens.length-1].string == ' '){
                lineTokens.pop()
            }
        }
        
        let start = 0 // Start position of the line - used for skipping white spaces/tab indents
        if(lineTokens.length>2){ // If there is more than 2 tokens it could be an import
            let startToken = lineTokens[0].string // Getting the start token
            let startTokenType = lineTokens[0].type // Getting first token type for identifying tab indent
            if(startToken==' '||startTokenType==null){ // If start token is a space/tab indent - shift starttoken by 1
                start++
                startToken = lineTokens[1].string
            }
            if(lineTokens.length>=6){ //If more than 6 tokens in the line
                if(startToken=='import'){
                    if(lineTokens[start+4].string=='as'){ // If there is an alternative name, need to store otherwise it is stored
                        moduleObjects.push({text:lineTokens[start+2].string, className:"module",alternative:lineTokens[start+6].string}) // Push object to array
                    }
                    else{ // If a multiple import
                        let tokenNum = start
                        while(tokenNum<lineTokens.length){ // While there are imports add them to the list
                            let token = getNextToken(lineTokens, tokenNum+1) 
                            tokenNum = token[2] // Update iterator
                            if(token[0]==true){ // If valid import
                                moduleObjects.push({text:token[1].string, className:"module",alternative:'null'}) // Push object to array
                            }
                            else{ //break if not a valid import or line ended
                                break
                            }
                        }
                    }
                }
                // If importing functions, add the module being imported from
                else if(startToken=='from'){
                    if(lineTokens[start+2].type=='variable'){
                        let altDuplicate = moduleObjects.find(element=>element.alternative==lineTokens[start+2].string) // See if module being imported from is an alternative name thats already imported
                        if(altDuplicate==undefined){ // If not an alternative, push object
                            moduleObjects.push({text:lineTokens[start+2].string, className:"module",alternative:'null'})
                        }
                    }   
                }
            }
            else if(lineTokens.length==3||lineTokens.length==4){ // Else if its a single import - 3/4 tokens depending on space at start of line
                if(lineTokens.length==3&&lineTokens[0].string=="import"){
                    moduleObjects.push({text:lineTokens[2].string, className:"module",alternative:"null"})
                }
                else if(lineTokens.length==4&&lineTokens[1].string=="import"){
                    moduleObjects.push({text:lineTokens[3].string, className:"module",alternative:"null"})
                }
            }
        }
    }
    return moduleObjects
}

function getNextToken(tokens, tokenNum){
    /**
     * This function get the next non bracket and non space token on a line
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
