import robotifyFunctions from './robotifyFunctions';

export function getImports(totalNumLines, editor){
    /**
     * Function which get the alternative names of the imported robotify modules and the names of the manually importing functions from robotify modules
     * Parameter totalNumLines - line number which was clicked on
     */
    var moduleObjects = []
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
                    moduleObjects.push({name:lineTokens[start+2].string, className:"module",alternative:lineTokens[start+6].string})
                    alternativeModuleNames.add(lineTokens[start+6].string)
                    alternativeModuleNames.add(lineTokens[start+2].string)
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
            
        } // else if it a standard import - 'import x'
        else if(lineTokens.length==3||lineTokens.length==4){ //Length of 3/4 depending if there is a space at the beginning
            if(lineTokens.length==3&&lineTokens[0].string=="import"){
                alternativeModuleNames.add(lineTokens[2].string)
            }
            else if(lineTokens.length==4&&lineTokens[1].string=="import"){
                alternativeModuleNames.add(lineTokens[3].string)
            }
        }
        else if(lineTokens.length>4){
            // If an imported function has been redefined it overrides the module imported function, so delete from list
            if(lineTokens[start+2].type=='def'){
                if(manuallyimportedFunctions.has(lineTokens[start+2].string)){
                    manuallyimportedFunctions.delete(lineTokens[start+2].string)
                }
            }
        }
    }
    console.log("Module objects!", alternativeModuleNames)
    return [manuallyimportedFunctions, alternativeModuleNames]
}

