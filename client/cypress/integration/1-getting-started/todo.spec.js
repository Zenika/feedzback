/// <reference types="cypress" />

describe('example to-do app', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:4200/')
  })

  it('Application a le bon titre',()=>{
    cy.title().should('include','Client')
  })
  it('Le formulaire a 2 input-text invalid, 2 textarea et un bouton qui sont invalides', () => {

    cy.get('#feedbackForm').within(()=>{

      cy.get('input:invalid').should('have.length',2)
      cy.get('textarea:invalid').should('have.length',2)
      cy.get('button:disabled').should('have.length',1)
      cy.get('input:invalid').should('have.class','ng-untouched')
    
    })  

  })
it('Les bors des champs obligatoires deviennent rouges après avoir être touchés si ils sont invalides',()=>{
  cy.get('#email').type('example@gmail.com')
 cy.get('#email').clear();
 cy.get('#sendEmail').type('example@gmail.com')
 cy.get('#sendEmail').clear()
 cy.get('#pointsPositifs').type('...')
 cy.get('#pointsPositifs').clear()
 cy.get('#axesAmeliorations').type('...')
 cy.get('#axesAmeliorations').clear()
 cy.get('#commentaire').type('.....')
  cy.get('#email').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  cy.get('#sendEmail').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  cy.get('#pointsPositifs').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  cy.get('#axesAmeliorations').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
 
})
  it('Le formulaire est valide et envoie le feedback',()=>{
    cy.get('#feedbackForm').within(()=>{
      cy.get('#email').type('binyat.sharif@gmail.com')
      cy.get('#sendEmail').type('bnyat.azizsharif@zenika.com')
      cy.get('input:valid').should('have.length',2)
      cy.get('#pointsPositifs').type('les points poitifs sont:......')
      cy.get('#axesAmeliorations').type('les axes dAmeliorations sont:.....')
      cy.get('textarea:valid').should('have.length',3)
      cy.get('button:valid').should('have.length',2)
      cy.get('#submit').click();
    })

  })




})

