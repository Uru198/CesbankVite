import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './components/Home.jsx'
import InicioSesion from './components/InicioSesion.jsx'
import Error from './components/Error.jsx'
import Deposito from './components/Deposito.jsx'
import Retiro from './components/Retiro.jsx'
import Transferencia from './components/Transferencia.jsx'
import Historial from './components/Historial.jsx'
import { SaldoProvider } from './components/SaldoContext.jsx';

let router = createBrowserRouter ([
  {
    path:"/", element:<Home/>
  },
  {
    path:"/usuarios/:id", element:<Home/>
  },
  {
    path:"/loginRegistro", element:<InicioSesion/>
  },
  {
    path:"/deposito", element:<Deposito/>
  },
  {
    path:"/retiro", element: <Retiro/>
  },
  {
    path:"/Transferencia", element:<Transferencia/>
  },
  {
    path:"/historial", element:<Historial/>
  },
  {
    path:"*", element:<Error/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SaldoProvider>
      <RouterProvider router={router}/>
    </SaldoProvider>
  </React.StrictMode>,
)
