import { gql, useLazyQuery } from "@apollo/client"
import React, { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useHistory, useLocation } from "react-router-dom"
import { RESTAURANT_FRAGMENT } from "../../fragments"
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../graphql_type/searchRestaurant"

// <==========( GraphQl )==========>
const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantsInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      restaurants {
        ...RestaurantParts
      }
      totalResults
    }
  }
  ${RESTAURANT_FRAGMENT}
`

// <==========( Feature )==========>
export const Search = () => {
  // hooks
  const location = useLocation()
  const history = useHistory()

  const [searchRestaurantQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT)

  useEffect(() => {
    const [_, query] = location.search.split("?term=")
    if (!query) {
      //replace는 뒤로가기 히스토리가 없음
      return history.replace("/")
    }
    searchRestaurantQuery({
      variables: { input: { page: 1, query } },
    })
  }, [history, location.search])
  console.log(loading, data, called)

  // <==========( Presenter )==========>
  return (
    <div>
      <Helmet>
        <title>Home | Juber Eats</title>
      </Helmet>
      Search
    </div>
  )
}
