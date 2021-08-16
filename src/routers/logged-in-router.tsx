import React from "react"
import { gql, useQuery } from "@apollo/client"
import { meQuery } from "../graphql_type/meQuery"
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"
import Restaurants from "../screens/client/Restaurants"

// <==========( Route )==========>
const ClientRoutes = [
  <Route exact path="/">
    <Restaurants />
  </Route>,
]

// <==========( Graphql )==========>
const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`
// <==========( 설정 )==========>

// <==========( 컴포넌트 )==========>
export const LoggedInRouter = () => {
  // <==========( 기능 )==========>
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY)

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
      <Switch>{data.me.role === "Client" && ClientRoutes}</Switch>
      <Redirect to="/" />
    </Router>
  )
}
