import { gql, useQuery } from "@apollo/client"
import React, { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { useHistory } from "react-router-dom"
import { FormError } from "../../components/FormError"
import { Restaurant } from "../../components/Restaurant"
import { RESTAURANT_FRAGMENT } from "../../fragments"
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
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`
// <==========( Settings )==========>
interface ISearchData {
  searchTerm: string
}

// <==========( Featuer )==========>
export const Restaurants = () => {
  // state
  const [page, setPage] = useState(1)

  // load page
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: { page },
    },
  })

  // pagination
  const onClickNext = () => setPage((current) => current + 1)
  const onClickPrev = () => setPage((current) => current - 1)

  // search
  const history = useHistory()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ISearchData>({ mode: "onChange" })

  const onSearchSubmit = () => {
    const { searchTerm } = getValues()
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    })
  }

  // <==========( Presenter )==========>
  return (
    <div>
      <Helmet>
        <title>Home | Juber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="w-full bg-gray-800 py-40 flex flex-col items-center justify-center"
      >
        <input
          type="search"
          placeholder="Search Reataurants..."
          className="input w-3/4 md:w-1/2 lg:w-2/5 rounded-md border-0"
          {...register("searchTerm", {
            required: true,
            minLength: {
              value: 3,
              message: "Please search for more than 3 characters.",
            },
          })}
        />
        {errors.searchTerm?.message && (
          <FormError errorMessage={errors.searchTerm?.message} />
        )}
      </form>
      <div>
        {!loading && (
          <div className="max-w-screen-2xl mx-auto mt-8 px-5 pb-20">
            <div className=" max-w-md mx-auto flex justify-around">
              {data?.allCategories.categories?.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center cursor-pointer group"
                >
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-16">
              {data?.allRestaurants.results?.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
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
