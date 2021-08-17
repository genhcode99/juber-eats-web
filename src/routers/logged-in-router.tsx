import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import Header from "../components/Header"
import Restaurants from "../screens/client/Restaurants"
import NotFound from "../screens/404"
import { ConfirmEmail } from "../screens/user/ConfirmEmail"
import { EditProfile } from "../screens/user/EditProfile"

// <==========( Route )==========>
const ClientRoutes = [
  <Route key={1} exact path="/">
    <Restaurants />
  </Route>,
  <Route key={2} exact path="/confirm">
    <ConfirmEmail />
  </Route>,
  <Route key={3} exact path="/edit-profile">
    <EditProfile />
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
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  )
}
