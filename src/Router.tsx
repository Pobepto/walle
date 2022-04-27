import React, { createContext, useContext, useState } from 'react'

interface RouterValue {
  path: string,
  navigate: (to: string) => void
}

export type Routes = Record<string, () => JSX.Element>

const RouterContext = createContext<RouterValue>(null)

interface RouterProps {
  children: React.ReactElement | React.ReactElement[];
  defaultPath: string;
}

export const Router: React.FC<RouterProps> = ({ children, defaultPath = '' }) => {
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

export const useRouterContext = () => useContext(RouterContext)
export const useNavigate = () => useRouterContext().navigate
export const useLocation = () => useRouterContext().path

export const useRoutes = (routes: Routes) => {
  const location = useLocation()
  const route = routes[location]

  if (!route) {
    throw new Error(`Route ${location} not found!`)
  }

  return route()
}
