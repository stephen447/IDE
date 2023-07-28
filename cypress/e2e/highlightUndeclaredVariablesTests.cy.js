import 'cypress-time-marks'
describe('Testing defined/undefined variables', () => {
  it('Simple valid declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = ''
    let editor = cy.get('[data-cy="editor"]')
    editor.type("x=5")
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Simple invalid declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = 'y,0,4,5,x,0,0,1'
    let editor = cy.get('[data-cy="editor"]')
    editor.type("x = y")
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Valid function declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = ''
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `import byte
    from byte import move
    move_2 = move(2)
    `
    )
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Valid multiple declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = ''
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `x = y = 5`)
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Invalid multiple declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = 'z,0,8,9,x,0,0,1,y,0,4,5,z,0,8,9'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `x = y = z`)
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('String declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = ''
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `x = "string"`)
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Valid IntVar declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = ''
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `y = 5
    x = 4*y`)
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Invalid IntVar declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = 'y,0,6,7,x,0,0,1'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `x = 4*y`)
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Valid deleted variable declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = ''
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `x = 4
    y = x
    del(x)`)
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Invalid deleted variable declartion', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = 'x,2,10,11,y,2,6,7'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `x = 4
    del(x)
    y = x
    `)
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('For loop declaration', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = 'z,0,18,19'
    let editor = cy.get('[data-cy="editor"]')
    editor.type(
    `for y in range(0, z):
        print(y)
    `)
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  it('Edge Case: Simple invalid declartion with out spaces', () => {
    cy.visit('http://localhost:8080').timeMark('visit')
    let expectedUndeclaredVariables = 'y,0,2,3,x,0,0,1'
    let editor = cy.get('[data-cy="editor"]')
    editor.type("x=y")
    let imports = cy.get('[data-cy="undeclaredVariables"]')
    imports.should('have.text', expectedUndeclaredVariables).timeSince('visit')
  })
  

  

})
