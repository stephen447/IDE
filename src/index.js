// index.js contains the code for the two editors & for font size & style submission
import CodeMirror from "codemirror";
import "../index.css";
import 'codemirror/mode/python/python.js';
//css imports
import 'codemirror/lib/codemirror.css';
import './theme.css';
import './constTheme.css';
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/lint/lint.css'
//fold imports
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js';
//brackets imports
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
//search imports
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
//auto complete
import 'codemirror/addon/hint/show-hint.js'
import { hintFunc } from "./hinting.js";
//linting
import 'codemirror/addon/lint/lint.js'
import { parse } from "./errorChecker.js"
// Undeclared vaiables
import {getDeclaredVariables} from "./undeclaredVariables"
// Highlighting unused variables
import { getImports } from "./documentation";

import './themeEditor.js'
import {setFont} from './themeEditor.js'
//Robotify functions
import robotifyFunctions from './robotifyFunctions.js'
let alternativeModuleNames = new Set()
let manuallyimportedFunctions = new Set()

import { getImportPositions } from "./documentation";

import { getImportedModules } from "./getImportedModules";



//Hidden HTML element for keeping state of the redirect URL's for documentation which is used for verification and testing functionality
const hiddenURL = document.getElementById("hiddenURL");
hiddenURL.innerHTML = "home"
let startCo = ``
//initial code put into the editor
let startCode = `import codeMirror # Standard import
import axel # Standard Robotify import
import math as m # Alternative standard import
import byte as b # Alternative Robotify import
import numpy, tensorflow # Multiple standard imports
import deliveries, spaceship # Multiple Robotify imports
from deliveries import get_distance # Simple manual import
from b import catch_ball, drop_ball # Multiple manual import

catch_ball # Robotify function
x=y
standardDefinition=4 # Standard definition
print(standardDefinition)
x = h = 5 # Valid multiple declaration
st = sh = sb # Invalid multiple declaration

validVariableDefinition = x
stringDefinition = "hello"
invalidVariableDefinition = st
validIntVarDefinition = 4*x
invalidIntVarDefinition = 4*st
del(x)
print(x)

def user_function(): # User defined function
    return 1

for y in range(0, z): # For loop
    print(y)

`
let startCod = 
` import flex # Simple import
import   chess # Multiple spaces between 'import' and the module
import axel as axel_robot # Alternative name for module
import deliveries, spaceship # Multiple imports
from deliveries import get_distance # Simple manual import
from axel_robot import move_robot_forward # Using alternative name to manually import
from byte import catch_ball, drop_ball # Multiple manual import
import codeMirror # Non-robotify module
from codeMirror import markText # Non-Robotify function
# Testing Imports
flex.move_forward()
chess.queen
axel_robot.move_robot_backwards()
move_robot_forward()
spaceship.get_height()
drop_ball()
codemirror.Editor
markText

def move_robot_forward():
    return 4

x = move_robot_forward

# Python functions
dir(codeMirror)
absoluteValue = abs(-5)
type(absoluteValue)
print(len(absoluteValue))

# Empty list of animal locations.
animal_locations = []
def x():
    return 4


absoluteValue = abs(-5)
for x in range(3):
	# Sense
	sensor_object = flex.get_sensor_name()
	# Compute
	if sensor_object == "animal":
		# Act
		# Move to the animal.
		distance = flex.get_sensor_distance()
		flex.move_forward(distance)
		
		# Add the animal location to the list.
		coordinates = flex.get_coordinates()
		animal_locations.append(coordinates)
	else:
		# Act
		flex.turn(90)

# Print the collected animal locations.
print(animal_locations)
`



//the editor on the left, does not respond to CSS changes
export var originalEditor = CodeMirror(document.getElementById("originalEditor"), {
    value: startCode,
    mode:  "python",
    lineNumbers: true,
    foldGutter: true,
    matchBrackets: true, // Highlights
    autoCloseBrackets: true,
    search: true,
    lint: true, //uses CodeMirror.lint.mode, in this case CodeMirror.lint.python
    extraKeys: {
        "Esc": function(cm) {cm.display.input.blur()},  //leave focus on the editor with Esc
        "Ctrl-Space": async function(cm) { cm.showHint({
            hint: hintFunc,         // show autocompletion
            completeSingle: false   //does not autocomplete when there is only a single match
        })},
        "LeftTripleClick": function(){
            // Get the click position
            var click_coord = originalEditor.cursorCoords()
            var click_coords = {left: click_coord.left, top: click_coord.top};
            var url = 'homepage'
            
            // Get the position of the click in the editor in terms of line and character index
            var db_click_position = originalEditor.coordsChar(click_coords);
            var line = db_click_position.line
            var char = db_click_position.ch
            manuallyimportedFunctions = getImports(line, originalEditor)[0]
            alternativeModuleNames = getImports(line, originalEditor)[1] // Only search document up to the click position - as can NOT consider definition after the function has been used

            // Get the token at the click position
            var token = originalEditor.getTokenAt({line: line, ch: char})
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
                let function_char = char-token.string.length-1
                let robotify_func = originalEditor.getTokenAt({line:line, ch:function_char})
                let robotifyIndividualFunc = originalEditor.getTokenAt({line:line, ch:char})
                if(robotifyFunctions.has(robotify_func.string)==true||alternativeModuleNames.has(robotify_func.string)==true||manuallyimportedFunctions.has(robotifyIndividualFunc.string)){
                    // Open the robotify documentation
                    url = 'https://www.robotify.com/'
                    hiddenURL.innerHTML = url
                    window.open(url)

                    //console.log(manuallyimportedFunctions)
                    //console.log(alternativeModuleNames)
                    // Clear the imported modules and functions for the next scan
                    manuallyimportedFunctions.clear()
                    alternativeModuleNames.clear()
                }
            }
        }
    },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
    theme: "constTheme"
});


//the editor on the right, DOES respond to CSS changes
var previewEditor = CodeMirror(document.getElementById("previewEditor"), {
    value: originalEditor.getDoc().linkedDoc(), //makes changes in one affect the other
    mode:  "python",
    lineNumbers: true,
    foldGutter: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    search: true,
    lint: true,
    styleSelectedText: true,
    extraKeys: {
        "Esc": function(cm) {cm.display.input.blur()},
        "Ctrl-Space": async function(cm) { cm.showHint({
            hint: hintFunc,
            completeSingle: false
        })},
        "LeftTripleClick": function(){
            /**
             * Get the click position, get the token at the click position, if token is a builtin, redirect otherwise do nothing
             */
            // Get the click position
            getAlternativeImports
            var click_coord = previewEditor.cursorCoords()
            var click_coords = {left: click_coord.left, top: click_coord.top};
            
            // Get the position of the click in the editor in terms of line and character index
            var db_click_position = previewEditor.coordsChar(click_coords);
            var line = db_click_position.line
            var char = db_click_position.ch

            // Get the token at the click position
            var token = previewEditor.getTokenAt({line: line, ch: char})
            //console.log(token.type)
            // Check token to see if its a builtin function, can then redirect to corresponsing page
            //console.log(token.type)
            if (token.type=='builtin'){
                var keyword = token.string
                var url = 'https://docs.python.org/3/library/functions.html#'+keyword
                window.open(url)
            }
        }
    },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
    theme: "theme"
});
originalEditor.setSize(null, 700);
previewEditor.setSize(null, 700);


const booleanForm = document.getElementById("booleanForm");
booleanForm.addEventListener('submit', (e) => {

    //prevent page refresh
    e.preventDefault();

    let lint = e.target.linting.checked;
    let autocomplete = e.target.autocomplete.checked;

    setEditorsOptions("lint", lint);
    setAutocomplete(autocomplete);
    
    //keep things working properly
    originalEditor.refresh();
    previewEditor.refresh();
  
})


//sets options for BOTH editors
function setEditorsOptions(option, value)
{
    originalEditor.setOption(option, value);
    previewEditor.setOption(option, value);
}

function setAutocomplete(shouldAutocomplete)
{
    if(shouldAutocomplete)
    {
        originalEditor.options.extraKeys["Ctrl-Space"] = async function(cm) { cm.showHint({
            hint: hintFunc,
            completeSingle: false
        })}
        previewEditor.options.extraKeys["Ctrl-Space"] = async function(cm) { cm.showHint({
            hint: hintFunc,
            completeSingle: false
        })}
    }
    else
    {
        originalEditor.options.extraKeys["Ctrl-Space"] = null;
        previewEditor.options.extraKeys["Ctrl-Space"] = null;
    }
}

function highlight(editor)
{
    /**
     * This function parses through code in editor and places the appropriate marks on the editor
     * The editor is passed as a parammeter
     */
    
    let docu = editor.getDoc()
    docu.getAllMarks().forEach(marker => marker.clear());

    let unusedFunctions = getUnusedFunctions(editor) // Get the unused functions and positions to mark
    let undeclaredVariables = getDeclaredVariables(editor) // Get the undeclared variables and positions to mark
    console.log(undeclaredVariables)
    let unusedImports = getImportPositions(editor) // Get unused imports and positions
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
        docu.markText({line:markerLine,ch:markerStart,sticky: null}, {line:markerLine,ch:markerEnd, sticky: null}, {css:"text-decoration: underline; text-decoration-color: yellow;text-decoration-thickness: 0.27rem;"})
    }
    
}

function getUnusedFunctions(editor){
    /**
     * Function to get the defined functions and returns the unused ones of them and their positions
     * The editor is passed as a parameter
     * It returns the unused functions and their positions of the document
     */
    let unusedUserDefinedFunctions = [] // Array to store user defined functions
    const totalNumLines = editor.lineCount() // Number of lines in editor
    // Search through editor for user defined funtion definitions and instances of these functions
    for(let lineNumber=0; lineNumber<totalNumLines; lineNumber++){
        let lineTokens = editor.getLineTokens(lineNumber, true) // Get the line tokens
        for(let tokenNumber = 0; tokenNumber<lineTokens.length; tokenNumber++){
            let token = lineTokens[tokenNumber]
            if(token.type=='def'){ // If its a definition, add it to the unusedUserDefinedFunctions array along with line, start char, end char
                unusedUserDefinedFunctions.push(token.string, lineNumber, token.start, token.end)
                continue
            }
            else if(token.type=='variable'){ // Else if its an instance, remove from array as the function is used
                for(let arrayIndex=0; arrayIndex<unusedUserDefinedFunctions.length; arrayIndex=arrayIndex+4){
                    if(unusedUserDefinedFunctions[arrayIndex]==token.string){
                        unusedUserDefinedFunctions.splice(arrayIndex, 4)
                        continue
                    }
                }
            }
        }
    }
    const unusedFunctions = document.getElementById("unusedFunctions");
    unusedFunctions.innerHTML = unusedUserDefinedFunctions
    return unusedUserDefinedFunctions
}
highlight(originalEditor) // Make initial highlights
originalEditor.on("changes", ()=>highlight(originalEditor)) // Update highlights whenever a change is made in the editor
highlight(previewEditor) // Make initial highlights
previewEditor.on("changes", ()=>highlight(originalEditor)) // Update highlights whenever a change is made in the editor
getImportedModules()
//form submitting font size & font style
const fontSizeForm = document.getElementById("fontSizeForm");
fontSizeForm.addEventListener('submit', (e) => {

  //stop page refresh on submit
  e.preventDefault();

  let index = e.target.fonts.selectedIndex;
  let font = e.target.fonts[index].value;
  let fontSize = e.target.quantity.value;

  setFont(`${fontSize}pt`, font)
  
  //keep things working properly
  originalEditor.refresh();
  previewEditor.refresh();
  
});

