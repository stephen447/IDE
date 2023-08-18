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
//import { hintFunc } from "./hinting.js";
//linting
import 'codemirror/addon/lint/lint.js'
import { parse } from "./errorChecker.js"
// Highlighting unused variables
// Themes
import './themeEditor.js'
import {setFont} from './themeEditor.js'

//Documentation
import { documentation } from "./documentation";
import staffSettings from './staffSettings.json'

//Highlighting and dimming undeclared variables and unused functions
import { highlight } from "./highlight";

//Autocomplete
const getSuggestedList = require("./autocompleteAlgorithm")
import { getModuleObjects } from "./getModuleObjects";
import {getManuallyImportedModuleFunctions } from "./getManuallyImportedModuleFunctions";
import {getUserDefinedObjects} from "./getUserDefinedObjects";
let importedModuleFunctions = [] // Imported modules functions array for storing
import { getFunctionParameter } from "./functionParametersTest";
let functionParameters = [] // Array for giving


// Hidden HTML element for keeping state of the redirect URL's for documentation which is used for verification and testing functionality
const hiddenURL = document.getElementById("hiddenURL");
hiddenURL.innerHTML = "home"
let startCodeem = ``
let startCode=``
let startC = `import satellite
import flex as f
import codeMirror
from axel import move_forward, move_backward

def testFunction():
  return 1

def code():
  return "code"

c=5
a=1
b=2
flex.
f.`
//initial code put into the editor
let startCo = `import codeMirror # Standard import
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
function hintFunc(editor, options) {
    var WORD = /[\w$]+/, RANGE = 500;
    var word = options && options.word || WORD;
    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
    var end = cur.ch // End is cursor character ( guessing that ch is character )
    var start = end; //start at the end, and move start back until you reach the start of the word
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end); //curWord checks to make sure start doesn't equal end, then slices the line to get the whole word 
    
    let userDefined = getUserDefinedObjects(editor) // Getting the declared variables and user defined functions
    let userDefinedVariables = userDefined[0] // User defined variables
    let userDefinedFunctions = userDefined[1] // User defined functions
    let userDefinedClasses = userDefined[2]
    let functionDeclarations = userDefined[3]
    console.log("function declarations", )
    let importedModules = getModuleObjects(editor) // Imported modules
    let manuallyImportedModuleFunctions = getManuallyImportedModuleFunctions(editor) // Getting the manually imported module functions
    let numSuggestions = staffSettings.autofillSuggestions // Retrieving the number of suggestions from the staff JSON form

    // This is for getting the functions imported for modules
    let pos = editor.getCursor() //Get the position in the editor
    let currentToken = editor.getTokenAt(pos) // Get the current token
    let lineNum = pos.line //Get the line token
    let char = currentToken.start // Get the end char for token before
    let prevToken = editor.getTokenAt({line: lineNum, ch: char}) // Get the previous token
    char = prevToken.start // Update the end char for previous char
    let secPrevToken = editor.getTokenAt({line: lineNum, ch: char}) // Get the second previous char
    
    if(currentToken.string=="."){ // If current token is a dot (property) - only have suggestions for that module. Pass the module in questions name to getSuggestedList
        if(prevToken.type=='variable'){
            let alternateName = importedModules.find(element=>element.alternative==prevToken.string)
            if(alternateName!=undefined){
                prevToken.string = alternateName.text
            }
            let list = getSuggestedList(curWord, numSuggestions, userDefinedFunctions, userDefinedVariables, userDefinedClasses, functionDeclarations, importedModuleFunctions, prevToken.string, importedModules)
            return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
        }
    }
    else if(prevToken.string=="."){ //If the previous token is a dot (property)
        if(secPrevToken.type=='variable'){
            let alternateName = importedModules.find(element=>element.alternative==secPrevToken.string)
            if(alternateName!=undefined){
                secPrevToken.string = alternateName.text
            }
            let list = getSuggestedList(curWord, numSuggestions, userDefinedFunctions, userDefinedVariables, userDefinedClasses, functionDeclarations, importedModuleFunctions, secPrevToken.string,importedModules)
            return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
        }
    }
    //Otherwise general look up, set module to be null
    let list = getSuggestedList(curWord, numSuggestions, userDefinedFunctions, userDefinedVariables, userDefinedClasses, functionDeclarations, importedModuleFunctions, null, importedModules, manuallyImportedModuleFunctions) // Fetching the suggested list using the 
    return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
}

// Editor on the left, does not respond to CSS changes
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
            completeSingle: false,   //does not autocomplete when there is only a single match
        })},
        "LeftTripleClick": function(){
            documentation(originalEditor)
        }
    },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
    theme: "constTheme"
});

// Editor on the right, DOES respond to CSS changes
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
            completeSingle: false,
        })},
        "LeftTripleClick": function(previewEditor){
            documentation(previewEditor)
        }
    },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
    theme: "theme"
});

// Setting the height of the editor to be larger
originalEditor.setSize(null, 700);
previewEditor.setSize(null, 700);
//originalEditor.on("cursorActivity", ()=>functionParameters = getFunctionParameter(originalEditor)) // Update highlights whenever a change is made in the editor
//getFunctionParameter(originalEditor)

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

highlight(originalEditor) // Make initial highlights
originalEditor.on("changes", ()=>highlight(originalEditor)) // Update highlights whenever a change is made in the editor
highlight(previewEditor) // Make initial highlights
previewEditor.on("changes", ()=>highlight(previewEditor)) // Update highlights whenever a change is made in the editor
const contextMenuTest = document.getElementById("contextMenuTest"); 
originalEditor.on("changes", ()=>contextMenuTest.innerHTML = originalEditor.getValue()) // Update highlights whenever a change is made in the editor

const skulptFile = document.getElementById("uploadSkulpt");
skulptFile.addEventListener('change', async (event) => {
    const fileList = event.target.files; //Get the files that were loaded
    if(fileList.length > 0) // Reads the content of the file the user loaded
    {
        for(let file = 0; file<fileList.length; file++){
            const reader = new FileReader(); // Define a filereader
            reader.readAsText(fileList[file], "UTF-8"); // Read file as text
            reader.onload = function (e) { //When file fully loaded
                let data = reader.result // Extract data
                const lines = data.split("\n") // Split the data into lines
                let moduleName = "name_not_found" // testing
                for(let i = 0; i<lines.length; i++){ // Search through the lines
                    var trimmedStr = lines[i].trimStart(); // Remove whitespace at the beginning of lines
                    let startsWithMod = trimmedStr.startsWith("mod") // Check if the line starts with mod - true/false
                    
                    if(startsWithMod==true){
                        let words = trimmedStr.split(" ") // Separate line into words
                        let func = words[0].slice(4, words[0].length) //Extract function name
                        if(func=='__name__'){
                            moduleName = trimmedStr.slice(trimmedStr.indexOf("(") + 2,trimmedStr.lastIndexOf(")")-1);
                        }
                        else{
                            // Push the function name into
                            importedModuleFunctions.push({text:func, className:"function", class: moduleName})
                        }
                    }
                }
            }
        }
    }
});
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

if(staffSettings.autofill==false){
    document.getElementById("autocomplete").checked = false;
    document.getElementById("submitButton").click()
    document.getElementById("autocomplete").remove()
    document.getElementById("autocompleteLabel").remove()
}

// Context menu - custom context menu
const contextMenu = document.getElementById("context-menu"); // Retrieving the context menu div
const editorInstance = document.getElementById("originalEditor") // Getting the editor instance
const contextAutocomplete = document.getElementById("contextAutocomplete") // Autocomplete button in context menu
const contextDocumentation = document.getElementById("contextDocumentation")  // Documentation button in context menu
const contextCopy = document.getElementById("contextCopy")  // Copy button in context menu
const contextPaste = document.getElementById("contextPaste")  // Paste button in context menu
const contextCut = document.getElementById("contextCut")  // Cut button in context menu

// Event listener for making context menu apper on right click
editorInstance.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const { clientX: mouseX, clientY: mouseY } = event;
  const {normalizedX, normalizedY} = normalizePosition(mouseX, mouseY) //Normalise position of context menu so it
  // Position the context menu
  contextMenu.style.top = `${normalizedY}px`;
  contextMenu.style.left = `${normalizedX}px`;
  contextMenu.classList.add("visible"); // Remove the context menu when a button is pressed on it
})

// Event handler that if anywhere outside of context menu is clicked , the contet men is closed
editorInstance.addEventListener("click", (event) => {
    if (event.target.offsetParent != contextMenu) {
      contextMenu.classList.remove("visible");
    }
});

const normalizePosition = (mouseX, mouseY) => {
    /**
     * This function normalise the position of the context menu so it does not appear out of bounds
     * Parameters are the x and y position of the mouse click
     * Returns the normalised positions of mouse click
    **/
    const {
      left: scopeOffsetX,
      top: scopeOffsetY,
    } = editorInstance.getBoundingClientRect();
  
    const scopeX = mouseX - scopeOffsetX;
    const scopeY = mouseY - scopeOffsetY;
  
    //Check if the element will go out of bounds
    const outOfBoundsOnX = scopeX + contextMenu.clientWidth > editorInstance.clientWidth;
    const outOfBoundsOnY = scopeY + contextMenu.clientHeight > editorInstance.clientHeight;
  
    let normalizedX = mouseX;
    let normalizedY = mouseY;
  
    // Normalise x and y
    if (outOfBoundsOnX) {
        normalizedX =scopeOffsetX + editorInstance.clientWidth - contextMenu.clientWidth;
    }
    if (outOfBoundsOnY) {
        normalizedY = scopeOffsetY + editorInstance.clientWidth - contextMenu.clientHeight;
    }

    return {normalizedX, normalizedY};
}

// Event handler for toggling the autocomplete button
contextAutocomplete.addEventListener("click", () => {
    let autocomplete = document.getElementById("autocomplete") // Get autocomplete checkbox
    if(autocomplete.checked==true){
        autocomplete.checked=false  // Invert checkbox
        document.getElementById("submitButton").click() // Click submit button
        contextMenu.classList.remove("visible"); // Close context menu
    }
    else{
        autocomplete.checked=true // Invert checkbox
        document.getElementById("submitButton").click()  // Click submit button
        contextMenu.classList.remove("visible"); // Close context menu
    }
});

// Event handler for documentation
contextDocumentation.addEventListener("click", () => {
    documentation(originalEditor) // Call documentation function
    contextMenu.classList.remove("visible");  // Close context menu
});

// Event handler for cut operation
contextCut.addEventListener('click', (e) => {
    document.execCommand('copy'); // Call copy command
    let start = originalEditor.getCursor(true) // Get start position of the selction
    let end = originalEditor.getCursor(false) // Get end position of the selction
    let doc = originalEditor.getDoc() // Retrive the document inside editor instance
    doc.replaceRange("", start, end) // Cut out selected text in document
    contextMenu.classList.remove("visible"); // Close context menu
})

// Event handler for copy operation
contextCopy.addEventListener('click', (e) => {
    document.execCommand('copy'); // Call copy command
    contextMenu.classList.remove("visible"); // Close context menu
})

// Event handler for paste operation
contextPaste.addEventListener('click', (e) => {
    navigator.clipboard.readText() // Read the text from the clipboard
  .then(text => { 
    var doc = originalEditor.getDoc(); // Get the document from editor instance
    var cursor = doc.getCursor(); // Get the cursor position
    doc.replaceRange(text, cursor); // Insert the clipboard text into cursor position
    contextMenu.classList.remove("visible"); // Close context menu
  })
  .catch(err => { // Catch error if text not read
    console.error('Failed to read clipboard contents: ', err); // Log error
  });
})





