export function getFunctionDeclarations(lineTokens, lineNum, declaredVariables,robotifyFunctions, manuallyimportedFunctions, alternativeModuleNames, userDefinedFunctions, undeclaredVariables){
    console.log("line tokens", lineTokens)
    let functionDeclarations = new Set()
    let functionUndeclaredVariables = []
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
                            if(getArrayDec(lineTokens, tok+1)==true){
                                functionDeclarations.add(token.string)
                                break
                            }
                            let lineDeclarations = [] // Array for string the line declarations - cases like x = y = s = 3
                            while(tok<lineTokens.length){ // Search the rest of the line for all declarations
                                let dec = getDeclaration(lineTokens, tok+1) //Get the declaration tokens
                                let declaration = dec[0] // Tokens
                                lineDeclarations.push(declaration) // Add the declaration to the declarations array
                                tok = dec[1] // Update the tok value - position in the line
                            }
                            
                            let finalDeclaration = lineDeclarations[lineDeclarations.length-1] // Get the final declaration to see if its valid - can then make decision on rest of declarations
                            let valid_declaration = true // Set the declaration to be valid - if there is 1 invalid tokens then set to false
                            if(finalDeclaration.length==0){
                                valid_declaration=false
                            }
                            for(let d=0; d<finalDeclaration.length; d++){ // Cycle through declarations
                                if(declaredVariables.has(finalDeclaration[d].string)||finalDeclaration[d].type=='number'||finalDeclaration[d].type=='string'||finalDeclaration[d].string=='true'||finalDeclaration[d].string=='false'||robotifyFunctions.has(finalDeclaration[d].string)||manuallyimportedFunctions.has(finalDeclaration[d].string)||alternativeModuleNames.has(finalDeclaration[d].string)||userDefinedFunctions.has(finalDeclaration[d].string)){ // If the yoken is a declared function, string or number its fine
                                    continue
                                }
                                else{ // Its invalid, its not a valid declaration set to false
                                    if(finalDeclaration[d].type=='variable'){
                                        undeclaredVariables.push(finalDeclaration[d].string, lineNum, finalDeclaration[d].start, finalDeclaration[d].end)
                                        
                                    }
                                    valid_declaration = false
                                }
                            }
                            if(valid_declaration==true){ // If the declaration is valid add it to the declared variables
                                functionDeclarations.add(token.string)
                                if(lineDeclarations.length>1){ // If there are multiple declarations add them all to declared list
                                    for(let dec=0; dec<lineDeclarations.length; dec++){
                                        let de = lineDeclarations[dec]
                                        for(let i = 0; i<de.length; de++){
                                            if(de[i].type=='variable'){
                                                functionDeclarations.add(de[i].string)
                                            }
                                        }
                                    }
                                }
                            }
                            else{ // Add to undeclared variables
                                functionUndeclaredVariables.push(token.string, lineNum, token.start, token.end)
                                if(lineDeclarations.length>1){
                                    for(let dec=0; dec<lineDeclarations.length; dec++){ // If there a multiple invalid imports, add all them to undeclared
                                        let de = lineDeclarations[dec]
                                        for(let i = 0; i<de.length; de++){
                                            if(de[i].type=='variable'){
                                                functionUndeclaredVariables.push(de[i].string, lineNum, de[i].start, de[i].end)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else{ // If next token not equals its not declared or being declared so add it to undeclared variables
                            if(token.type=='variable'){ // Add to the undefined list - maybe redundant
                                functionUndeclaredVariables.push(token.string, lineNum, token.start, token.end)
                            }
                        }
                    } 
                    else{ // If there are not more tokens on line - cant be declaration - add to undeclared list
                        functionUndeclaredVariables.push(token.string, lineNum, token.start, token.end)
                    }                
                }
                else{ // if length of line is less than 3, not a declaration so add to undeclared list
                    functionUndeclaredVariables.push(token.string, lineNum, token.start, token.end)
                }
            }
        }
        // Delete a deleted variable
        else if(token.type=='keyword'&&token.string=='del'){ // If function is 'del' - need to delete a variable from declared list
            let deletedVariable = getNextToken(lineTokens, tok+1)
            if(deletedVariable[0]==true){
                if(functionDeclarations.has(deletedVariable[1].string)){
                    functionDeclarations.delete(deletedVariable[1].string)
                    tok = deletedVariable[2]
                }
            }
            
        }
        else if(token.type=='keyword'&&token.string=='for'){ // Disregard FOR loop var - for x in range(0, 4):
            let forToken = getNextToken(lineTokens, tok+1)
            if(forToken[0]==true){
                functionDeclarations.add(forToken[1].string)
            }
            
            tok = forToken[2]
        }
        
        
        else if(token.type=="keyword"&&(token.string=="import"||token.string=="from")){ // Dont need to flag imported variables(modules&functions) as undefined
            break
        }
    }
    console.log("line declarations", functionDeclarations)
    return declaredVariables
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
function getArrayDec(tokens, tokenNum){
    /**
     * Array for checking if the array is an array declaration
     * fed linetokens and position of line
     * returns true or false if its a valid array declaration or not
     */
    let nextValidToken=""
    let lastValidToken=""

    let startToken=1
    let endToken=1
    if(tokens[tokenNum]!=undefined){
        startToken = tokens[tokenNum].string
    }
    if(tokens[tokenNum+1]!=undefined){
        endToken = tokens[tokenNum+1].string
    }
    if(startToken==" "){
        nextValidToken=endToken
    }
    else{
        nextValidToken=startToken
    }
    let len = tokens.length-1
    if(tokens[len].string==" "){
        lastValidToken=tokens[len-1].string
    }
    else{
        lastValidToken=tokens[len].string
    }
    if(nextValidToken=="["&&lastValidToken=="]"){
        return true
    }
    return false    
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