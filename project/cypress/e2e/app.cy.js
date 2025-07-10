

describe('Workora App E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Home page loads and waitlist signup works', () => {
    cy.contains('Get Help').should('exist')
    cy.get('input[type="email"]').first().type('test' + Date.now() + '@example.com')
    cy.contains('Join Waitlist').click({ force: true })
    cy.contains('waitlist', { matchCase: false })
  })

  it('Shows error for duplicate waitlist email', () => {
    const email = 'duplicate@example.com'
    cy.get('input[type="email"]').first().clear().type(email)
    cy.contains('Join Waitlist').click({ force: true })
    cy.contains('already on our waitlist', { matchCase: false })
  })

  it('Business registration validation', () => {
    cy.visit('/register-business')
    cy.get('button[type="submit"]').click()
    cy.contains('Please fill in all required fields').should('exist')
  })

  it('Worker registration validation', () => {
    cy.visit('/register-worker')
    cy.get('button[type="submit"]').click()
    cy.contains('Please fill in all required fields').should('exist')
  })

  it('Login with wrong password shows error', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Login failed').should('exist')
  })

  it('Contact form validation', () => {
    cy.get('footer').within(() => {
      cy.get('button[type="submit"]').click()
    })
    cy.contains('Failed to send message').should('exist')
  })
}) 