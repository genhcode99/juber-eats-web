describe("Log In", () => {
  it("should see login page", () => {
    cy.visit("/").title().should("eq", "Login | Juber Eats")
  })

  it("can fill out the form", () => {
    cy.visit("/")
      .findByPlaceholderText(/email/i)
      .type("test@email.com")
      .findByPlaceholderText(/password/i)
      .type("testPassword")
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
  })

  it("can see email / password validation errors", () => {
    cy.visit("/")
      .findByPlaceholderText(/email/i)
      .type("bad@email")
      .findByRole("alert")
      .should("have.text", "The email format is not valid.")
  })
})
