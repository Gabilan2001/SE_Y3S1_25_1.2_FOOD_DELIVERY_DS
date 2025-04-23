import DeliveryBoy from "../models/deliveryBoyModel.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../config/cloudinary.js";
import Order from "../models/ItemSchema.js";
// import Tracking from "../models/trackingModel.js";
//Register a new delivery person
// @route   POST /api/delivery/register
export const registerDeliveryPerson = async (req, res) => {
    const { name, email, phone, vehicleType, vehicleNumber } = req.body;

    if (!name || !email || !phone || !vehicleType || !vehicleNumber) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const existingUser = await DeliveryBoy.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Delivery person already registered' });
        }

        // Upload files to Cloudinary
        const profileImageFile = req.files?.profileImage?.[0];
        const idProofFile = req.files?.idProof?.[0];
        const vehicleLicenseFile = req.files?.vehicleLicense?.[0];

        const profileImageUrl = profileImageFile
            ? await uploadToCloudinary(profileImageFile.buffer, 'delivery/profileImages')
            : '';
        const idProofUrl = idProofFile
            ? await uploadToCloudinary(idProofFile.buffer, 'delivery/idProofs')
            : '';
        const vehicleLicenseUrl = vehicleLicenseFile
            ? await uploadToCloudinary(vehicleLicenseFile.buffer, 'delivery/vehicleLicenses')
            : '';

        const deliveryPerson = new DeliveryBoy({
            name,
            email,
            phone,
            vehicleDetails: { vehicleType, vehicleNumber },
            profileImage: profileImageUrl,
            documents: {
                idProof: idProofUrl,
                vehicleLicense: vehicleLicenseUrl
            },
            isApproved: false
        });

        await deliveryPerson.save();

        res.status(200).json({ success: true, message: 'Registration successful, waiting for admin approval.' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Something went wrong, please try again.' });
    }
};


// Delivery Person Login Controller
export const loginDeliveryPerson = async (req,res) =>{
    const { email, password } = req.body;

    try {
        const deliveryPerson = await DeliveryBoy.findOne({ email });

        if (!deliveryPerson) {
            return res.status(404).json({ message: 'Delivery person not found' });
        }


        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, deliveryPerson.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

         // Update onlineStatus and lastActive timestamp
         deliveryPerson.onlineStatus = true;
         deliveryPerson.lastActive = new Date();  // Set current timestamp
         await deliveryPerson.save();

         // Respond with success message and user details (excluding password)
        res.status(200).json({
            message: 'Login successful',
            deliveryPerson: {
                email: deliveryPerson.email,
                name: deliveryPerson.name,
                onlineStatus: deliveryPerson.onlineStatus,
                lastActive: deliveryPerson.lastActive
            }
        });
    } catch (error) {
        console.error('Error logging in delivery person:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}


// Change Password Controller
export const changePassword = async(req,res) =>{
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;


    try {
        // Find the delivery person by ID
        const deliveryPerson = await DeliveryBoy.findById(id);
        if (!deliveryPerson) {
            return res.status(404).json({ message: 'Delivery person not found' });
        }

        // Compare the old password with the hashed password in the database
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, deliveryPerson.password);
        if (!isOldPasswordCorrect) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the delivery person's password
        deliveryPerson.password = hashedNewPassword;
        await deliveryPerson.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}


// export const updateLocation = async (req, res) => {
//     const { id, latitude, longitude } = req.body;

//     try {
//         const deliveryPerson = await DeliveryBoy.findById(id);
//         if (!deliveryPerson) return res.status(404).json({ message: 'Delivery person not found' });

//         // Update the delivery person's location
//         deliveryPerson.location.latitude = latitude;
//         deliveryPerson.location.longitude = longitude;

//         await deliveryPerson.save();
//         return res.status(200).json({ message: 'Location updated successfully', deliveryPerson });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// };

// Fetch order by ID and populate the deliveryPerson field
export const getOrderById = async (req, res) => {
    const { orderId } = req.params;  // Get the orderId from the URL
  
    try {
      // Fetch the order by ID and populate the deliveryPerson field
      const order = await Order.findById(orderId)
        .populate('deliveryPerson');  // Populate the deliveryPerson data
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json(order);  // Return the populated order
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };