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

// hyper link extensions
import { hyperLink, hyperLinkExtension, hyperLinkStyle } from '@uiw/codemirror-extensions-hyper-link';


//initial code put into the editor
let startCode = 
`
import flex

# Empty list of animal locations.
animal_locations = []

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
https://www.google.com
`

//the editor on the left, does not respond to CSS changes
var originalEditor = CodeMirror(document.getElementById("originalEditor"), {
    value: startCode,
    mode:  "python",
    lineNumbers: true,
    foldGutter: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    search: true,
    extensions: hyperLink,
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
            
            // Get the position of the click in the editor in terms of line and character index
            var db_click_position = originalEditor.coordsChar(click_coords);
            var line = db_click_position.line
            var char = db_click_position.ch

            // Get the token at the click position
            var token = originalEditor.getTokenAt({line: line, ch: char})

            // Check token to see if its a builtin function, can then redirect to corresponsing page
            if (token.type=='builtin'){
                var keyword = token.string
                var url = 'https://docs.python.org/3/library/functions.html#'+keyword
                window.open(url)
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
            var click_coord = previewEditor.cursorCoords()
            var click_coords = {left: click_coord.left, top: click_coord.top};
            
            // Get the position of the click in the editor in terms of line and character index
            var db_click_position = previewEditor.coordsChar(click_coords);
            var line = db_click_position.line
            var char = db_click_position.ch

            // Get the token at the click position
            var token = previewEditor.getTokenAt({line: line, ch: char})

            // Check token to see if its a builtin function, can then redirect to corresponsing page
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

//for submitting font size & font style
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

