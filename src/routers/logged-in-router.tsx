import React from "react"
import { isLoggedInVar } from "../apollo"
import { gql, useQuery } from "@apollo/client"
import { meQuery } from "../graphql_type/meQuery"

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

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY)

  // <==========( Loading 화면 출력)==========>
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    )
  }
  return (
    <div>
      <h1>{data.me.email}</h1>
    </div>
  )
}
