import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer'; // Make sure this is uncommented if you're using it.
//import { Toaster } from 'react-hot-toast'; // Assuming you want to show notifications.

function App() {
  return (
    <>
    <h1>gabil to check</h1>
      <Header />
      <main className='min-h-[78vh]'>
        <Outlet />
        <h1>gabil to check</h1>
      </main>
      <Footer />
      
    </>
  );
}

export default App;
