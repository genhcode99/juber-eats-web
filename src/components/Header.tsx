import React from "react"
import juberLogo from "../images/Logo.svg"
const Header = () => {
  return (
    <header className="py-4">
      <div className="w-full max-w-screen-xl mx-auto">
        <img src={juberLogo} alt="Juber Eats" className="w-40 mb-10" />
      </div>
    </header>
  )
}

export default Header
