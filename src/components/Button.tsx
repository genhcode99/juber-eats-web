import React from "react"

interface IButtonProps {
  canClick?: boolean
  loading: boolean
  actionText: string
}

const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
  return (
    <button
      className={` text-white text-lg py-4 font-medium transition-colors focus:outline-none ${
        canClick
          ? "bg-lime-600 hover:bg-lime-700"
          : " bg-gray-200 pointer-events-none"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  )
}

export default Button
