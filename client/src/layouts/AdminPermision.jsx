// import React from 'react'
// import { useSelector } from 'react-redux'
// import isAdmin from '../utils/isAdmin'

// const AdminPermision = ({children}) => {
//     const user = useSelector(state => state.user)


//   return (
//     <>
//         {
//             isAdmin(user.role) ?  children : <p className='text-red-600 bg-red-100 p-4'>Do not have permission</p>
//         }
//     </>
//   )
// }

// export default AdminPermision

import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'
import isRestaurantOwner from '../utils/isRestaurantOwner'  

const AdminPermission = ({children}) => {
    const user = useSelector(state => state.user)

    // Check if the user is either an Admin or a Restaurant Owner
    if (isAdmin(user.role) || isRestaurantOwner(user.role)) {
        return <>{children}</>;
    }

    return <p className='text-red-600 bg-red-100 p-4'>Do not have permission</p>;
}

export default AdminPermission;
