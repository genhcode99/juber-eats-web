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
    user.findByPlaceholderText(/email/i).clear().type("new@email.com")
    user.findByRole("button").click()
  })
})
