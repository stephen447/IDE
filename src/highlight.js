import { getUnusedFunctionPositions} from "./getUnusedFunctionPositions";
import { getUndeclaredVariablesPositions } from "./getUndeclaredVariablesPositions";
import { getUnusedImportsPositions } from "./getUnusedImportsPositions";
export function highlight(editor)
{
    /**
     * This function parses through code in editor and places the appropriate marks on the editor
     * The editor is passed as a parammeter
     */
    
    let docu = editor.getDoc() // get the editor document
    docu.getAllMarks().forEach(marker => marker.clear()); // Clear all old markers so new one can be put on 

    let unusedFunctions = getUnusedFunctionPositions(editor) // Get the unused functions and positions to mark
    let undeclaredVariables = getUndeclaredVariablesPositions(editor)[0] // Get the undeclared variables and positions to mark
    let unusedImports = getUnusedImportsPositions(editor) // Get unused imports and positions

    //TESTING
    const undVars = document.getElementById("undeclaredVariables"); 
    undVars.innerHTML = undeclaredVariables

    // Making the marks
    // Unused functions
    for(let markerNumber = 0; markerNumber<unusedFunctions.length; markerNumber=markerNumber+4){
        let markerLine = unusedFunctions[markerNumber+1]
        let markerStart = unusedFunctions[markerNumber+2]
        let markerEnd = unusedFunctions[markerNumber+3]
        docu.markText({line:markerLine,ch:markerStart,sticky: null}, {line:markerLine,ch:markerEnd, sticky: null}, {css:"filter: brightness(50%)"})
    }
    // Unused imports
    for(let markerNumber = 0; markerNumber<unusedImports.length; markerNumber=markerNumber+4){
        let markerLine = unusedImports[markerNumber+1]
        let markerStart = unusedImports[markerNumber+2]
        let markerEnd = unusedImports[markerNumber+3]
        docu.markText({line:markerLine,ch:markerStart,sticky: null}, {line:markerLine,ch:markerEnd, sticky: null}, {css:"filter: brightness(50%)"})
    }
    // Undeclared variables
    for(let markerNumber = 0; markerNumber<undeclaredVariables.length; markerNumber=markerNumber+4){
        let markerLine = undeclaredVariables[markerNumber+1]
        let markerStart = undeclaredVariables[markerNumber+2]
        let markerEnd = undeclaredVariables[markerNumber+3]
        docu.markText({line:markerLine,ch:markerStart,sticky: null}, {line:markerLine,ch:markerEnd, sticky: null}, {css:"text-decoration: underline; text-decoration-color: yellow;text-decoration-thickness: 0.29rem;"})
    }
}