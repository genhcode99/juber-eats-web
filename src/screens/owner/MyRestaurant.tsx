import React, { useEffect } from "react"
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../graphql_type/myRestaurant"
import {
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from "victory"
import { Dish } from "../../components/Dish"
import { gql, useQuery, useSubscription } from "@apollo/client"
import { Link, useHistory, useParams } from "react-router-dom"
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments"
import { Helmet } from "react-helmet-async"
import { pendingOrders } from "../../graphql_type/pendingOrders"

// <==========( GraphQl )==========>
export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`
const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
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
export const MyRestaurant = () => {
  // <hooks>
  const { id } = useParams<IParams>()

  // <backend>
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    { variables: { input: { id: +id } } },
  )

  // <Subscription>
  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION,
  )
  const history = useHistory()
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`)
    }
  }, [subscriptionData, history])

  // <==========( Presenter )==========>
  return (
    <div>
      <Helmet>
        <title>{data?.myRestaurant.restaurant?.name || "Loading"}</title>
      </Helmet>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {" "}
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurants/${id}/add-dish`}
          className="mr-8 text-white bg-gray-800 py-3 px-10"
        >
          ADD Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-800 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish</h4>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-16">
              {data?.myRestaurant.restaurant?.menu?.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="">
            <VictoryChart
              domainPadding={50}
              height={500}
              theme={VictoryTheme.material}
              width={window.innerWidth}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryLabel
                    style={{ fontSize: 18 }}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders?.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{ data: { strokeWidth: 5 } }}
              />

              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: { fontSize: 15, fill: "#4d7c0f" },
                }}
                tickFormat={(step) => new Date(step).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  )
}
