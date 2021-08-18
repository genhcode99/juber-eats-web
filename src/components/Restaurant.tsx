import React from "react"

// <==========( Settings )==========>
interface IRestaurantProps {
  id: string
  coverImg: string
  name: string
  categoryName?: string
}

// <==========( Feature )==========>
export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImg,
  name,
  categoryName,
}) => {
  // <==========( Presenster )==========>
  return (
    <div className="flex flex-col">
      <div
        className="py-28 bg-cover bg-center mb-3"
        style={{ backgroundImage: coverImg }}
      ></div>
      <h3 className="text-xl font-medium">{name}</h3>
      <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
        {categoryName}
      </span>
    </div>
  )
}
