import React, { createContext, useContext, useState } from 'react'

interface RouterValue {
  path: string,
  navigate: (path: string) => void
}

interface Routes {
  [key: string]: () => JSX.Element
}

const RouterContext = createContext<RouterValue>({
  path: '',
  navigate: () => {}
})

export const Router: React.FC<any> = ({ children, defaultPath = '' }) => {
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

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext)

  return navigate
}

export const useLocation = () => {
  const { path } = useContext(RouterContext)

  return path
}

export const useRoute = (routes: Routes) => {
  const { path } = useContext(RouterContext)

  if (!routes[path]) {
    throw new Error(`Route ${path} not found!`)
  }

  return routes[path]()
}
