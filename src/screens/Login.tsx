import React from "react"

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-10 rounded-md text-center">
        <h3 className="text-3xl text-gray-800">Log In</h3>
        <form className="flex flex-col mt-5 px-5">
          <input
            placeholder="Email"
            className="bg-gray-100 shadow-inner mb-3 py-3 px-5 rounded-md focus:outline-none border-2 focus:border-opacity-50 focus:border-green-600"
          />
          <input
            placeholder="Password"
            className="bg-gray-100 shadow-inner py-3 px-5 rounded-md focus:outline-none border-2 focus:border-opacity-50 focus:border-green-600 "
          />
          <button className="bg-gray-800 py-3 px-5 text-white font-medium text-lg rounded-md mt-3 focus:outline-none hover:opacity-90">
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
