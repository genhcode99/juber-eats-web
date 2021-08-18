import { gql, useQuery } from "@apollo/client"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments"
import {
  findCategoryBySlug,
  findCategoryBySlugVariables,
} from "../../graphql_type/findCategoryBySlug"

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
  const { data, loading } = useQuery<
    findCategoryBySlug,
    findCategoryBySlugVariables
  >(CATEGORY_QUERY, { variables: { input: { page: 1, slug } } })

  console.log(data?.findCategoryBySlug)
  // <==========( Presenter )==========>
  return <div>hi</div>
}
