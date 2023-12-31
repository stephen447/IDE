//themeEditor.js is in charge of saving, loading, and changing colors & fonts on the editors

var colorJson = {}; //for saving & loading (stores the colors as a JSON with properties)
export const colorHtmlElements = setUpColorElements();  //sets the color picker HTML elements

//grabs the HTML elements from the document, then adds event listener to each one
function setUpColorElements()
{
    //declare initial variables
    let colorHtmlElements = [];
    colorJson = {};
    const colorColumns = document.getElementsByClassName("colorColumn");
    let style = getComputedStyle(document.querySelector(':root'));

    //for each column div
    for(let i = 0; i < colorColumns.length; i++)
    {
        //for each color picker in the column
        Array.from(colorColumns[i].getElementsByTagName("input")).forEach(element => {
            setUpIndividualElement(colorHtmlElements,element, style);
        });
    }
    
    //also set fontsize
    colorJson["fontsize"] = style.getPropertyValue("--fontsize");
    return colorHtmlElements;
}

// sets up one color
function setUpIndividualElement(colorHtmlElements, element, style)
{
    //add HTML element
    colorHtmlElements.push(element);

    //set input handler
    element.addEventListener('input', watchColorPicker);

    //set color picker color to the CSS variable
    element.value = style.getPropertyValue("--"+element.id);

    //store the color
    colorJson[element.id] = element.value;

}

//sets colors into their respective CSS variables
function updateColorValues(newColors)
{
    let root = document.querySelector(':root').style;

    //for every color picker
    for(let i = 0; i < colorHtmlElements.length; i++)
    {
        let colorId = colorHtmlElements[i].id;
        let colorValue = newColors[colorId];

        //set visual element
        colorHtmlElements[i].value = colorValue;

        //set json element
        colorJson[colorId] = colorValue;

        //set CSS element
        root.setProperty("--"+colorId, colorValue);

        //if using for something other than loading remove this & change load()
        root.setProperty("--const_"+colorId, colorValue);
    
    }

    //set font and fontsize
    root.setProperty("--fontsize", newColors["fontsize"]);
    root.setProperty("--const_fontsize", newColors["fontsize"]);

    root.setProperty("--font", newColors["font"]);
    root.setProperty("--const_font", newColors["font"]);
}

// on submit; set the font and the fontsize
export function setFont(fontSize, font)
{
    let root = document.querySelector(':root').style;   
    root.setProperty("--fontsize", fontSize);   // set the CSS var
    colorJson["fontsize"] = fontSize;           // store the font size
    
    root.setProperty("--font", font);
    colorJson["font"] = font;

}

// sets up downloading with a Blob and URL link
function save()
{
    //create blob for downloading
    let blob = new Blob([JSON.stringify(colorJson)], {type: 'application/json'});
    
    let link = document.getElementById("saveLink");
  
    link.download = "new theme.json";
    link.href = URL.createObjectURL(blob);

}

// sets up loading colors into their respective CSS variables
function load(json)
{
    let newColors = JSON.parse(json);
    updateColorValues(newColors);
}

//========================================= INPUT HANDLERS =========================================

//input handler that updates color of preview editor when one of the color pickers changes
function watchColorPicker(e)
{
    let root = document.querySelector(':root').style;
    root.setProperty("--"+e.target.id, e.target.value);

    colorJson[e.target.id] = e.target.value;

}

//saving
const saveTheme = document.getElementById("saveTheme");
saveTheme.onclick = save;

//for loading from a file
const uploadTheme = document.getElementById("uploadTheme");
uploadTheme.addEventListener('change', (event) => {

    //get the files that were loaded
    const fileList = event.target.files;
  
    //reads the content of the file the user loaded
    if(fileList.length > 0)
    {
      var reader = new FileReader();
      reader.readAsText(fileList[0], "UTF-8");
      reader.onload = function (e) {
  
        //load the theme
        load(e.target.result);
    
      }
  
      //reset the loader
      uploadTheme.value = "";
      
    }
  
  });