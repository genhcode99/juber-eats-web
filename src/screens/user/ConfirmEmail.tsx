import React, { useEffect } from "react"
import { gql, useApolloClient, useMutation } from "@apollo/client"
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../graphql_type/verifyEmail"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { useMe } from "../../hooks/useMe"

// <==========( Graphql )==========>
const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`

// <==========( Settings )==========>

export const ConfirmEmail = () => {
  // <==========( Features )==========>
  const { data: userData } = useMe()
  const client = useApolloClient()
  const history = useHistory()

  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      })
    }
    history.push("/")
  }

  const [verifyEmailMutation] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    { onCompleted },
  )

  useEffect(() => {
    const [_, code] = window.location.href.split("code=")
    verifyEmailMutation({ variables: { input: { code } } })
  }, [])

  // <==========( Presenter )==========>
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  )
}
