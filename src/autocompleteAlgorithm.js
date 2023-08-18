function autocompleteAlgorithm(keyword, length, userDefinedFunctions, userDefinedVariables, userDefinedClasses, functionParameters, importedModuleFunctions, module, importedModules, manuallyImportedModuleFunctions){
    /**
     * This function get the sugested list for a given keyword
     * Its take the keyword, the length of the suggested list, user defined functions set, user defined variables, imported modules, imported module functions, manually imported functions from modules and the module the suggestions must be from as parameters
     * it returns the suggested list
     */
    console.log("function parameters",userDefinedVariables)
    let sugestedList = [] // Initiating the sugested list
    // If the autocomplete is for a module - only suggest function for specified modules
    if(module!=null){ //Module parameter is set to null if its a general autocomplete, otherwise it will be the name of the module
        if(keyword==false){ // The keyword is false, there is no keyword - set to empty string
            keyword=""
        }
        sugestedList = importedModuleFunctions.filter((func)=>func.text.startsWith(keyword)) // Filter for keyword
        sugestedList = sugestedList.filter((func)=>func.class==module) // Filter for module class
        return sugestedList // Return list
    }
    // Otherwise generate list using non module specific objects
    let masterList = [userDefinedVariables,functionParameters, userDefinedFunctions, userDefinedClasses, importedModules, manuallyImportedModuleFunctions] // Master list contains all other objects which will be searched ina specific order
    let listNum = 0 // Increment for the lists in the master list
    if(keyword==false){ // The keyword is false, there is no keyword - set to an empty string
        keyword=""
    }
    
    while(sugestedList.length<length&&listNum<masterList.length){ // While the sugested list is not full and master list havent been searched, search lists for possible suggestions for the keyword
        let curList = masterList[listNum] // Cycle through list in master list
        console.log("current list", curList)
        if(listNum==4){ // Getting the alternative names for modules ad adding them to the list to be filtered for suggestions
            for(let alt=0;alt<curList.length;alt++){ // For all valid alternative names - add them to the current list
                if(curList[alt].alternative!='null'){ // If there is a valid alternative name - add to current list
                    curList.push({text:curList[alt].alternative, className: 'module', alternative:'null'})
                }          
            }
        }
        curList = curList.filter((func)=>func.text.startsWith(keyword)) // Filter the list
        curList.sort((a, b) => a.text.localeCompare(b.text)) // Sort the filtered list alphabetically
        sugestedList = sugestedList.concat(curList) // Add the filtered current list to the sugestions list
        listNum++ // Increment for next list in the master list 
    }
    if(sugestedList.length>length){ // If the suggested list is larger than length cut off excess elements
        sugestedList.splice(length, (sugestedList.length-length))
    }

    //TESTING
    let testAutocompleteList = [] // For testing this function using cypress
    let testAutocompleteListTypes = [] // For testing this function using cypress
    const autoCompList = document.getElementById("autocompleteList");
    const autoCompListTypes = document.getElementById("autocompleteListTypes");

    for(let i=0; i<sugestedList.length;i++){
        testAutocompleteList.push(sugestedList[i].text)
        testAutocompleteListTypes.push(sugestedList[i].className)
    }
    autoCompList.innerHTML = testAutocompleteList
    autoCompListTypes.innerHTML = testAutocompleteListTypes
    return sugestedList
}

module.exports = autocompleteAlgorithm