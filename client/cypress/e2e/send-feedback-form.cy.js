/// <reference types="cypress" />
describe('Send feedback form tests', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/send')
  })

  it('Application has the right title',()=>{
    cy.title().should('include','FeedZback')
  })
  it("The form is not valid when all required input text are empty and input type emails are not email match",()=>{
    cy.get('#feedbackForm').should('have.class','ng-invalid')
  })

  it('Required input borders become red when they are touched and not valid',()=>{

    cy.get('#coworker-email').type('example@example.com')
    cy.get('#coworker-email').clear()
    cy.get('#coworker-name').type('les points ppositifs sont:...')
    cy.get('#coworker-email').should('have.css','border-color').and('eq','rgb(213, 33, 80)')
    cy.get('#coworker-name').clear()
    cy.get('#positive-feedback').type('les points ppositifs sont:...')
    cy.get('#coworker-name').should('have.css','border-color').and('eq','rgb(213, 33, 80)')
    cy.get('#positive-feedback').clear()
    cy.get('#to-improve-feedback').type("les axes d'améliorations sont:.....")
    cy.get('#positive-feedback').should('have.css','border-color').and('eq','rgb(213, 33, 80)')
    cy.get('#to-improve-feedback').clear()
    cy.get('#comment').type('contiuner comme ça')
    cy.get('#to-improve-feedback').should('have.css','border-color').and('eq','rgb(213, 33, 80)')
  })

  it('The form is valid and send the feedback',()=>{
  
    cy.get('#feedbackForm').within(()=>{
      cy.get('#coworker-name').type('marie mettrand')
      cy.get('#coworker-email').type('marie.mettrand@example.com')
      cy.get('#positive-feedback').type('les points poitifs sont:......')
      cy.get('#to-improve-feedback').type('les axes dAmeliorations sont:.....')
     
      cy.get('#submit').click();
    })
  })

})
