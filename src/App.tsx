import Globalstyle from "./styles/GlobalStyle";
import { createBrowserRouter, RouterProvider } from 'react-router'
import Main from './pages/Main';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Alarm from './pages/Alarm';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Splash,
  },
  {
    path: '/main',
    Component: Main,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
  {
    path: '/alarm',
    Component: Alarm,
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
