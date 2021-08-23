import React from "react"
import Login, { LOGIN_MUTATION } from "../Login"
import { ApolloProvider } from "@apollo/client"
import userEvent from "@testing-library/user-event"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter as Router } from "react-router-dom"
import { render, RenderResult, waitFor } from "@testing-library/react"
import { createMockClient, MockApolloClient } from "mock-apollo-client"

describe("<Login />", () => {
  let renderResult: RenderResult
  let mockedClient: MockApolloClient

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient()
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
    const { getByPlaceholderText, getByRole } = renderResult
    const email = getByPlaceholderText(/email/i)
    await waitFor(() => {
      userEvent.type(email, "this@wont")
    })
    let errorMessage = getByRole("alert")
    expect(errorMessage).toHaveTextContent(/The email format is not valid./i)
  })

  it("display password validation errors", async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult
    const email = getByPlaceholderText(/email/i)
    const submitBtn = getByRole("button")
    await waitFor(() => {
      userEvent.type(email, "test@email.com")
      userEvent.click(submitBtn)
    })
    let errorMessage = getByRole("alert")
    expect(errorMessage).toHaveTextContent(/Password Is Required/i)
  })

  it("submits form and call mutation", async () => {
    const formData = {
      email: "test@email.com",
      password: "testPassword",
    }

    const { getByPlaceholderText, debug, getByRole } = renderResult
    const email = getByPlaceholderText(/email/i)
    const password = getByPlaceholderText(/password/i)
    const submitBtn = getByRole("button")

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: { login: { ok: true, token: "xxx", error: null } },
    })
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse)

    await waitFor(() => {
      userEvent.type(email, formData.email)
      userEvent.type(password, formData.password)
      userEvent.click(submitBtn)
    })

    expect(mockedMutationResponse).toHaveBeenCalledTimes(1)
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        ...formData,
      },
    })
  })
})
