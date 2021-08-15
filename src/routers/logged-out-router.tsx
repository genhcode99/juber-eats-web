import React from "react"
import { useForm } from "react-hook-form"
import { isLoggedInVar } from "../apollo"

interface IForm {
  email: string
  password: string
}

// * 컴포넌트
export const LoggedOutRouter = () => {
  // * 기능
  // react hook form
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>()
  const onSubmit = () => {
    console.log(watch())
  }
  const onInvalid = () => {
    console.log("cant create account")
  }

  // * 화면출력
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register("email", {
              required: "Email Is Required",
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
            })}
            name="email"
            type="email"
            placeholder="email"
          />
          {errors.email?.message && (
            <span className=" font-bold text-red-600">
              {errors.email?.message}
            </span>
          )}
          {errors.email?.type === "pattern" && (
            <span className=" font-bold text-red-600">Only Gamil Allowed</span>
          )}
        </div>
        <div>
          <input
            {...register("password", { required: true })}
            name="password"
            type="password"
            required
            placeholder="password"
          />
        </div>
        <button className="bg-yellow-300 text-white">Submit</button>
      </form>
    </div>
  )
}
