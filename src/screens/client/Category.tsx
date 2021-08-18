import React, { useState } from "react"
import { useParams } from "react-router-dom"
import {
  findCategoryBySlug,
  findCategoryBySlugVariables,
} from "../../graphql_type/findCategoryBySlug"
import { gql, useQuery } from "@apollo/client"
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments"
import { Restaurant } from "../../components/Restaurant"

// <==========( GraphQl )==========>
const CATEGORY_QUERY = gql`
  query findCategoryBySlug($input: CategoryInput!) {
    findCategoryBySlug(input: $input) {
      ok
      error
      totalPages
      category {
        ...CategoryParts
      }
      restaurants {
        ...RestaurantParts
      }
      totalResults
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`

// <==========( Settings )==========>
interface IPatamsType {
  slug: string
}

// <==========( Feature )==========>
export const Category = () => {
  const { slug } = useParams<IPatamsType>()
  const [page, setPage] = useState(1)

  const { data, loading } = useQuery<
    findCategoryBySlug,
    findCategoryBySlugVariables
  >(CATEGORY_QUERY, { variables: { input: { page, slug } } })

  const categoryName = data?.findCategoryBySlug.category?.name

  // pagination
  const onClickNext = () => setPage((current) => current + 1)
  const onClickPrev = () => setPage((current) => current - 1)

  // <==========( Presenter )==========>
  return (
    <div className="max-w-screen-2xl mx-auto mt-8 px-5 pb-20">
      <div className="max-w-screen-2xl grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-16">
        {data?.findCategoryBySlug.restaurants?.map((restaurant) => (
          <Restaurant
            key={restaurant.id}
            id={restaurant.id + ""}
            coverImg={`url(${restaurant.coverImg})`}
            name={restaurant.name}
            categoryName={categoryName}
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
          Page {page} of {data?.findCategoryBySlug.totalPages}
        </span>
        {page !== data?.findCategoryBySlug.totalPages ? (
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
  )
}
