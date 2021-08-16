import React from "react"
import { Helmet } from "react-helmet-async"
import { gql, useMutation } from "@apollo/client"
import { useForm } from "react-hook-form"
import { FormError } from "../components/FormError"
import {
  loginMutation,
  loginMutationVariables,
} from "../graphql_type/loginMutation"
import juberLogo from "../images/Logo.svg"
import Button from "../components/Button"
import { Link } from "react-router-dom"
import { authTokenVar, isLoggedInVar } from "../apollo"
import { LOCALSTORAGE_TOKEN } from "../constants"

// <==========( GraphQl )==========>
const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
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
  // *. 로그인
  const {
    register,
    formState,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormData>({ mode: "onChange" })

  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token)
      authTokenVar(token)
      isLoggedInVar(true)
    }
  }

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, { onCompleted })

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues()
      loginMutation({ variables: { loginInput: { email, password } } })
    }
  }

  //<==========( 화면출력 )==========>
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Juber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={juberLogo} alt="Juber Eats" className="w-52 mb-10" />
        <h4 className="w-full text-left text-3xl mb-5 font-medium">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            required
            type="email"
            placeholder="Email"
            className="input"
            {...register("email", {
              required: "Email Is Required",
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "The email format is not valid.",
              },
            })}
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
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Log in"
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult?.login.error} />
          )}
        </form>
        <div>
          New to Juber?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
