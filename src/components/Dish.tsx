import React from "react"
import { restaurant_restaurant_restaurant_menu_options } from "../graphql_type/restaurant"

// <==========( Settings )==========>
interface IDishProps {
  id?: number
  description: string
  name: string
  price: number
  isCustomer?: boolean
  orderStarted?: boolean
  addItemToOrder?: (dishId: number) => void
  options?: restaurant_restaurant_restaurant_menu_options[] | null
  isSelected?: boolean
  addOptionToItem?: (dishId: number, options: any) => void
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
  addOptionToItem,
  isCustomer = false,
  orderStarted = false,
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
          {options?.map((option, i) => (
            <span
              onClick={() =>
                addOptionToItem
                  ? addOptionToItem(id, { name: option.name })
                  : null
              }
              key={i}
              className="flex border items-center cursor-pointer"
            >
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">$ {option.extra}</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
