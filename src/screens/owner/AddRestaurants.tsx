import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Helmet } from "react-helmet-async"
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../graphql_type/createRestaurant"
import Button from "../../components/Button"
import { gql, useMutation } from "@apollo/client"
import { FormError } from "../../components/FormError"

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
  file: FileList
}

// <==========( Featrue )==========>
export const AddRestaurants = () => {
  // [ State ]
  const [uploading, setUploading] = useState(false)

  // [ onCompleted 정의]
  const onCompleted = (data: createRestaurant) => {
    const { ok, error } = data.createRestaurant
    if (ok) {
      setUploading(false)
    }
  }
  // [ mutation 정의 ]
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, { onCompleted })

  // [ userForm 정의 ]
  const {
    register,
    getValues,
    formState,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormProps>({ mode: "onChange" })

  // [ onSubmit 함수 정의 ]
  const onSubmit = async () => {
    // 사진파일 업로드 S3, url 가져오기
    try {
      setUploading(true)
      const { file, name, categoryName, address } = getValues()
      const actualFile = file[0]
      const formBody = new FormData()
      formBody.append("file", actualFile)
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json()

      // 데이터베이스에 업로드
      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
          },
        },
      })
    } catch (e) {}
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

        <div>
          <input
            type="file"
            accept="image/*"
            {...register("file", { required: true })}
          />
        </div>

        <Button
          canClick={formState.isValid}
          loading={uploading}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data?.createRestaurant.error} />
        )}
      </form>
    </div>
  )
}
