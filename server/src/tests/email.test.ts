
import getNameFromEmail from "../model/getNameFromEmail"

describe('Email test', () => { 

  it('get name from email', () => { 
      const email = "test.name@email.com"
       const name = getNameFromEmail(email)
       expect(name).toBe("Test Name")    
  })
 })
 