import React from "react"
import { Restaurant } from "../Restaurant"
import { render } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"

describe("<Restaurant />", () => {
  it("renders OK with props", () => {
    const restaurantProps = {
      id: "1",
      coverImg: "x",
      name: "nameTest",
      categoryName: "catName",
    }
    const { getByText, container } = render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>,
    )
    getByText(restaurantProps.name)
    getByText(restaurantProps.categoryName)
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurants/${restaurantProps.id}`,
    )
  })
})