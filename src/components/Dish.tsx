import React, { Children } from "react"
import { restaurant_restaurant_restaurant_menu_options } from "../graphql_type/restaurant"

// <==========( Settings )==========>
interface IDishProps {
  id?: number
  name: string
  price: number
  description: string
  isCustomer?: boolean
  isSelected?: boolean
  orderStarted?: boolean
  addItemToOrder?: (dishId: number) => void
  options?: restaurant_restaurant_restaurant_menu_options[] | null
}

// <==========( Features )==========>
export const Dish: React.FC<IDishProps> = ({
  name,
  price,
  id = 0,
  options,
  isSelected,
  description,
  addItemToOrder,
  isCustomer = false,
  orderStarted = false,
  children: dishOptions,
}) => {
  // <==========( Presenter )==========>
  return (
    <div
      className={`px-8 py-4 pb-8 border  transition-all  ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium ">
          {name}{" "}
          {orderStarted && (
            <button
              className="cursor-pointer"
              onClick={() =>
                orderStarted && addItemToOrder ? addItemToOrder(id) : null
              }
            >
              {isSelected ? "Romove" : "Add"}
            </button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>$ {price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 my-3 font-medium">Dish Options:</h5>
          {dishOptions}
        </div>
      )}
    </div>
  )
}
