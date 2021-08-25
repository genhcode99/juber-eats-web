import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Helmet } from "react-helmet-async"
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../graphql_type/createRestaurant"
import Button from "../../components/Button"
import { gql, useApolloClient, useMutation } from "@apollo/client"
import { FormError } from "../../components/FormError"
import { MY_RESTAURANTS_QUERY } from "./MyRestaurants"
import { useHistory } from "react-router-dom"

// <==========( GraphQl )==========>
const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
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
  const [imageUrl, setImageUrl] = useState("")

  // [ Hooks ]
  const client = useApolloClient()
  const history = useHistory()

  // [ onCompleted 정의]
  const onCompleted = (data: createRestaurant) => {
    const { ok, restaurantId } = data.createRestaurant
    if (ok) {
      const { name, categoryName, address } = getValues()
      setUploading(false)

      // 현재의 캐쉬상태를 읽음
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY })
      console.log(queryResult)
      // 캐쉬를 작성
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      })
      history.push("/")
    }
  }

  // [ mutation 정의 ]
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }], 이렇게 하면 리페치가 되지만 느려질수 있다.
  })

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
      setImageUrl(coverImg)

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
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Juber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3 max-w-screen-sm">
        Add Restaurant
      </h4>
      <form
        className="grid max-w-screen-sm gap-3 my-5 w-full"
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
