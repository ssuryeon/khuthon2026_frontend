import Globalstyle from "./styles/GlobalStyle";
import { createBrowserRouter, RouterProvider } from 'react-router'
import Main from './pages/Main';
import Splash from './pages/Splash';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Main,
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
