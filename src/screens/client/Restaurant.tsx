import React, { useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments"
import { restaurant, restaurantVariables } from "../../graphql_type/restaurant"
import { Dish } from "../../components/Dish"
import { Helmet } from "react-helmet-async"
import { CreateOrderItemInput } from "../../graphql_type/globalTypes"

// <==========( GraphQl )==========>
const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`
const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`

// <==========( Settings )==========>
interface IParamsType {
  id: string
}

// <==========( Feature )==========>
export const Restaurant = () => {
  // [ hook ]
  const { id } = useParams<IParamsType>()

  // [ backend ]
  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: { input: { restaurantId: +id } },
  })
  const restaurant = data?.restaurant.restaurant

  // [ order ]
  const [orderStarted, setOrderStarted] = useState(false)
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([])
  const triggerStartOrder = () => {
    setOrderStarted(true)
  }
  const isSelected = (dishId: number) =>
    Boolean(orderItems.find((order) => order.dishId === dishId))

  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      setOrderItems((current) =>
        current.filter((dish) => dish.dishId !== dishId),
      )
    } else {
      setOrderItems((current) => [{ dishId }, ...current])
    }
  }

  console.log(orderItems)

  // <==========( Presenter )==========>
  return (
    <div>
      <Helmet>
        <title> {restaurant?.name || ""} | Juber Eats </title>
      </Helmet>
      <div
        className="bg-gray-800 py-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant?.coverImg})` }}
      >
        <div className="bg-white w-1/4 py-8 pl-48">
          <h4 className="text-4xl mb-4">{restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>
      <div className="container pb-32 flex flex-col items-end mt-20">
        <button onClick={triggerStartOrder} className="btn  px-10">
          {orderStarted ? "Ordering" : "Start Order"}
        </button>
        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-16">
          {restaurant?.menu?.map((dish) => (
            <Dish
              isSelected={isSelected(dish.id)}
              id={dish.id}
              orderStarted={orderStarted}
              key={dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
