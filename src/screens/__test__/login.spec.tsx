import React from "react"
import Login from "../Login"
import { ApolloProvider } from "@apollo/client"
import userEvent from "@testing-library/user-event"
import { HelmetProvider } from "react-helmet-async"
import { createMockClient } from "mock-apollo-client"
import { BrowserRouter as Router } from "react-router-dom"
import { render, RenderResult, waitFor } from "@testing-library/react"

describe("<Login />", () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    await waitFor(() => {
      const mockedClient = createMockClient()
      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>,
      )
    })
  })

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Juber Eats")
    })
  })

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult
    const email = getByPlaceholderText(/email/i)
    await waitFor(() => {
      userEvent.type(email, "this@wont")
    })
    let errorMessage = getByRole("alert")
    expect(errorMessage).toHaveTextContent(/The email format is not valid./i)
    await waitFor(() => {
      userEvent.clear(email)
      debug()
    })
  })
})
