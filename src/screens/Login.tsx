import React from "react"
import { gql, useMutation } from "@apollo/client"
import { useForm } from "react-hook-form"
import { FormError } from "../components/FormError"
import {
  loginMutation,
  loginMutationVariables,
} from "../graphql_type/loginMutation"

// <==========( GraphQl )==========>
const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      ok
      token
      error
    }
  }
`

// <==========( 설정)==========>
type LogInFormData = {
  email: string
  password: string
}

// <==========( 컴포넌트 )==========>
const Login = () => {
  // <==========( 기능 )==========>
  // *. react hook form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LogInFormData>()

  const [loginMutation, { loading, error, data }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION)

  const onSubmit = () => {
    const { email, password } = getValues()
    loginMutation({ variables: { email, password } })
  }

  //<==========( 화면출력 )==========>
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-md text-center">
        <h3 className="text-3xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            required
            type="email"
            placeholder="Email"
            className="mb-3 input"
            {...register("email", { required: "Email Is Required" })}
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}

          <input
            required
            type="password"
            className="input"
            placeholder="Password"
            {...register("password", {
              required: "Password Is Required",
              minLength: {
                value: 2,
                message: "Password must be more than 2 chars.",
              },
            })}
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <button className="btn mt-3">Log In</button>
        </form>
      </div>
    </div>
  )
}

export default Login
