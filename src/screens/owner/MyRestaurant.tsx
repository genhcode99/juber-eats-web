import { gql, useQuery } from "@apollo/client"
import React from "react"
import { Link, useParams } from "react-router-dom"
import { Dish } from "../../components/Dish"
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments"
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../graphql_type/myRestaurant"

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
  console.log(data)

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
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
