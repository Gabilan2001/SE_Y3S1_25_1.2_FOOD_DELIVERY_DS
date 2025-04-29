import transporter from "../config/nodemailer.js";
import DeliveryBoy from "../models/deliveryBoyModel.js";
import bcrypt from "bcrypt";
import { publishUserRegistration } from "../utils/messageQueue.js";

// Generate Random Password Function
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

//Admin Approval Controller
export const approveDeliveryPerson = async (req, res) => {
  const { id } = req.params;

  try {
    const deliveryPerson = await DeliveryBoy.findById(id);

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    if (deliveryPerson.isApproved) {
      return res
        .status(400)
        .json({ message: "Delivery person already approved" });
    }

    //Generate and hashpassword
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Update delivery person details
    deliveryPerson.isApproved = true;
    deliveryPerson.password = hashedPassword;
    await deliveryPerson.save();

    // Publish user registration event
    await publishUserRegistration({
      name:deliveryPerson.name,
      email:deliveryPerson.email,
      password: hashedPassword,
      phoneNumber: deliveryPerson.phone,
      role: "DeliveryPerson",
      profilePhoto:deliveryPerson.profileImage
    });

    //  // Send email with the generated password
    //  await transporter.sendMail({
    //     from: process.env.SENDER_EMAIL,  // Use your sender email address (e.g., your Gmail)
    //     to: deliveryPerson.email,        // Delivery person's email address
    //     subject: 'Account Approved - Delivery Service',
    //     text: `Your registration has been approved. Your password is: ${randomPassword}`
    // });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: deliveryPerson.email,
      subject: "Account Approved - Delivery Service",
      text: `Your registration has been approved. Your password is: ${randomPassword}`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        message:
          "Delivery person approved successfully and password sent via email.",
      });
  } catch (error) {
    console.error("Error approving delivery person:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// // Reject Delivery Person Controller
// export const rejectDeliveryPerson = async(req,res) =>{
//     const { id } = req.params;

//     try {
//         const deliveryPerson = await DeliveryBoy.findById(id);

//         if (!deliveryPerson) {
//             return res.status(404).json({ message: 'Delivery person not found' });
//           }

//            // If already approved, you might not want to reject the user
//     if (deliveryPerson.isApproved) {
//         return res.status(400).json({ message: 'Delivery person is already approved and cannot be rejected' });
//       }

//       // Optionally, send an email notifying the rejection
//     const mailOptions = {
//         from: process.env.SENDER_EMAIL,
//         to: deliveryPerson.email,
//         subject: 'Account Rejected - Delivery Service',
//         text: `Your registration has been rejected. Please contact support for further information.`
//       };

//       await transporter.sendMail(mailOptions);

//       // Remove the delivery person registration from the database
//     await DeliveryBoy.findByIdAndDelete(id);

//     res.status(200).json({ message: 'Delivery person registration rejected and removed.' });

//     } catch (error) {
//         console.error('Error rejecting delivery person:', error);
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//     }
// }

// Backend: rejectDeliveryPerson controller
export const rejectDeliveryPerson = async (req, res) => {
  const { id } = req.params;

  try {
    const deliveryPerson = await DeliveryBoy.findById(id);

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    // If already approved, you might not want to reject the user
    if (deliveryPerson.isApproved) {
      return res
        .status(400)
        .json({
          message: "Delivery person is already approved and cannot be rejected",
        });
    }

    // Optionally, send an email notifying the rejection
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: deliveryPerson.email,
      subject: "Account Rejected - Delivery Service",
      text: `Your registration has been rejected. Please contact support for further information.`,
    };

    await transporter.sendMail(mailOptions);

    // Instead of deleting the record, mark it as rejected
    deliveryPerson.rejected = true;
    await deliveryPerson.save();

    res.status(200).json({ message: "Delivery person registration rejected." });
  } catch (error) {
    console.error("Error rejecting delivery person:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller to fetch all delivery persons (you can modify to filter by pending/approved)
export const getDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryBoy.find();
    res.status(200).json(deliveryPersons);
  } catch (error) {
    console.error("Error fetching delivery persons:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
