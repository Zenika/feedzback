/// <reference types="cypress" />

describe('Formulaire tests', () => {
  
  beforeEach(() => {
  
    cy.intercept('POST','/graphql',req =>{
      if (req.body.hasOwnProperty('query') && req.body.query.includes('mutation')){
        req.alias=`CreateMessage`
        req.reply((res)=>{
          res.body.data.createMessage="mock:Votre feedback a été envoyé!"
        })
      }
    
    }).as('CreateMessage')
   cy.visit('/formulaire')

  })


  it('Application a le bon titre',()=>{
    cy.title().should('include','FeedZback')
  })
  it("Le formulaire n'est pas valide quand les champs requis sont vides et les chmaps d'emails n'appliquent pas le pattern email",()=>{
    cy.get('#nom').should('have.class','ng-invalid')
    cy.get('#email').should('have.class','ng-invalid')
    cy.get('#pointsPositifs').should('have.class','ng-invalid')
    cy.get('#pointsPositifs').should('have.class','ng-invalid')
    cy.get('#feedbackForm').should('have.class','ng-invalid')
  })
 

  it('Les bords des champs requis deviennent rouges quand ils sont touchés et invalides',()=>{
    cy.get('#nom').type('example@gmail.com')
    cy.get('#nom').clear();
    cy.get('#email').type('example@gmail.com')
    cy.get('#nom').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
    cy.get('#email').clear()
    cy.get('#pointsPositifs').type('les points ppositifs sont:...')
    cy.get('#email').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
    cy.get('#pointsPositifs').clear()
    cy.get('#axesAmeliorations').type("les axes d'améliorations sont:.....")
    cy.get('#pointsPositifs').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
    cy.get('#axesAmeliorations').clear()
    cy.get('#commentaire').type('contiuner comme ça')
    cy.get('#axesAmeliorations').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  })


  it('Le formulaire est valide et envoie le feedback',()=>{
  
    cy.get('#feedbackForm').within(()=>{
      cy.get('#nom').type('binyat.sharif@gmail.com')
      cy.get('#email').type('bnyat.azizsharif@zenika.com')
      cy.get('#pointsPositifs').type('les points poitifs sont:......')
      cy.get('#axesAmeliorations').type('les axes dAmeliorations sont:.....')
     
      cy.get('#submit').click();
      cy.wait('@CreateMessage')
    })

  })




})

