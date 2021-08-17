import { gql, useQuery } from "@apollo/client"
import { meQuery } from "../graphql_type/meQuery"

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

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY)
}
