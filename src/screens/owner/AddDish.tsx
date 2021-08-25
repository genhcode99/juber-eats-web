import { gql, useMutation } from "@apollo/client"
import React from "react"
import { Helmet } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { useHistory, useParams } from "react-router-dom"
import Button from "../../components/Button"
import { FormError } from "../../components/FormError"
import { createDish, createDishVariables } from "../../graphql_type/createDish"
import { MY_RESTAURANT_QUERY } from "./MyRestaurant"

// <==========( GraphQl )==========>
const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`
// <==========( Settings )==========>
interface IForm {
  name: string
  price: string
  description: string
}

// <==========( Features )==========>
export const AddDish = () => {
  // [ hooks ]
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const history = useHistory()

  // [ backend ]
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: { id: +restaurantId },
        },
      },
    ],
  })

  // [ react hook form ]
  const {
    register,
    formState,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({ mode: "onChange" })

  // [ onSubmit ]
  const onSubmit = () => {
    const { name, price, description } = getValues()
    createDishMutation({
      variables: {
        input: {
          name,
          description,
          price: +price,
          restaurantId: +restaurantId,
        },
      },
    })
    history.goBack()
  }

  // <==========( Presenter )==========>
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3 max-w-screen-sm">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 my-5 w-full "
      >
        <input
          className="input"
          type="text"
          placeholder="Name"
          {...register("name", { required: "Name is required." })}
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}
        <input
          className="input"
          type="number"
          min={0}
          placeholder="Price"
          {...register("price", { required: "Price is required." })}
        />
        {errors.price?.message && (
          <FormError errorMessage={errors.price?.message} />
        )}
        <input
          className="input"
          type="text"
          placeholder="Description"
          {...register("description", { required: "Description is required." })}
        />
        {errors.description?.message && (
          <FormError errorMessage={errors.description?.message} />
        )}
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Dish"
        />
      </form>
    </div>
  )
}
