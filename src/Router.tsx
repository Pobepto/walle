import React, { createContext, useContext, useEffect, useState } from 'react'
import { Nullable, Undefinable } from 'tsdef'

interface RouterValue<
  Route extends number,
  RoutesData extends Partial<Record<Route, unknown>>,
> {
  route: Route
  navigate: <T extends Route>(to: T, data?: RoutesData[T]) => void
  data?: RoutesData[Route]
}

export type Routes<Route extends number> = Record<Route, () => JSX.Element>

interface RouterProps<Route> {
  children: React.ReactNode
  defaultRoute: Route
}

interface RedirectProps<
  Route extends number,
  RoutesData extends Partial<Record<Route, unknown>>,
> {
  to: Route
  data?: RoutesData[Route]
}

export const routerFactory = <
  Route extends number,
  RoutesData extends Partial<Record<Route, unknown>>,
>(
  routes: Routes<Route>,
) => {
  const RouterContext =
    createContext<Nullable<RouterValue<Route, RoutesData>>>(null)

  const Router: React.FC<RouterProps<Route>> = ({ children, defaultRoute }) => {
    const [state, setState] = useState<{
      route: Route
      data?: RoutesData[Route]
    }>({
      route: defaultRoute,
      data: undefined,
    })

    const navigate = <T extends Route>(to: T, data?: RoutesData[T]) => {
      setState({
        route: to,
        data,
      })
    }

    return (
      <RouterContext.Provider
        value={{
          ...state,
          navigate,
        }}
      >
        {children}
      </RouterContext.Provider>
    )
  }

  const useRouterContext = () => useContext(RouterContext)
  const useNavigate = () => useRouterContext()!.navigate
  const useLocation = () => useRouterContext()!.route
  const useData = <T extends Route>() =>
    useRouterContext()!.data as Undefinable<RoutesData[T]>
  const useRoute = () => {
    const location = useLocation()

    return routes[location]()
  }

  const Redirect: React.FC<RedirectProps<Route, RoutesData>> = ({
    to,
    data,
  }) => {
    const navigate = useNavigate()

    useEffect(() => {
      navigate(to, data)
    })

    return null
  }

  return {
    Router,
    Redirect,
    useNavigate,
    useLocation,
    useRoute,
    useData,
  }
}
