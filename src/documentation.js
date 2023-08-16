import robotifyFunctions from "./robotifyFunctions";
import { getImports } from "./getImports";
let alternativeModuleNames = new Set()
let manuallyimportedFunctions = new Set()

export function documentation(editor){
    // Get the click position
    var click = editor.cursorCoords()
    var click_coords = {left: click.left, top: click.top};
    var url = 'homepage' // Variable which is used for testing
    
    // Get the position of the click in the editor in terms of line and character index
    var db_click_position = editor.coordsChar(click_coords);
    var line = db_click_position.line
    var char = db_click_position.ch
    let imports = getImports(line, editor) // Getting the manually imported functions and alternative module names
    manuallyimportedFunctions = imports[0]
    alternativeModuleNames = imports[1] // Only search document up to the click position - as can NOT consider definition after the function has been used

    // Get the token at the click position
    var token = editor.getTokenAt({line: line, ch: char})
    console.log(token.type)
    // Check token to see if its a builtin function, can then redirect to corresponsing page
    if (token.type=='builtin'){
        var builtinFunction = token.string
        url = 'https://docs.python.org/3/library/functions.html#'+builtinFunction
        hiddenURL.innerHTML = url
        window.open(url)
    }
    // Check for other function calls
    else if(token.type=='property'||token.type=='variable'){
        let function_char = char-token.string.length-1 // get character of previous token
        let robotify_func = editor.getTokenAt({line:line, ch:function_char}) // Get previous token
        let robotifyIndividualFunc = editor.getTokenAt({line:line, ch:char}) // Manually imported functions
        if(robotifyFunctions.has(robotify_func.string)==true||alternativeModuleNames.has(robotify_func.string)==true||manuallyimportedFunctions.has(robotifyIndividualFunc.string)){
            // Open the robotify documentation
            url = 'https://www.robotify.com/'
            hiddenURL.innerHTML = url
            window.open(url)
            // Clear the imported modules and functions for the next scan
            manuallyimportedFunctions.clear()
            alternativeModuleNames.clear()
        }
    }
}
