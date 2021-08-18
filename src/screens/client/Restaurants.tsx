import { gql, useQuery } from "@apollo/client"
import { url } from "inspector"
import React, { useState } from "react"
import { Restaurant } from "../../components/Restaurant"
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

// <==========( Featuer )==========>
export const Restaurants = () => {
  const [page, setPage] = useState(1)

  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: { page },
    },
  })

  const onClickNext = () => setPage((current) => current + 1)
  const onClickPrev = () => setPage((current) => current - 1)

  // <==========( Presenter )==========>
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
          <div className="max-w-screen-2xl mx-auto mt-8 px-5 pb-20">
            <div className=" max-w-md mx-auto flex justify-around">
              {data?.allCategories.categories?.map((category) => (
                <div className="flex flex-col items-center cursor-pointer group">
                  <div
                    className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-200 "
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                  ></div>
                  <span className="text-sm text-center font-medium mt-1">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-16">
              {data?.allRestaurants.results?.map((restaurant) => (
                <Restaurant
                  id={restaurant.id + ""}
                  coverImg={`url(${restaurant.coverImg})`}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
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
                Page {page} of {data?.allRestaurants.totalPages}
              </span>
              {page !== data?.allRestaurants.totalPages ? (
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
          </div>
        )}
      </div>
    </div>
  )
}
