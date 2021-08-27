import { gql, useQuery } from "@apollo/client"
import React from "react"
import { useParams } from "react-router-dom"
import { getOrder, getOrderVariables } from "../graphql_type/getOrder"

// <==========( Graphql )==========>
const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        status
        total
        driver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`

// <==========( Settings )==========>
interface IParams {
  id: string
}

// <==========( Features )==========>
export const Order = () => {
  // <주소의 파라메터 ID 가져오기>
  const params = useParams<IParams>()

  // <Order 정보 가져오기>
  const { data } = useQuery<getOrder, getOrderVariables>(GET_ORDER_QUERY, {
    variables: { input: { id: +params.id } },
  })
  console.log(data)

  // <==========( Presenter )==========>
  return <div>{params.id}</div>
}
