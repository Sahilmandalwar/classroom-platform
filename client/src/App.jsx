// Inside App.jsx (or a global Layout component)
import { RouterProvider } from "react-router-dom";
import router from './routes/appRouter';

export const App = () => {

  return (
     <RouterProvider router={router} />  
  )
}