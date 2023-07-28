import 'cypress-time-marks'
describe('Testing Imports', () => {
  it('Simple Robotify import', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedImports = 'axel,0,7,11'
    let editor = cy.get('[data-cy="editor"]')
    editor.type("import axel")
    let imports = cy.get('[data-cy="testImports"]')
    imports.should('have.text', expectedImports).timeSince('visit')
  })
  it('Alternative import', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = 'axel,0,7,11,a,0,15,16'
      let editor = cy.get('[data-cy="editor"]')
      editor.type("import axel as a")
      let imports = cy.get('[data-cy="testImports"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })
    it('Multiple imports', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = 'deliveries,0,7,17,spaceship,0,19,28'
      let editor = cy.get('[data-cy="editor"]')
      editor.type("import deliveries, spaceship")
      let imports = cy.get('[data-cy="testImports"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })
    
    it('Testing space before import', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = ''
      let editor = cy.get('[data-cy="editor"]')
      editor.type(`axel,0,8,12
      axel.move()
      `)
      let imports = cy.get('[data-cy="testImports"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })
    it('Using alternative import name', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = 'axel,0,7,11'
      let editor = cy.get('[data-cy="editor"]')
      editor.type(`import axel as a
      a.move()
      `)
      let imports = cy.get('[data-cy="testImports"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })
    it('Edge Case: testing space before import', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = 'axel,0,8,12'
      let editor = cy.get('[data-cy="editor"]')
      editor.type(" import axel")
      let imports = cy.get('[data-cy="testImports"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })
    it('Importing functions', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = 'axel,0,7,11,move,1,20,24,turn,1,26,30'
      let editor = cy.get('[data-cy="editor"]')
      editor.type(
      `import axel as a
      from a import move, turn`
      )
      let imports = cy.get('[data-cy="testImports"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })
    it('Importing functions and using them', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = 'axel,0,7,11'
      let editor = cy.get('[data-cy="editor"]')
      editor.type(
      `import axel as a
      from a import move, turn
      turn("around")
      move(5)`
      )
      let imports = cy.get('[data-cy="testImports"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })
    it('Unused user defined functions', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = 'user_function,0,4,17'
      let editor = cy.get('[data-cy="editor"]')
      editor.type(
      `def user_function(): # User defined function
      return 1`
      )
      let imports = cy.get('[data-cy="unusedFunctions"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })
    it('Used user defined functions', () => {
      cy.visit('http://localhost:8080').timeMark('visit')
      let expectedImports = ''
      let editor = cy.get('[data-cy="editor"]')
      editor.type(
      `def user_function(): # User defined function
      return 1
      user_function()`
      )
      let imports = cy.get('[data-cy="unusedFunctions"]')
      imports.should('have.text', expectedImports).timeSince('visit')
    })

})
