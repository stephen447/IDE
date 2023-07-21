
describe('Documentation links tests', () => {
  it('Robotify function', () => {
    let expected_url = 'https://www.robotify.com/'
    let startTime = performance.now()
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 190
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    let testDuraction = performance.now()-startTime
    cy.log("Test duration:", testDuraction)
    cy.log("Start time", startTime)
    //cy.contains(expected_url)
  })
  it('Python function', () => {
    let expected_url = 'https://docs.python.org/3/library/functions.html#abs'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 200
    let yPos = 410
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)
    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })
  it('Random token', () => {
    let expected_url = 'home'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 140
    let yPos = 400
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)
    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })
  it('Edge Case: Space in front of import', () => {
    let expected_url = 'https://www.robotify.com/'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 150
    let yPos = 160
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)
    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })
  it('Edge Case: Alternative name import', () => {
    let expected_url = 'https://www.robotify.com/'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 190
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)
    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })
  it('Edge Case: Multiple imports', () => {
    let expected_url = 'https://www.robotify.com/'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 225
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)
    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })
  it('Edge Case: Alternative name function import', () => {
    let expected_url = 'https://www.robotify.com/'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 205
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)
    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })
  it('Edge Case:  Function redefinition', () => {
    let expected_url = 'home'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 345
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)
    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })
  it('Triple clicking 2 Robotify functions', () => {
    let expected_url = 'https://www.robotify.com/'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 190
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 150
    yPos = 160
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })
  it('Triple clicking 3 Robotify functions', () => {
    let expected_url = 'https://www.robotify.com/'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 190
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 150
    yPos = 160
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 180
    yPos = 225
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })

  it('Triple clicking 4 Robotify functions', () => {
    let expected_url = 'https://www.robotify.com/'
    cy.visit('http://localhost:8080')
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 190
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 150
    yPos = 160
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 180
    yPos = 225
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 180
    yPos = 205
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    //cy.contains(expected_url)
  })

  it('Triple clicking 5 Robotify functions', () => {
    let expected_url = 'https://www.robotify.com/'
    cy.visit('http://localhost:8080')
    let startTime = performance.now()
    let editor = cy.get('[data-cy="editor"]')
    // Click position
    let xPos = 180
    let yPos = 190
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 150
    yPos = 160
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 180
    yPos = 225
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 180
    yPos = 205
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    xPos = 110
    yPos = 235
    editor.click(xPos, yPos).click(xPos, yPos).click(xPos, yPos)

    let url = cy.get('[data-cy="hiddenURL"]')
    url.should('have.text', expected_url)
    let testDuraction = performance.now()-startTime
    cy.log("Test Duration: ", testDuraction)
    //cy.contains(expected_url)
  })
  
  
})