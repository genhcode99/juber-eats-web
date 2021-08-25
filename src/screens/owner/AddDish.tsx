import { gql, useMutation } from "@apollo/client"
import React from "react"
import { useParams } from "react-router-dom"
import { createDish, createDishVariables } from "../../graphql_type/createDish"

// <==========( GraphQl )==========>
const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`

// <==========( Features )==========>
export const AddDish = () => {
  // [ hooks ]
  const { restaurantId } = useParams<{ restaurantId: string }>()

  // [ create dish ]
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION)

  // <==========( Presenter )==========>
  return <div>AddDish</div>
}
