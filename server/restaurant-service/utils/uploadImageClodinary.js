// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//     cloud_name : process.env.CLODINARY_CLOUD_NAME,
//     api_key : process.env.CLODINARY_API_KEY,
//     api_secret : process.env.CLODINARY_API_SECRET_KEY
// })

// const uploadImageClodinary = async(image)=>{
//     const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

//     const uploadImage = await new Promise((resolve,reject)=>{
//         cloudinary.uploader.upload_stream({ folder : "DS_Y3S1_IT22060426"},(error,uploadResult)=>{
//             return resolve(uploadResult)
//         }).end(buffer)
//     })

//     return uploadImage
// }

// export default uploadImageClodinary

import { v2 as cloudinary } from 'cloudinary';

// cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUD_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET_KEY,
});

// function to upload image buffer to cloudinary
const uploadImageClodinary = async (image) => {
    if (!image?.buffer) {
        throw new Error('No image buffer found');
    }

    const uploadImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "DS_Y3S1_IT22060426" },
            (error, uploadResult) => {
                if (error) return reject(error);
                resolve(uploadResult);
            }
        );
        stream.end(image.buffer); // USE image.buffer directly
    });

    return uploadImage;
};

export default uploadImageClodinary;
