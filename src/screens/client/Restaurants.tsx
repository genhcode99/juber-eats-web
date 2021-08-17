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
  return (
    <div>
      <form className="w-full bg-gray-800 py-40 flex items-center justify-center">
        <input
          type="search"
          placeholder="Search Reataurants..."
          className="input w-3/12 rounded-md border-0"
        />
      </form>
      <div>
        {!loading && (
          <div className="max-w-screen-2xl mx-auto mt-8">
            <div className=" max-w-md mx-auto flex justify-around">
              {data?.allCategories.categories?.map((category) => (
                <div className="flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-full bg-cover hover:bg-gray-100 cursor-pointer"
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                  ></div>
                  <span className="text-sm text-center font-medium mt-1">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
