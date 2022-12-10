import React, { createContext, useContext, useState } from 'react'
import { Nullable, IsUnknown } from 'tsdef'

type AnyEnum = number | string

interface RouterContextValue<
  Route extends AnyEnum,
  RoutesData extends Partial<Record<Route, unknown>>,
> {
  route: Route
  navigate: <T extends Route>(
    to: T,
    ...[arg]: IsUnknown<RoutesData[T], [], [data: RoutesData[T]]>
  ) => void
  data?: RoutesData[Route]
}

export type RoutesMap<Route extends AnyEnum> = Record<Route, () => JSX.Element>

interface RouterProps<Route> {
  children: React.ReactNode | React.ReactNode[]
  defaultRoute: Route
}

export const routerFactory = <
  Route extends AnyEnum,
  RoutesData extends Partial<Record<Route, unknown>>,
>(
  routes: RoutesMap<Route>,
) => {
  const RouterContext =
    createContext<Nullable<RouterContextValue<Route, RoutesData>>>(null)

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

  const useRouterContext = () => {
    const ctx = useContext(RouterContext)

    if (!ctx) {
      throw new Error('RouterContext.Provider not found')
    }

    return ctx
  }

  const useNavigate = () => useRouterContext().navigate
  const useLocation = () => useRouterContext().route
  const useRouteData = <T extends Route>() =>
    useRouterContext().data as RoutesData[T]
  const useRoute = () => {
    const location = useLocation()

    return routes[location]()
  }

  return {
    Router,
    useNavigate,
    useLocation,
    useRoute,
    useRouteData,
  }
}
