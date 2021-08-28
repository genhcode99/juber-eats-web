import {
  split,
  makeVar,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client"
import { LOCALSTORAGE_TOKEN } from "./constants"
import { WebSocketLink } from "@apollo/client/link/ws"
import { setContext } from "@apollo/client/link/context"
import { getMainDefinition } from "@apollo/client/utilities"

const token = localStorage.getItem(LOCALSTORAGE_TOKEN)

export const isLoggedInVar = makeVar(Boolean(token))
export const authTokenVar = makeVar(token)

// Websocket Link를 만듦
const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "wss://juber-eats-backend-clone.herokuapp.com/graphql"
      : "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      "x-jwt": authTokenVar() || "",
    },
  },
})

// Http Link 를 만듦
const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://juber-eats-backend-clone.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
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

// Http Link 를 사용할지 Websocket Link 를 사용할지 Query(subscription) 에 따라 선택
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  authLink.concat(httpLink), //헤더를 설정한 http 링크
)

export const client = new ApolloClient({
  link: splitLink,
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
