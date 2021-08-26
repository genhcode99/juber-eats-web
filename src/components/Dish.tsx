import React from "react"
import { restaurant_restaurant_restaurant_menu_options } from "../graphql_type/restaurant"

// <==========( Settings )==========>
interface IDishProps {
  description: string
  name: string
  price: number
  isCustomer?: boolean
  options?: restaurant_restaurant_restaurant_menu_options[] | null
}

// <==========( Features )==========>
export const Dish: React.FC<IDishProps> = ({
  description,
  name,
  price,
  isCustomer = false,
  options,
}) => {
  console.log(options)

  // <==========( Presenter )==========>
  return (
    <div className="px-8 py-4 pb-8 border hover:border-gray-800 transition-all">
      <div className="mb-5">
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>$ {price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 my-3 font-medium">Dish Options:</h5>
          {options?.map((option, i) => (
            <span key={i} className="flex items-center">
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">$ {option.extra}</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
