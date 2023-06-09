describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.visit('')

    const user = {
      name: 'sroot',
      username: 'sroot',
      password: 'salainen'
    }

    const user2 = {
      name: 'root',
      username: 'root',
      password: 'salainen'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('sroot')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('sroot')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error-info').should('contain', 'invalid username or password')
      cy.get('.error-info').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error-info').should('have.css', 'border-style', 'solid')
    })
  })


  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'sroot', password: 'salainen' })

      cy.createBlog({
        title: 'xxx',
        author: 'bbb',
        url: 'ccc'
      })
    })

    it('A blog can be created', function() {
      cy.contains('sroot is logged in')
      cy.get('#show-blog-button').click()
      cy.get('[name="title"').type('My new Cypress blog')
      cy.get('[name="author"').type('tester')
      cy.get('[name="url"').type('https://somefancyurl.com')
      cy.get('#create-blog-button').click()

      cy.get('.error-info').should('contain', 'A new blog My new Cypress blog by tester added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('#app')
        .children(':last-child')
        .should('contain', 'My new Cypress blog tester')
    })

    it('Blog can be liked', function() {
      cy.get('#app')
        .children(':last-child')
        .contains('view')
        .click()
      cy.get('#app')
        .children(':last-child')
        .contains('likes 0')
      cy.get('#app')
        .children(':last-child')
        .contains('like')
        .click()
      cy.get('#app')
        .children(':last-child')
        .contains('likes 1')
    })

    it('Blog can be deleted only by the owner', function() {
      cy.contains('log out').click()

      cy.login({ username: 'root', password: 'salainen' })
      cy.get('#app')
        .children(':last-child')
        .contains('view')
        .click()
      cy.get('#app')
        .children(':last-child')
        .get('delete')
        .should('not.exist')

      cy.createBlog({
        title: 'Blog to delete',
        author: 'Me',
        url: 'https://deleteme.com'
      })

      cy.get('#app')
        .children(':last-child')
        .children(':last-child')
        .contains('view')
        .click()

      cy.get('#app')
        .children(':last-child')
        .children(':last-child')
        .children(':last-child')
        .contains('delete')
        .click()

      cy.get('.error-info').should('contain', 'Blog has been removed')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('Only the creator of the blog can see the delete button', function() {
      cy.get('#app')
        .children(':last-child')
        .contains('view')
        .click()

      cy.get('#app')
        .children(':last-child')
        .children(':last-child')
        .contains('delete')

      cy.contains('log out').click()

      cy.login({ username: 'root', password: 'salainen' })

      cy.get('#app')
        .children(':last-child')
        .contains('view')
        .click()

      cy.get('#app')
        .children(':last-child')
        .children(':last-child')
        .get('delete')
        .should('not.exist')
    })

    it('blogs being ordered by most likes', function() {
      cy.createBlog({
        title: 'Blog to rate',
        author: 'Me',
        url: 'https://rateme.com',
      })
      cy.createBlog({
        title: 'Blog to delete',
        author: 'Me',
        url: 'https://deleteme.com',
      })

      cy.contains('xxx')
        .parent()
        .as('xxx')

      cy.get('@xxx').contains('view').click()

      cy.contains('Blog to rate')
        .parent()
        .as('blog1')

      cy.get('@blog1').contains('view').click()

      cy.contains('Blog to delete')
        .parent()
        .as('blog2')

      cy.get('@blog2').contains('view').click()

      cy.get('.shown').eq(0).should('contain', 'xxx')
      cy.get('.shown').eq(1).should('contain', 'Blog to rate')

      Cypress._.times(5, () => {
        cy.get('@blog2')
          .contains('like').click()
        cy.wait(500)
      })
      cy.get('@xxx')
        .contains('like').click()

      cy.wait(500)

      cy.get('.shown').eq(0).should('contain', 'Blog to delete')
      cy.get('.shown').eq(1).should('contain', 'xxx')
    })


  })
})