import { gql, useQuery } from "@apollo/client"
import React from "react"
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../graphql_type/restaurantsPageQuery"

// <==========( GraphQl )==========>
const RESTAURANT_QUERY = gql`
  query restaurantsPageQuery($input: AllRestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    allRestaurants(input: $input) {
      error
      ok
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`

export const Restaurants = () => {
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: { page: 1 },
    },
  })
  console.log(data)
  return <h1>Restaurants</h1>
}
