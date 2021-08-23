describe("Log In", () => {
  const user = cy

  it("should see login page", () => {
    user.visit("/").title().should("eq", "Login | Juber Eats")
  })

  it("can see email / password validation errors", () => {
    user.visit("/")
    user.findByPlaceholderText(/email/i).type("bad@email")
    user
      .findByRole("alert")
      .should("have.text", "The email format is not valid.")
    user.findByPlaceholderText(/email/i).clear()
    user.findByRole("alert").should("have.text", "Email Is Required")
    user.findByPlaceholderText(/email/i).type("test@email.com")
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear()
    user.findByRole("alert").should("have.text", "Password Is Required")
  })

  it("can fill out the form", () => {
    user.visit("/")
    user.findByPlaceholderText(/email/i).type("Client@email.com")
    user.findByPlaceholderText(/password/i).type("123")
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click()
    user.window().its("localStorage.juber-token").should("be.a", "string ")
  })
})
