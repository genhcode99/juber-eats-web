import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { gql, useQuery } from "@apollo/client"
import { RESTAURANT_FRAGMENT } from "../../fragments"
import { myRestaurants } from "../../graphql_type/myRestaurants"

// <==========( GraphQl )==========>
const MY_RESTAURANTS_QUERY = gql`
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
  console.log(data)

  // <==========( Presenter ) ==========>
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Juber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {true && (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link to="/add-restaurant" className="link">
              Create one &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
