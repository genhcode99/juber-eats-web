import React from "react"
import { useForm } from "react-hook-form"
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../graphql_type/createRestaurant"
import { gql, useMutation } from "@apollo/client"
import Button from "../../components/Button"
import { FormError } from "../../components/FormError"
import { Helmet } from "react-helmet-async"

// <==========( GraphQl )==========>
const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`
// <==========( Settings )==========>
interface IFormProps {
  name: string
  address: string
  categoryName: string
}

// <==========( Featrue )==========>
export const AddRestaurants = () => {
  // [ mutation 정의 ]
  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION)

  // [ userForm 정의 ]
  const {
    register,
    getValues,
    formState,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormProps>({ mode: "onChange" })

  // [ onSubmit 함수 정의 ]
  const onSubmit = () => {
    console.log(getValues())
  }

  // <==========( Presenter )==========>
  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Juber Eats</title>
      </Helmet>
      <h1>Add Restaurant</h1>
      <form
        className="grid gap-3 mt-5 w-full mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          className="input"
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}

        <input
          type="text"
          className="input"
          placeholder="Address"
          {...register("address", { required: "Address is required" })}
        />
        {errors.address?.message && (
          <FormError errorMessage={errors.address?.message} />
        )}

        <input
          type="text"
          className="input"
          placeholder="CategoryName"
          {...register("categoryName", {
            required: "CategoryName is required",
          })}
        />
        {errors.categoryName?.message && (
          <FormError errorMessage={errors.categoryName?.message} />
        )}

        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data?.createRestaurant.error} />
        )}
      </form>
    </div>
  )
}
