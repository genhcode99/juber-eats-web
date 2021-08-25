import { gql, useQuery } from "@apollo/client"
import React from "react"
import { useParams } from "react-router-dom"
import { RESTAURANT_FRAGMENT } from "../../fragments"
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../graphql_type/myRestaurant"

// <==========( GraphQl )==========>
const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`

// <==========( Settings )==========>
interface IParams {
  id: string
}

// <==========( Features )==========>
export const MyRestaurant = () => {
  // [ hooks ]
  const { id } = useParams<IParams>()

  // [ backend ]
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    { variables: { input: { id: +id } } },
  )
  console.log(data)

  // <==========( Presenter )==========>
  return <div>MyRestaurant</div>
}
