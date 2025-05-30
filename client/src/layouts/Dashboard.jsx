// import React from 'react';
// import UserMenu from '../components/UserMenu';
// import { Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const Dashboard = () => {
//   const user = useSelector(state => state.user);

//   console.log("user dashboard", user);
//   return (
//     <section className='bg-white'>
//       <div className='container mx-auto p-3 grid lg:grid-cols-[250px,1fr]'>
//         {/** Left sidebar for menu */}
//         <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
//           <UserMenu />
//         </div>

//         {/** Right content area */}
//         <div className='bg-white min-h-[75vh] pl-0 lg:pl-10 pt-28'>
//           <Outlet />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Dashboard;


import React from 'react';
import UserMenu from '../components/UserMenu';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector(state => state.user);

  console.log("user dashboard", user);
  return (
    <section className='bg-white min-h-screen'>
      <div className='container mx-auto p-3 flex flex-col lg:flex-row'>
        {/** Left sidebar for menu */}
        <div className='w-full lg:w-64 lg:fixed lg:top-32 h-auto lg:h-[calc(100vh-96px)] overflow-y-auto border-r lg:block'>
          <UserMenu />
        </div>

        {/** Right content area */}
        <div className='w-full lg:ml-64 pt-32 lg:pt-28 flex-1 overflow-y-auto h-[calc(100vh-96px)]'>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;