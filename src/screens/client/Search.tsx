import { gql, useLazyQuery } from "@apollo/client"
import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useHistory, useLocation } from "react-router-dom"
import { Restaurant } from "../../components/Restaurant"
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
  // state
  const [page, setPage] = useState(1)

  // hooks
  const location = useLocation()
  const history = useHistory()

  const [searchRestaurantQuery, { data }] = useLazyQuery<
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
      variables: { input: { page, query } },
    })
  }, [history, location.search, page, searchRestaurantQuery])

  // pagination
  const onClickNext = () => setPage((current) => current + 1)
  const onClickPrev = () => setPage((current) => current - 1)

  // <==========( Presenter )==========>
  return (
    <div className="max-w-screen-2xl mx-auto mt-8 px-5 pb-20">
      <div className="max-w-screen-2xl grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-16">
        {data?.searchRestaurant.restaurants &&
          data?.searchRestaurant.restaurants.map((restaurant) => (
            <Restaurant
              key={restaurant.id}
              id={restaurant.id + ""}
              coverImg={`url(${restaurant.coverImg})`}
              name={restaurant.name}
              categoryName={restaurant.category?.name}
            />
          ))}
      </div>
      {data?.searchRestaurant.restaurants?.length !== 0 ? (
        <div className="grid grid-cols-3 items-center max-w-md mx-auto mt-10">
          {page > 1 ? (
            <button
              onClick={onClickPrev}
              className="font-medium text-2xl focus-within:outline-none"
            >
              &larr;
            </button>
          ) : (
            <div></div>
          )}
          <span>
            Page {page} of {data?.searchRestaurant.totalPages}
          </span>
          {page !== data?.searchRestaurant.totalPages ? (
            <button
              onClick={onClickNext}
              className="font-medium text-2xl focus-within:outline-none"
            >
              &rarr;
            </button>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <h2 className="text-center">Restaurant Not Found</h2>
      )}
    </div>
  )
}
