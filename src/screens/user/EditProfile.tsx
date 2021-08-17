import React from "react"
import { gql, useApolloClient, useMutation } from "@apollo/client"
import { useMe } from "../../hooks/useMe"
import { useForm } from "react-hook-form"
import Button from "../../components/Button"
import {
  editProfile,
  editProfileVariables,
} from "../../graphql_type/editProfile"
import { FormError } from "../../components/FormError"

// <==========( Graphql )==========>
const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`

// <==========( Settings )==========>
type IFormData = {
  email?: string
  password?: string
}

// <==========( Feature )==========>
export const EditProfile = () => {
  const { data: userData } = useMe()
  const client = useApolloClient()

  const {
    register,
    getValues,
    formState,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  })

  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData
      const { email: newEmail } = getValues()

      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        })
      }
    }
  }

  const [editProfileMutation, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted })

  const onSubmit = () => {
    const { email, password } = getValues()
    editProfileMutation({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    })
  }

  // <==========( Presenter )==========>
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        className="grid gap-3 mt-5 w-full max-w-screen-sm mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="input"
          type="email"
          placeholder="Email"
          {...register("email", {
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
          className="input"
          type="password"
          placeholder="Password"
          {...register("password", {
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
          actionText="Save Profile"
        />
      </form>
    </div>
  )
}
