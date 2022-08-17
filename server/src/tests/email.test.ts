/**@module unit-tests */
import getNameFromEmail from "../model/getNameFromEmail"

/**
 * Verify if we can get a first and last name from a given email
 */
describe('Email test', () => { 

  it('get name from email', () => { 
      const email = "test.name@email.com"
       const name = getNameFromEmail(email)
       expect(name).toBe("Test Name")    
  })
 })
 