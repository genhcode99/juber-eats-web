import React, { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import { useHistory, useParams } from "react-router-dom"
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments"
import { restaurant, restaurantVariables } from "../../graphql_type/restaurant"
import { Dish } from "../../components/Dish"
import { Helmet } from "react-helmet-async"
import {
  CreateOrderInput,
  CreateOrderItemInput,
} from "../../graphql_type/globalTypes"
import { DishOption } from "../../components/DishOption"
import {
  createOrder,
  createOrderVariables,
} from "../../graphql_type/createOrder"

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
      orderId
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
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId)
  }
  const isSelected = (dishId: number) => Boolean(getItem(dishId))

  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      setOrderItems((current) =>
        current.filter((dish) => dish.dishId !== dishId),
      )
    } else {
      setOrderItems((current) => [{ dishId, options: [] }, ...current])
    }
  }
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return
    }
    const oldItem = getItem(dishId)
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((aOption) => aOption.name === optionName),
      )
      if (!hasOption) {
        setOrderItems((current) =>
          current.filter((dish) => dish.dishId !== dishId),
        )
        setOrderItems((current) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ])
      }
    }
  }

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return
    }
    const oldItem = getItem(dishId)
    if (oldItem) {
      setOrderItems((current) =>
        current.filter((dish) => dish.dishId !== dishId),
      )
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName,
          ),
        },
        ...current,
      ])
      return
    }
  }

  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string,
  ) => {
    return item.options?.find((option) => option.name === optionName)
  }

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId)
    if (item) {
      return Boolean(getOptionFromItem(item, optionName))
    }
    return false
  }

  const triggerCancelOrder = () => {
    setOrderStarted(false)
    setOrderItems([])
  }

  const history = useHistory()

  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data
    if (data.createOrder.ok) {
      history.push(`/orders/${orderId}`)
    }
  }

  const [createOrderMutation, { loading: placeingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, { onCompleted })

  const triggerConfirmOrder = () => {
    if (placeingOrder) {
      return
    }
    if (orderItems.length === 0) {
      alert("Can't place empty order")
      return
    }
    const ok = window.confirm("You are about to place an order")
    if (ok) {
      createOrderMutation({
        variables: { input: { restaurantId: +id, items: orderItems } },
      })
    }
  }

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
        <div className="bg-white w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">{restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>
      <div className="container pb-32 flex flex-col items-end mt-20">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}

        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
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
            >
              {dish.options?.map((option, i) => (
                <DishOption
                  key={i}
                  dishId={dish.id}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  )
}
