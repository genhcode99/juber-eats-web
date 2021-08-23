import React from "react"
import CreateAccount from "../CreateAccount"
import { ApolloProvider } from "@apollo/client"
import { render, waitFor, RenderResult } from "../../test-utils"
import { createMockClient, MockApolloClient } from "mock-apollo-client"

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
})
