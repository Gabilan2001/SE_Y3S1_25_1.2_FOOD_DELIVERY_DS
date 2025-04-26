// import uploadImageClodinary from "../utils/uploadImageClodinary.js"
// const uploadImageController = async(request,response)=>{
//     try {
//         const file = request.file

//         const uploadImage = await uploadImageClodinary(file)

//         return response.json({
//             message : "Upload done",
//             data : uploadImage,
//             success : true,
//             error : false
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }

// export default uploadImageController

import uploadImageClodinary from "../utils/uploadImageClodinary.js";

const uploadImageController = async (request, response) => {
    try {
        const file = request.file;

        if (!file) {
            return response.status(400).json({
                message: "No file uploaded",
                success: false,
                error: true,
            });
        }

        const uploadResult = await uploadImageClodinary(file);

        return response.json({
            message: "Upload done",
            data: uploadResult,
            success: true,
            error: false,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
};

export default uploadImageController;
