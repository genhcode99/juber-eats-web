import { gql, useQuery, useSubscription } from "@apollo/client"
import React, { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useParams } from "react-router-dom"
import { FULL_ORDER_FRAGMENT } from "../fragments"
import { getOrder, getOrderVariables } from "../graphql_type/getOrder"

import {
  orderUpdates,
  orderUpdatesVariables,
} from "../graphql_type/orderUpdates"
import { useMe } from "../hooks/useMe"

// <==========( Graphql )==========>
const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`
const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`

// <==========( Settings )==========>
interface IParams {
  id: string
}

// <==========( Features )==========>
export const Order = () => {
  // <주소의 파라메터 ID 가져오기>
  const params = useParams<IParams>()

  // <로그인된 유저 가져오기>
  const { data: userData } = useMe()

  // <Order 정보 가져오기>
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER_QUERY,
    {
      variables: { input: { id: +params.id } },
    },
  )

  // <Subscribe To More>
  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: { input: { id: +params.id } },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } },
        ) => {
          if (!data) return prev
          return {
            getOrder: { ...prev.getOrder, order: { ...data.orderUpdates } },
          }
        },
      })
    }
  }, [data])

  // <Subscription 사용하기 - 따로 사용할 경우>
  // const { data: subscriptionData } = useSubscription<
  //   orderUpdates,
  //   orderUpdatesVariables
  // >(ORDER_SUBSCRIPTION, { variables: { input: { id: +params.id } } })
  // console.log(subscriptionData)

  // <==========( Presenter )==========>
  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | Nuber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>
          {userData?.me.role === "Client" && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === "Owner" && (
            <>
              {data?.getOrder.order?.status === "Pending" && (
                <button className="btn">Accept Order</button>
              )}
              {data?.getOrder.order?.status === "Cooking" && (
                <button className="btn">Order Cooked</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
