import robotifyFunctions from "./robotifyFunctions"
import {getImports} from "./documentation" 
/**
 * Edge cases
 * x=y=..
 * x = undeclared variable - undeclared not highlighted
 * check builtin functions
 */
export function getDeclaredVariables(editor){
    /**
     * This function parses the editor for declared and undeclared variables returns undeclared variables and their positions
     * It returns a list of undeclared variables
     */
    let undeclaredVariables = [] // Array for the undeclared variables
    let declaredVariables = new Set() // Set for keeping track of stored variables
    let userDefinedFunctions = new Set() // Set for user defined functions
    let numLines = editor.lineCount() // Get the total number of lines in editor
    let manuallyimportedFunctions = getImports(numLines, editor)[0] // Manually imported functions
    let alternativeModuleNames = getImports(numLines, editor)[1] // Alternative imported names

    for(let lineNum = 0; lineNum<numLines; lineNum++){ // Parsing the document
        let lineTokens = editor.getLineTokens(lineNum, true) // Get line tokens
        console.log(lineTokens)
        for(let tok = 0; tok<lineTokens.length; tok++){ 
            let token = lineTokens[tok]
            if(token.type=='variable'){ // If token is a variable and is defined, we can continue
                if(declaredVariables.has(token.string)||robotifyFunctions.has(token.string)||manuallyimportedFunctions.has(token.string)||alternativeModuleNames.has(token.string)||userDefinedFunctions.has(token.string)){ // If variable is declared - all good continue to the next token
                    continue
                }
                else{ // Else if it is a declaration of a variable
                    if(lineTokens.length>=3){ // Must have minimumn 3 tokens for declaration e.g. x=3
                        let nextTokEquals = getNextToken(lineTokens, tok+1) // Get the next token in the line
                        tok = nextTokEquals[2] // Updating the line position
                        if(nextTokEquals[0]==true){ // If there is a next token
                            if(nextTokEquals[1].string=="="){ // If its an equals - could be a declaration... continue
                                let lineDeclarations = [] // Array for string the line declarations - cases like x = y = s = 3
                                while(tok<lineTokens.length){ // Search the rest of the line for all declarations
                                    let dec = getDeclaration(lineTokens, tok+1) //Get the declaration tokens
                                    let declaration = dec[0] // Tokens
                                    lineDeclarations.push(declaration) // Add the declaration to the declarations array
                                    tok = dec[1] // Update the tok value - position in the line
                                }
                                
                                let finalDeclaration = lineDeclarations[lineDeclarations.length-1] // Get the final declaration to see if its valid - can then make decision on rest of declarations
                                console.log("final dec", finalDeclaration)
                                let valid_declaration = true // Set the declaration to be valid - if there is 1 invalid tokens then set to false
                                console.log("final dec length", finalDeclaration.length)
                                if(finalDeclaration.length==0){
                                    console.log("space")
                                    valid_declaration=false
                                }
                                for(let d=0; d<finalDeclaration.length; d++){ // Cycle through declarations
                                    console.log("hello")
                                    if(declaredVariables.has(finalDeclaration[d].string)||finalDeclaration[d].type=='number'||finalDeclaration[d].type=='string'||finalDeclaration[d].string=='true'||finalDeclaration[d].string=='false'||robotifyFunctions.has(finalDeclaration[d].string)||manuallyimportedFunctions.has(finalDeclaration[d].string)||alternativeModuleNames.has(finalDeclaration[d].string)||userDefinedFunctions.has(finalDeclaration[d].string)){ // If the yoken is a declared function, string or number its fine
                                        console.log("valid!")
                                        continue
                                    }
                                    else{ // Its invalid, its not a valid declaration set to false
                                        if(finalDeclaration[d].type=='variable'){
                                            undeclaredVariables.push(finalDeclaration[d].string, lineNum, finalDeclaration[d].start, finalDeclaration[d].end)
                                            
                                        }
                                        valid_declaration = false
                                    }
                                }
                                console.log("val", valid_declaration)
                                if(valid_declaration==true){ // If the declaration is valid add it to the declared variables
                                    declaredVariables.add(token.string)
                                    if(lineDeclarations.length>1){ // If there are multiple declarations add them all to declared list
                                        for(let dec=0; dec<lineDeclarations.length; dec++){
                                            let de = lineDeclarations[dec]
                                            for(let i = 0; i<de.length; de++){
                                                if(de[i].type=='variable'){
                                                    declaredVariables.add(de[i].string)
                                                }
                                            }
                                        }
                                    }
                                }
                                else{ // Add to undeclared variables
                                    console.log("invalid")
                                    undeclaredVariables.push(token.string, lineNum, token.start, token.end)
                                    if(lineDeclarations.length>1){
                                        for(let dec=0; dec<lineDeclarations.length; dec++){ // If there a multiple invalid imports, add all them to undeclared
                                            let de = lineDeclarations[dec]
                                            for(let i = 0; i<de.length; de++){
                                                if(de[i].type=='variable'){
                                                    undeclaredVariables.push(de[i].string, lineNum, de[i].start, de[i].end)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else{ // If next token not equals its not declared or being declared so add it to undeclared variables
                                if(token.type=='variable'){ // Add to the undefined list - maybe redundant
                                    undeclaredVariables.push(token.string, lineNum, token.start, token.end)
                                }
                            }
                        } 
                        else{ // If there are not more tokens on line - cant be declaration - add to undeclared list
                            undeclaredVariables.push(token.string, lineNum, token.start, token.end)
                        }                
                    }
                    else{ // if length of line is less than 3, not a declaration so add to undeclared list
                        undeclaredVariables.push(token.string, lineNum, token.start, token.end)
                    }
                }
            }
            // Delete a deleted variable
            else if(token.type=='keyword'&&token.string=='del'){ // If function is 'del' - need to delete a variable from declared list
                let deletedVariable = getNextToken(lineTokens, tok+1)
                if(deletedVariable[0]==true){
                    if(declaredVariables.has(deletedVariable[1].string)){
                        declaredVariables.delete(deletedVariable[1].string)
                        tok = deletedVariable[2]
                    }
                }
                
            }
            else if(token.type=='keyword'&&token.string=='for'){ // Disregard FOR loop var - for x in range(0, 4):
                let forToken = getNextToken(lineTokens, tok+1)
                if(forToken[0]==true){
                    declaredVariables.add(forToken[1].string)
                }
                
                tok = forToken[2]
            }
            else if(token.type=='def'){ // If its a function definition - add to user defined functions set
                userDefinedFunctions.add(token.string)
            }
            
            else if(token.type=="keyword"&&(token.string=="import"||token.string=="from")){ // Dont need to flag imported variables(modules&functions) as undefined
                break
            }
        }
    }
    console.log("Undeclared", undeclaredVariables)
    return undeclaredVariables // Return list of undeclared variable
}

function getNextToken(tokens, tokenNum){
    /**
     * This function get the next non bracket and non space variable token on a line
     * Its paramters are the line tokens (tokens) and the position the main function is at in the line (tokenNum)
     * It returns true/false - if there is another non-bracket/non-space token on the line, the the next token, and the new position of the string
     */
    for(let i = tokenNum; i<tokens.length; i++){
        if(tokens[i].string!=" "&&tokens[i].string!="("&&tokens[i].string!=")"){
            return [true, tokens[i], i]
        }
    }
    return [false, null, tokenNum]
}

function getDeclaration(tokens, tokenNum){
    /**
     * This function gets the declaration tokens for a declaration
     * Its paramters are the line tokens (tokens) and the position the main function is at in the line (tokenNum)
     * It returns the tokens in the declaration array and the updated position on the line
     */
    let declaration = [] // Array for storing the tokens
    
    while(tokenNum<tokens.length){
        if(tokens[tokenNum].string=='='){ // End of declaration
            break
        }
        else{ // Add token to current declaration
            if(tokens[tokenNum].type=='variable'||tokens[tokenNum].type=='number'||tokens[tokenNum].type=='string'){
                declaration.push(tokens[tokenNum])
            }
            tokenNum++ // Increment line position
        }
        
    }
    return [declaration, tokenNum] 

}
