import React from "react"
import CreateAccount, { CREATE_ACCOUNT_MUTATION } from "../CreateAccount"
import { ApolloProvider } from "@apollo/client"
import userEvent from "@testing-library/user-event"
import { render, waitFor, RenderResult } from "../../test-utils"
import { createMockClient, MockApolloClient } from "mock-apollo-client"
import { UserRole } from "../../graphql_type/globalTypes"

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient
  let renderResult: RenderResult
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient()
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>,
      )
    })
  })

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Juber Eats")
    })
  })

  it("renders validation errors", async () => {
    const { getByRole, getByPlaceholderText, debug } = renderResult
    const email = getByPlaceholderText(/email/i)
    const password = getByPlaceholderText(/password/i)
    const button = getByRole("button")

    await waitFor(() => {
      userEvent.type(email, "wont@work")
    })
    let errorMessage = getByRole("alert")
    expect(errorMessage).toHaveTextContent(/The email format is not valid./i)

    await waitFor(() => {
      userEvent.clear(email)
    })
    errorMessage = getByRole("alert")
    expect(errorMessage).toHaveTextContent(/Email Is Required/i)

    await waitFor(() => {
      userEvent.type(email, "test@email.com")
      userEvent.click(button)
    })
    errorMessage = getByRole("alert")
    expect(errorMessage).toHaveTextContent(/Password Is Required/i)
  })

  it("submits mutaion with form values", async () => {
    const { getByRole, getByPlaceholderText, debug } = renderResult
    const email = getByPlaceholderText(/email/i)
    const password = getByPlaceholderText(/password/i)
    const button = getByRole("button")

    const formData = {
      email: "test@email.com",
      password: "testPassword",
      role: UserRole.Client,
    }

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    })
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse,
    )

    jest.spyOn(window, "alert").mockImplementation(() => null)

    await waitFor(() => {
      userEvent.type(email, formData.email)
      userEvent.type(password, formData.password)
      userEvent.click(button)
    })

    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1)
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        ...formData,
      },
    })

    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!")
    const mutationError = getByRole("alert")
    expect(mutationError).toHaveTextContent("mutation-error")
  })
})
