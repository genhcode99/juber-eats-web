describe("Edit Profile", () => {
  const user = cy
  beforeEach(() => {
    user.login("test@email.com", "testPassword")
    user.get("a[href='/edit-profile']").click()
    user.wait(1000)
  })
  it("can go to / edit-profile using the header", () => {
    user.title().should("eq", "Edit Profile | Juber Eats")
  })

  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        //@ts-ignore
        req.body?.variables?.input?.email = "test@email.com"
      }
    })
    user.findByPlaceholderText(/email/i).clear().type("new@email.com")
    user.findByRole("button").click()
  })
})
