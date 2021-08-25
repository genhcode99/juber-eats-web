import React from "react"
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../graphql_type/myRestaurant"
import { VictoryChart, VictoryPie, VictoryAxis } from "victory"
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

  // [ char data 정의]
  const chartData: { x: number; y: number }[] = [
    { x: 1, y: 3000 },
    { x: 2, y: 1500 },
    { x: 3, y: 4250 },
    { x: 4, y: 2300 },
    { x: 5, y: 7150 },
    { x: 6, y: 6830 },
    { x: 8, y: 8000 },
    { x: 9, y: 7000 },
    { x: 10, y: 6000 },
    { x: 11, y: 2000 },
    { x: 12, y: 4000 },
    { x: 13, y: 9000 },
    { x: 14, y: 8000 },
  ]

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
            <VictoryPie
              data={chartData}
              colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
