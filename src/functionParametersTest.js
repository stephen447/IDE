export function getFunctionParameter(editor){
    let functionVariables = []
    let numLines = editor.lineCount() // Get the total number of lines in editor
    let cursor = editor.getCursor()
    numLines = cursor.line
    
    for(let lineNum = 0; lineNum<numLines; lineNum++){ // Parsing the document
        functionVariables = []
        let lineTokens = editor.getLineTokens(lineNum, true) // Get line tokens
        for(let tok = 0; tok<lineTokens.length; tok++){ //Parse each token in the line
            if(lineTokens[tok].type=='keyword'&&lineTokens[tok].string=='def'){
                for(tok = tok;tok<lineTokens.length; tok++){
                    if(lineTokens[tok].type=='variable'){
                        functionVariables.push({text:lineTokens[tok].string, className:"function"})
                    }
                }
                lineNum++
                lineTokens = editor.getLineTokens(lineNum, true) // Get line tokens
                if(lineTokens.length>0){
                    while(lineTokens[0].type==null&&lineNum<numLines){
                        for(let vartoken = 0; vartoken<lineTokens.length; vartoken++){
                            if(lineTokens[vartoken].type=='variable'){
                                functionVariables.push({text:lineTokens[vartoken].string, className:"function"})
                            }
                        }
                        lineNum++;
                        lineTokens = editor.getLineTokens(lineNum, true) // Get line tokens
                        while(lineTokens.length==0&&lineNum<numLines){
                            lineNum++
                            lineTokens = editor.getLineTokens(lineNum, true)
                        }
                        if(lineTokens.length==0){
                            functionVariables = []
                            break
                        }
                        else if(lineTokens[0].type!=null){
                            functionVariables = []
                        }
                    }
                    
                }
            }
        }
    }
    console.log("Function variables", functionVariables)
    return functionVariables
}