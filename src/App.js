import './App.css';
import { router } from './Routers/Routes/Routes';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
