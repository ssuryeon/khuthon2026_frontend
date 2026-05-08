import Globalstyle from "./styles/GlobalStyle";
import { createBrowserRouter, RouterProvider } from 'react-router'
import Main from './pages/Main';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Alarm from './pages/Alarm';
import Activity from './pages/Activity';
import ArtistPlace from './pages/ArtistPlace';
import ArtistConfirm from './pages/ArtistConfirm';

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
  },
  {
    path: '/activity',
    Component: Activity,
  },
  {
    path: '/artist-place',
    Component: ArtistPlace,
  },
  {
    path: '/artist-confirm',
    Component: ArtistConfirm,
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
