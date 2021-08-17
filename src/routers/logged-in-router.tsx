import React from "react"
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"
import { useMe } from "../hooks/useMe"
import Header from "../components/Header"
import Restaurants from "../screens/client/Restaurants"

// <==========( Route )==========>
const ClientRoutes = [
  <Route exact path="/">
    <Restaurants />
  </Route>,
]

// <==========( 컴포넌트 )==========>
export const LoggedInRouter = () => {
  // <==========( 기능 )==========>
  const { data, loading, error } = useMe()

  // <==========( Loading 화면 출력 )==========>
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    )
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        <Redirect to="/" />
      </Switch>
    </Router>
  )
}
