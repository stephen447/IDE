import 'cypress-time-marks'
describe('Autocomplete tests', () => {
    /*
  it('Testing opening the editor', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let editor = cy.get('[data-cy="editor"]')
    editor.type("print")
    editor.rightclick()
    let menu = cy.get('[data-cy="context-menu"]')
    menu.should('have.text', "\n Autocomplete\n Documentation\n Cut\n Copy\n Paste\n ").timeSince('visit')
    
  })*/
  it('Testing copy and paste', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let editor = cy.get('[data-cy="editor"]')
    editor.type("print")
    editor.dblclick()
    editor.rightclick()
    let copy = cy.get('[data-cy="contextCopy"]')
    copy.click()
    editor.rightclick()
    let paste = cy.get('[data-cy="contextPaste"]')
    paste.click()
    let editorValue = cy.get('[data-cy="contextMenuTest"]')
    editorValue.should('have.text', "print").timeSince('visit')
    
  })
  
})