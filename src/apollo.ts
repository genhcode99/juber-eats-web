import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client"

export const isLoggedInVar = makeVar(false)

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    // graphql을 가지고 client로 요청했을 때 정보를 주는 방법
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar()
            },
          },
        },
      },
    },
  }),
})
