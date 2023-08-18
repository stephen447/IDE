import { getFunctionDeclarations } from "./getFunctionDeclarations"
export function getFunctionParameter(editor, lineNumber, declaredVariables,robotifyFunctions, manuallyimportedFunctions, alternativeModuleNames, userDefinedFunctions, undeclaredVariables){
    console.log("lineNum", lineNumber)
    let functionDeclarations = []
    let cursor = editor.getCursor()
    let numLines = cursor.line
    
    for(let lineNum = lineNumber; lineNum<numLines; lineNum++){ // Parsing the document
        //functionDeclarations = []
        let lineTokens = editor.getLineTokens(lineNum, true) // Get line tokens
        for(let tok = 0; tok<lineTokens.length; tok++){ //Parse each token in the line
            if(lineTokens[tok].type=='keyword'&&lineTokens[tok].string=='def'){
                for(tok = tok;tok<lineTokens.length; tok++){
                    if(lineTokens[tok].type=='variable'){
                        //functionDeclarations.push({text:lineTokens[tok].string, className:"function"})
                        functionDeclarations.push(lineTokens[tok].string)
                    }
                }
                lineNum++
                lineTokens = editor.getLineTokens(lineNum, true) // Get line tokens
                if(lineTokens.length>0){
                    while(lineTokens[0].type==null&&lineNum<=numLines){
                        console.log("erorr", lineTokens)
                        functionDeclarations = new Set(functionDeclarations);
                        let declarations = getFunctionDeclarations(lineTokens,declaredVariables,robotifyFunctions, manuallyimportedFunctions, alternativeModuleNames, userDefinedFunctions, functionDeclarations)
                        console.log("decs",declarations)
                        declarations = Array.from(declarations);
                        functionDeclarations = declarations//functionDeclarations.concat(declarations)
                        lineNum++;
                        lineTokens = editor.getLineTokens(lineNum, true) // Get line tokens
                        while(lineTokens.length==0&&lineNum<numLines){
                            lineNum++
                            lineTokens = editor.getLineTokens(lineNum, true)
                        }
                        if(lineTokens.length==0){
                            //functionDeclarations = []
                            break
                        }
                        else if(lineTokens[0].type!=null){
                            functionDeclarations = []
                            break
                        }
                    }
                    
                }
            }
        }
    }
    console.log("Function variables", functionDeclarations)
    return functionDeclarations
}