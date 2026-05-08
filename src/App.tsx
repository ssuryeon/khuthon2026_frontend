import Globalstyle from "./styles/GlobalStyle";
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home';
import Splash from './pages/Splash';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/splash',
    Component: Splash,
  }
])

function App() {

  return <>
    <Globalstyle />
    <div className='app'>
      <RouterProvider router={router}/>
    </div>
  </>;
}

export default App
