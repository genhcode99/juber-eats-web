import { gql } from "@apollo/client"

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    category {
      name
    }
    address
    isPromoted
  }
`

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`

export const DISH_FRAGMENT = gql`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    options {
      name
      extra
      choice {
        name
        extra
      }
    }
    description
  }
`
