/// <reference types="cypress" />

describe('Send feedback form tests', () => {
  
  beforeEach(() => {
  
    cy.intercept('POST','/graphql',req =>{
      if (req.body.hasOwnProperty('query') && req.body.query.includes('mutation')){   
        req.alias=`SendFeedback`
        req.reply((res)=>{
          res.body.data.sendFeedback="mock:Votre feedback a été envoyé!"
        })
      }
    
    }).as('SendFeedback')
   cy.visit('/send-feedback')

  })


  it('Application has the right title',()=>{
    cy.title().should('include','FeedZback')
  })
  it("The form is not validate when all required input text are empty and input type emails are not email match",()=>{
    cy.get('#your-email').should('have.class','ng-invalid')
    cy.get('#coworker-email').should('have.class','ng-invalid')
    cy.get('#positive-feedback').should('have.class','ng-invalid')
    cy.get('#to-improve-feedback').should('have.class','ng-invalid')
    // cy.get('#myform').should('have.class','ng-invalid')
  })
 

  it('Les bords des champs requis deviennent rouges quand ils sont touchés et invalides',()=>{
    cy.get('#your-email').type('example@example.com')
    cy.get('#your-email').clear();
    // cy.get('#email').type('example@example.com')
    // cy.get('#nom').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
    // cy.get('#email').clear()
    // cy.get('#pointsPositifs').type('les points ppositifs sont:...')
    // cy.get('#email').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
    // cy.get('#pointsPositifs').clear()
    // cy.get('#axesAmeliorations').type("les axes d'améliorations sont:.....")
    // cy.get('#pointsPositifs').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
    // cy.get('#axesAmeliorations').clear()
    // cy.get('#commentaire').type('contiuner comme ça')
    // cy.get('#axesAmeliorations').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  })


  // it('Le formulaire est valide et envoie le feedback',()=>{
  
  //   cy.get('#feedbackForm').within(()=>{
  //     cy.get('#nom').type('pierre henry')
  //     cy.get('#email').type('pierre.henry@example.com')
  //     cy.get('#receverEmail').type('marie.mettrand@example.com')
  //     cy.get('#pointsPositifs').type('les points poitifs sont:......')
  //     cy.get('#axesAmeliorations').type('les axes dAmeliorations sont:.....')
     
  //     cy.get('#submit').click();
  //     cy.wait('@SendFeedback')
  //   })
  // })
})
