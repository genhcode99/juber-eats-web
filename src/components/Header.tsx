import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import juberLogo from "../images/Logo.svg"

// <==========( Feature )==========>
const Header: React.FC = () => {
  const { data } = useMe()
  console.log(data)
  // <==========( Presenter )==========>
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 2xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={juberLogo} alt="Juber Eats" className="w-44" />
          </Link>
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className=" text-xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  )
}

export default Header
