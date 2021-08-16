import React from "react"
import Helmet from "react-helmet"
import { gql, useMutation } from "@apollo/client"
import { useForm } from "react-hook-form"
import { FormError } from "../components/FormError"
import {
  loginMutation,
  loginMutationVariables,
} from "../graphql_type/loginMutation"
import juberLogo from "../images/Logo.svg"
import Button from "../components/Button"
import { Link, useHistory } from "react-router-dom"
import { UserRole } from "../graphql_type/globalTypes"
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../graphql_type/createAccountMutation"

// <==========( GraphQl )==========>
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`

// <==========( 설정)==========>
type CreateAccountFormData = {
  email: string
  password: string
  role: UserRole
}

// <==========( 컴포넌트 )==========>
const CreateAccount = () => {
  // <==========( 기능 )==========>
  // *. 회원가입
  const {
    register,
    formState,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    mode: "onChange",
    defaultValues: { role: UserRole.Client },
  })

  const history = useHistory()

  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data
    if (ok) {
      history.push("/")
    }
  }

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted },
  )

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues()
      createAccountMutation({
        variables: { createAccountInput: { email, password, role } },
      })
    }
  }

  //<==========( 화면출력 )==========>
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Juber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={juberLogo} className="w-52 mb-10" />
        <h4 className="w-full text-left text-3xl mb-5 font-medium">
          Let's get started
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
          <select
            {...register("role", { required: "Role Is Required" })}
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          {errors.role?.message && (
            <FormError errorMessage={errors.role?.message} />
          )}

          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Create Account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult?.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount
