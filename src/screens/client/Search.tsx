import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"

// <==========( Settings )==========>

// <==========( Feature )==========>
export const Search = () => {
  const location = useLocation()

  useEffect(() => {
    console.log(location)
  }, [])

  // <==========( Presenter )==========>
  return <h1>Search</h1>
}
