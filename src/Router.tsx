import React, { createContext, useContext, useState } from 'react'

interface RouterValue<T> {
  path: T,
  navigate: (to: T) => void
}

export type Routes = Record<number, () => JSX.Element>

interface RouterProps<T> {
  children: React.ReactElement | React.ReactElement[];
  defaultPath: T;
}

export const routerFactory = <T extends number, >() => {
  const RouterContext = createContext<RouterValue<T>>(null)

  const Router: React.FC<RouterProps<T>> = ({ children, defaultPath }) => {
    const [path, setPath] = useState(defaultPath)

    return (
      <RouterContext.Provider value={{
        path,
        navigate: setPath
      }}>
        {children}
      </RouterContext.Provider>
    )
  }

  const useRouterContext = () => useContext(RouterContext)
  const useNavigate = () => useRouterContext().navigate
  const useLocation = () => useRouterContext().path

  const useRoutes = (routes: Routes) => {
    const location = useLocation()

    return routes[location]()
  }

  return {
    Router,
    useNavigate,
    useLocation,
    useRoutes
  }
}
