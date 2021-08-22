import React from "react"
import NotFound from "../404"
import { render, waitFor } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter as Router } from "react-router-dom"
import { async } from "q"

describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound />
        </Router>
      </HelmetProvider>,
    )
    await waitFor(() => {
      expect(document.title).toBe("Not found | Juber Eats")
    })
  })
})
