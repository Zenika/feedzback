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
   cy.visit('/')
  


  })


  it('Application a le bon titre',()=>{
    cy.title().should('include','FeedZback')
  })
  it('Le champs Votre email zenika est invalid quand il est vide et applique pas le pattern email',()=>{
    cy.get('#email:invalid').should('have.length',1)
  })
  it('Le champs Email Zenika de votre collègue est invalid quand il est vide et applique pas le pattern email',()=>{
    cy.get('#sendEmail:invalid').should('have.length',1)
  })
  it('Le champs Points positifs est invalid quand il est vide',()=>{
    cy.get('#pointsPositifs:invalid').should('have.length',1)
  })
  it("Le champs Axes d'améliorations est invalid quand il est vide",()=>{
    cy.get('#pointsPositifs:invalid').should('have.length',1)
  })
  it('Le formulaire est invalid quand les champs sont invalides aussi', () => {

    cy.get('#feedbackForm:invalid').should('have.length',1)

  })

  it('Le bord de champs Votre email zenika est rouge quand il est touché et invalide',()=>{
    cy.get('#email').type('example@gmail.com')
    cy.get('#email').clear();
    cy.get('#sendEmail').type('example@gmail.com')
    cy.get('#email').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  })

  it('Le bord de champs Email Zenika de votre collègue est rouge quand il est touché et invalide',()=>{
    cy.get('#sendEmail').clear()
    cy.get('#pointsPositifs').type('...')
    cy.get('#sendEmail').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  })

  it('Le bord de champs Points positifs est rouge quand il est touché et invalide',()=>{
    cy.get('#pointsPositifs').clear()
    cy.get('#axesAmeliorations').type('...')
    cy.get('#pointsPositifs').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  })

  it("Le bord de champs Axes d'améliorations est rouge quand il est touché et invalide",()=>{
    cy.get('#axesAmeliorations').clear()
    cy.get('#commentaire').type('...')
    cy.get('#axesAmeliorations').should('have.css','border-color').and('eq','rgb(255, 0, 0)')
  })


  it('Le formulaire est valide et envoie le feedback',()=>{
  
    cy.get('#feedbackForm').within(()=>{
      cy.get('#email').type('exemple@gmail.com')
      cy.get('#sendEmail').type('exemple@zenika.com')
      cy.get('input:valid').should('have.length',2)
      cy.get('#pointsPositifs').type('les points poitifs sont:......')
      cy.get('#axesAmeliorations').type('les axes dAmeliorations sont:.....')
      cy.get('textarea:valid').should('have.length',3)
      cy.get('button:valid').should('have.length',2)
     
      cy.get('#submit').click();
      cy.wait('@CreateMessage')
    })

  })




})

