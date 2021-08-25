import React from "react"

// <==========( Settings )==========>
interface IDishProps {
  description: string
  name: string
  price: number
}

// <==========( Features )==========>
export const Dish: React.FC<IDishProps> = ({ description, name, price }) => {
  // <==========( Presenter )==========>
  return (
    <div className="px-8 py-4 pb-8 border hover:border-gray-800 transition-all">
      <div className="mb-5">
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>$ {price}</span>
    </div>
  )
}
