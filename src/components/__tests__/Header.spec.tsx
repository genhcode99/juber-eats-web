import React from "react"
import Header from "../Header"
import { ME_QUERY } from "../../hooks/useMe"
import { render, waitFor } from "../../test-utils"
import { MockedProvider } from "@apollo/client/testing"

// waitFor() 관련 이슈
describe("<Header />", () => {
  it("renders OK", async () => {
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
          <Header />
        </MockedProvider>,
      )
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
  })
})
