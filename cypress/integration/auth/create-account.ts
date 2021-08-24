describe("Create Account", () => {
  const user = cy
  it("should see email / password validation errors", () => {
    user.visit("/")

    user.findByText(/create an account/i).click()
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

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({ fixture: "auth/create-account.json" })
        })
      }
    })
    user.visit("/create-account")
    user.findByPlaceholderText(/email/i).type("test@email.com")
    user.findByPlaceholderText(/password/i).type("testPassword")
    user.findByRole("button").click()
    user.wait(1000)
    user.login("test@email.com", "testPassword")
  })
})
