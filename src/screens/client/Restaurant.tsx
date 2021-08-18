import React from "react"
import { gql, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"
import { RESTAURANT_FRAGMENT } from "../../fragments"
import { restaurant, restaurantVariables } from "../../graphql_type/restaurant"

// <==========( GraphQl )==========>
const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
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
interface IParamsType {
  id: string
}

// <==========( Feature )==========>
export const Restaurant = () => {
  // hook
  const { id } = useParams<IParamsType>()

  const { loading, data } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_QUERY,
    { variables: { input: { restaurantId: +id } } },
  )

  const restaurant = data?.restaurant.restaurant

  // <==========( Presenter )==========>
  return (
    <div>
      <div
        className="bg-gray-800 py-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant?.coverImg})` }}
      >
        <div className="bg-white w-1/4 py-8 pl-48">
          <h4 className="text-4xl mb-4">{restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>
    </div>
  )
}
