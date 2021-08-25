import React from "react"
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../graphql_type/myRestaurant"
import { VictoryChart, VictoryBar, VictoryAxis } from "victory"
import { Dish } from "../../components/Dish"
import { gql, useQuery } from "@apollo/client"
import { Link, useParams } from "react-router-dom"
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments"

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
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`

// <==========( Settings )==========>
interface IParams {
  id: string
}

// <==========( Features )==========>
export const MyRestaurant = () => {
  // [ hooks ]
  const { id } = useParams<IParams>()

  // [ backend ]
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    { variables: { input: { id: +id } } },
  )

  // <==========( Presenter )==========>
  return (
    <div>
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
          <div className="max-w-lg w-full mx-auto">
            <VictoryChart domainPadding={20}>
              <VictoryAxis
                label="Amount of money"
                dependentAxis
                tickValues={[20, 30, 40, 50, 60]}
              />
              <VictoryAxis
                label="Days of Life"
                tickValues={[10, 20, 30, 40, 50]}
              />
              <VictoryBar
                data={[
                  { x: 10, y: 20 },
                  { x: 20, y: 5 },
                  { x: 30, y: 55 },
                  { x: 40, y: 99 },
                ]}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  )
}
