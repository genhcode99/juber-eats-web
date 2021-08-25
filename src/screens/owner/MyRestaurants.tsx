import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { gql, useApolloClient, useQuery } from "@apollo/client"
import { RESTAURANT_FRAGMENT } from "../../fragments"
import { myRestaurants } from "../../graphql_type/myRestaurants"
import { Restaurant } from "../../components/Restaurant"

// <==========( GraphQl )==========>
export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`
// <==========( Feature ) ==========>
export const MyRestaurants = () => {
  // [ restaurants 가져오기 ]
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY)

  // <==========( Presenter ) ==========>
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Juber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants?.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link to="/add-restaurant" className="link">
              Create one &rarr;
            </Link>
          </>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-16">
            {data?.myRestaurants.restaurants &&
              data?.myRestaurants.restaurants.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  coverImg={`url(${restaurant.coverImg})`}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
