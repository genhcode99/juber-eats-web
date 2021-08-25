import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import Header from "../components/Header"
import { Restaurants } from "../screens/client/Restaurants"
import NotFound from "../screens/404"
import { ConfirmEmail } from "../screens/user/ConfirmEmail"
import { EditProfile } from "../screens/user/EditProfile"
import { Search } from "../screens/client/Search"
import { Category } from "../screens/client/Category"
import { Restaurant } from "../screens/client/Restaurant"
import { MyRestaurants } from "../screens/owner/MyRestaurants"
import { AddRestaurants } from "../screens/owner/AddRestaurants"
import { MyRestaurant } from "../screens/owner/MyRestaurant"
import { AddDish } from "../screens/owner/AddDish"

// <==========( Route )==========>
interface IRoustes {
  path: string
  component: any
}

const clientRoutes: IRoustes[] = [
  { path: "/", component: <Restaurants /> },
  { path: "/search", component: <Search /> },
  { path: "/category/:slug", component: <Category /> },
  { path: "/restaurants/:id", component: <Restaurant /> },
]

const commonRoutes: IRoustes[] = [
  { path: "/confirm", component: <ConfirmEmail /> },
  { path: "/edit-profile", component: <EditProfile /> },
]

const restaurantRoutes: IRoustes[] = [
  { path: "/", component: <MyRestaurants /> },
  { path: "/add-restaurant", component: <AddRestaurants /> },
  { path: "/restaurants/:id", component: <MyRestaurant /> },
  { path: "/restaurants/:id/add-dish", component: <AddDish /> },
]

// <==========( 기능 )==========>
export const LoggedInRouter = () => {
  const { data, loading, error } = useMe()

  // <==========( Loading 화면 출력 )==========>
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    )
  }
  return (
    <Router>
      <Header />
      <Switch>
        {commonRoutes.map((route) => (
          <Route key={route.path} exact path={route.path}>
            {route.component}
          </Route>
        ))}

        {data.me.role === "Client" &&
          clientRoutes.map((route) => (
            <Route key={route.path} exact path={route.path}>
              {route.component}
            </Route>
          ))}

        {data.me.role === "Owner" &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} exact path={route.path}>
              {route.component}
            </Route>
          ))}

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  )
}
