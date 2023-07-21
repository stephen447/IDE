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

import './themeEditor.js'
import {setFont} from './themeEditor.js'

//Robotify functions
import robotifyFunctions from './robotifyFunctions.js'
var alternativeModuleNames = new Set() // Set for the alternative module names
var manuallyimportedFunctions = new Set() // Set for the manually imported functions from modules
//Hidden HTML element for keeping state of the redirect URL's for documentation which is used for verification and testing functionality
const hiddenURL = document.getElementById("hiddenURL");
hiddenURL.innerHTML = "home"

//initial code put into the editor
let startCode = 
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
function getImports(totalNumLines){
    /**
     * Function which get the alternative names of the imported robotify modules and the names of the manually importing functions from robotify modules
     */
    //const totalNumLines = originalEditor.lineCount() // Number of lines in editor
    
    for(let lineNum = 0; lineNum<totalNumLines; lineNum++){ // Going through the the editor looking for imports
        let lineTokens = originalEditor.getLineTokens(lineNum, true) // Getting the line tokens
        let start = 0 // Start position of the line - used for skipping white spaces/tab indents
    
        if(lineTokens.length>3){ // Need minimum six tokens in a line for an import
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
            // If importing from a robotify module
            else if(startToken=='from'&&(robotifyFunctions.has(lineTokens[start+2].string)||alternativeModuleNames.has(lineTokens[start+2].string))){
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
        }
    }
}

//the editor on the left, does not respond to CSS changes
var originalEditor = CodeMirror(document.getElementById("originalEditor"), {
    value: startCode,
    mode:  "python",
    lineNumbers: true,
    foldGutter: true,
    matchBrackets: true,
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
            getImports(line) // Only search document up to the click position - as can NOT consider definition after the function has been used

            // Get the token at the click position
            var token = originalEditor.getTokenAt({line: line, ch: char})
            // Check token to see if its a builtin function, can then redirect to corresponsing page
            if (token.type=='builtin'){
                var builtinFunction = token.string
                url = 'https://docs.python.org/3/library/functions.html#'+builtinFunction
                hiddenURL.innerHTML = url
                //window.open(url)
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
                    //window.open(url)

                    console.log(manuallyimportedFunctions)
                    console.log(alternativeModuleNames)
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
let docu = originalEditor.getDoc()
docu.markText({line:3,ch:0}, {line:5,ch:2}, {options:{css:"background-color: red;", shared: true}})
let marks = docu.getAllMarks()
//console.log(marks )


function highlightUnusedFunctions()
{
    /**
     * This function parses through code in editor to find defintions of user defined functions and looks for instances of each function, it then places marker on function definitions which ar not used
     */
    let docu = originalEditor.getDoc()
    let userDefinedFunctions = [] // Array to store user defined functions
    const totalNumLines = originalEditor.lineCount() // Number of lines in editor
    // Search through editor for user defined funtion definitions and instances of these functions
    for(let lineNumber=0; lineNumber<totalNumLines; lineNumber++){
        let lineTokens = originalEditor.getLineTokens(lineNumber, true) // Get the line tokens
        for(let tokenNumber = 0; tokenNumber<lineTokens.length; tokenNumber++){
            let token = lineTokens[tokenNumber]
            if(token.type=='def'){ // If its a definition, add it to the userDefinedFunctions array along with line, start char, end char
                userDefinedFunctions.push(token.string, lineNumber, token.start, token.end)
                continue
            }
            else if(token.type=='variable'){ // Else if its an instance, remove from array as the function is used
                for(let arrayIndex=0; arrayIndex<userDefinedFunctions.length; arrayIndex=arrayIndex+4){
                    if(userDefinedFunctions[arrayIndex]==token.string){
                        userDefinedFunctions.splice(arrayIndex, 4)
                        continue
                    }
                }
            }
        }
    }
    // Making the highlights for the functions which are unused
    for(let markerNumber = 0; markerNumber<userDefinedFunctions.length; markerNumber=markerNumber+4){
        let markerLine = userDefinedFunctions[markerNumber+1]
        let markerStart = userDefinedFunctions[markerNumber+2]
        let markerEnd = userDefinedFunctions[markerNumber+3]
        docu.markText({line:markerLine,ch:markerStart}, {line:markerLine,ch:markerEnd}, {options:{css:"color: red"}})
    }
    
}

setInterval(highlightUnusedFunctions, 1000)


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

