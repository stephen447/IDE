import 'cypress-time-marks'
describe('Autocomplete tests', () => {
  it('Empty editor', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = ''
    let expectedSuggestedListTypes = ''
    let editor = cy.get('[data-cy="editor"]')
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
    
  })
  it('Simple import sugestion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = 'flex'
    let expectedSuggestedListTypes = 'module'
    let editor = cy.get('[data-cy="editor"]')
    editor.type("import flex")
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
  })
  it('Import with alternative name sugestion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = 'f,flex'
    let expectedSuggestedListTypes = 'module,module'
    let editor = cy.get('[data-cy="editor"]')
    editor.type("import flex as f")
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
  })
  it('Not enough sugestions for keyword', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = 'a,x,flex'
    let expectedSuggestedListTypes = 'variable,variable,module'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(`import flex
    a=5
    x=5
    x
    `)
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
  })
  it('Too many sugestions for keyword', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = 'x1,x2,x3'
    let expectedSuggestedListTypes = 'variable,variable,variable'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(`x1=5
    x2=5
    x3=5
    x4=5
    x6=7
    x`)
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
  })
  it('Duplicates keyword', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = 'x1'
    let expectedSuggestedListTypes = 'variable'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(`x1=5
    x1=5
    x
    `)
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
  })
  it('Manually imported function from robotify module', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = 'flex,move_forward'
    let expectedSuggestedListTypes = 'module,function'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(`from flex import move_forward
    `)
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
  })
  it('Manually imported function from non-robotify module', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = 'codeMirror,editor'
    let expectedSuggestedListTypes = 'module,function'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(`from codeMirror import editor
    `)
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
  })
  it('Multiple function import', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedSuggestedList = 'flex,move_backward,move_forward'
    let expectedSuggestedListTypes = 'module,function,function'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(`from flex import move_forward, move_backward
    `)
    editor.type("{ctrl} ")
    let list = cy.get('[data-cy="autocompleteList"]')
    list.should('have.text', expectedSuggestedList).timeSince('visit')
    let listTypes = cy.get('[data-cy="autocompleteListTypes"]')
    listTypes.should('have.text', expectedSuggestedListTypes).timeSince('visit')
  })
})
