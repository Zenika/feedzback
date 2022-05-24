/// <reference types="cypress" />

describe('Ask feedback form tests', () => {

    beforeEach(() => {
        cy.visit('/ask')

    })

    it('Application has the right title', () => {
        cy.title().should('include', 'FeedZback')
    })

    it("The form is not valid when all required input text are empty and input type emails are not email match", () => {
        cy.get('#your-email').should('have.class', 'ng-invalid')
        cy.get('#coworker-email').should('have.class', 'ng-invalid')
        cy.get('#askFeedbackForm').should('have.class', 'ng-invalid')
    })

    it('Required input borders become red when they are touched and not valid', () => {
        const borderColor = 'rgb(213, 33, 80)';

        cy.get('#your-email').type('example@example.com')
        cy.get('#your-email').clear();
        cy.get('#your-name').type('example@example.com')
        cy.get('#your-email').should('have.css', 'border-color').and('eq', borderColor)
        cy.get('#your-name').clear()
        cy.get('#coworker-email').type('example@example.com')
        cy.get('#your-name').should('have.css', 'border-color').and('eq', borderColor)
        cy.get('#coworker-email').clear()
        cy.get('#coworker-name').type('les points ppositifs sont:...')
        cy.get('#coworker-email').should('have.css', 'border-color').and('eq', borderColor)
        cy.get('#coworker-name').clear()
        cy.get('#message').type("salut")
        cy.get('#coworker-name').should('have.css', 'border-color').and('eq', borderColor)
    })

    it('The form is valid and send the feedback', () => {
        cy.get('#askFeedbackForm').within(() => {
            cy.get('#your-name').type('pierre henry')
            cy.get('#your-email').type('pierre.henry@example.com')
            cy.get('#coworker-name').type('marie mettrand')
            cy.get('#coworker-email').type('marie.mettrand@example.com')

            cy.get('#submit').click();
            // cy.wait('@SendFeedback')
        })
    })
})
