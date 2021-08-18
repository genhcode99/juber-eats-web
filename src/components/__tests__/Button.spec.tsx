import { render } from "@testing-library/react"
import Button from "../Button"
import React from "react"

describe("<Button />", () => {
  it("should render OK with props", () => {
    const { getByText } = render(
      <Button canClick={true} loading={false} actionText={"test"} />,
    )
    getByText("test")
  })

  it("should display loading", () => {
    const { debug, getByText, container } = render(
      <Button canClick={false} loading={true} actionText={"test"} />,
    )
    container.firstChild
    getByText("Loading...")
    expect(container.firstChild).toHaveClass("pointer-events-none")
  })
})
