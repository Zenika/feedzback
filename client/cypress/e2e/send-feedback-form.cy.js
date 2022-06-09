/// <reference types="cypress" />
const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/database");
require("firebase/compat/firestore");
import admin from 'firebase-admin'
const { attachCustomCommands } = require("cypress-firebase");
require('dotenv').config();
const firebaseConfig= {
  apiKey: "AIzaSyAKtg1emw7hq7teSDzrhMXmh6uFWC4lDAc",
  authDomain: "feedzback-343709.firebaseapp.com",
  projectId: "feedzback-343709",
  storageBucket: "feedzback-343709.appspot.com",
  messagingSenderId: "370604731143",
  appId: "1:370604731143:web:316617cb05f1a3611533a2",
  measurementId: "G-HDCC6605DV",
};
describe('Send feedback form tests', () => {
  firebase.default.initializeApp(firebaseConfig)
  attachCustomCommands({Cypress: Cypress, cy: cy,firebase: firebase.default});
  beforeEach(() => {
  
    // cy.intercept('POST','/graphql',req =>{
    //   if (req.body.hasOwnProperty('query') && req.body.query.includes('mutation')){   
    //     req.alias=`SendFeedback`
    //     req.reply((res)=>{
    //       res.body.data.sendFeedback="mock:Votre feedback a été envoyé!"
    //     })
    //   }
    // }).as('SendFeedback')
   cy.visit('/send')

  })


  it('Application has the right title',()=>{
    cy.title().should('include','FeedZback')
  })
  it("The form is not valid when all required input text are empty and input type emails are not email match",()=>{
    cy.get('#your-email').should('have.class','ng-invalid')
    cy.get('#coworker-email').should('have.class','ng-invalid')
    cy.get('#positive-feedback').should('have.class','ng-invalid')
    cy.get('#to-improve-feedback').should('have.class','ng-invalid')
    cy.get('#feedbackForm').should('have.class','ng-invalid')
  })
 

  it('Required input borders become red when they are touched and not valid',()=>{
    cy.get('#your-email').type('example@example.com')
    cy.get('#your-email').clear();
    cy.get('#your-name').type('example@example.com')
    cy.get('#your-email').should('have.css','border-color').and('eq','rgb(213, 33, 80)')
    cy.get('#your-name').clear()
    cy.get('#coworker-email').type('example@example.com')
    cy.get('#your-name').should('have.css','border-color').and('eq','rgb(213, 33, 80)')
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
      cy.get('#your-name').type('pierre henry')
      cy.get('#your-email').type('pierre.henry@example.com')
      cy.get('#coworker-name').type('marie mettrand')
      cy.get('#coworker-email').type('marie.mettrand@example.com')
      cy.get('#positive-feedback').type('les points poitifs sont:......')
      cy.get('#to-improve-feedback').type('les axes dAmeliorations sont:.....')
     
      cy.get('#submit').click();
      // cy.wait('@SendFeedback')
    })
  })

})
