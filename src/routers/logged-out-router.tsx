import React from "react"
import Login from "../screens/Login"
import CreateAccount from "../screens/CreateAccount"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import NotFound from "../screens/404"

// * 컴포넌트
export const LoggedOutRouter = () => {
  // Switch 는 한번에 한개의 라우터만 랜더링하라는 뜻임
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  )
}
