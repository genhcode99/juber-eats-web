import React from "react"
import Header from "../Header"
import { ME_QUERY } from "../../hooks/useMe"
import { render, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { BrowserRouter as Router } from "react-router-dom"

// <==========( Mock )==========>

// <==========( Test )==========>
describe("<Header />", () => {
  it("renders verify banner", async () => {
    await waitFor(async () => {
      const { debug } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>,
      )
      await new Promise((resolve) => setTimeout(resolve, 0))
      debug()
    })
  })
})
