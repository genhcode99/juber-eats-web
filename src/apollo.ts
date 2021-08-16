import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { LOCALSTORAGE_TOKEN } from "./constants"

const token = localStorage.getItem(LOCALSTORAGE_TOKEN)

export const isLoggedInVar = makeVar(Boolean(token))
export const authTokenVar = makeVar(token)

// Http Link 를 만듦
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
})

// Http에 보내 줄 Header 설정
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  }
})

// Link를 합쳐준다.
const finalLink = authLink.concat(httpLink)

export const client = new ApolloClient({
  link: finalLink,
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
          token: {
            read() {
              return authTokenVar()
            },
          },
        },
      },
    },
  }),
})
