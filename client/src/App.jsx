import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
// import Footer from './components/Footer'; // Uncomment if you want to use Footer
// import { Toaster } from 'react-hot-toast'; // Uncomment if you're using Toaster

function App() {
  return (
    <>
      {/* Debugging: Ensure this text shows up */}
      <h1>gabil to check</h1> 

      {/* Header should always be visible */}
      <Header />

      <main className='min-h-[78vh]'>
        {/* Debugging: Ensure this text shows up */}
        <h1>gabil to check</h1> 
        
        {/* Render the child components here */}
        <Outlet />
      </main>

      {/* Uncomment if you're using Footer */}
      {/* <Footer /> */}

      {/* Uncomment if you're using Toaster for notifications */}
      {/* <Toaster /> */}
    </>
  );
}

export default App;
