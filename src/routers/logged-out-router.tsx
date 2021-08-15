import React from "react"
import Login from "../screens/Login"
import CreateAccount from "../screens/CreateAccount"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

// * 컴포넌트
export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  )
}
