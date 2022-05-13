import React, { createContext, useContext, useEffect, useState } from 'react'

interface RouterValue<T> {
  path: T
  navigate: (to: T) => void
}

export type Routes = Record<number, () => JSX.Element>

interface RouterProps<T> {
  children: React.ReactNode
  defaultPath: T
}

interface RedirectProps<T> {
  to: T
}

export const routerFactory = <T extends number>(routes: Routes) => {
  const RouterContext = createContext<RouterValue<T>>(null)

  const Router: React.FC<RouterProps<T>> = ({ children, defaultPath }) => {
    const [path, setPath] = useState(defaultPath)

    return (
      <RouterContext.Provider
        value={{
          path,
          navigate: setPath,
        }}
      >
        {children}
      </RouterContext.Provider>
    )
  }

  const useRouterContext = () => useContext(RouterContext)
  const useNavigate = () => useRouterContext().navigate
  const useLocation = () => useRouterContext().path
  const useRoute = () => {
    const location = useLocation()

    return routes[location]()
  }

  const Redirect: React.FC<RedirectProps<T>> = ({ to }) => {
    const navigate = useNavigate()

    useEffect(() => {
      navigate(to)
    })

    return null
  }

  return {
    Router,
    Redirect,
    useNavigate,
    useLocation,
    useRoute,
  }
}
