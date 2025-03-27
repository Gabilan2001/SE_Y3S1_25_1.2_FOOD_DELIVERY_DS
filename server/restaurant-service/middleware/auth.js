import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        // Extract token from cookies or headers
        const token = req.cookies.accessToken || req?.header?.authorization?.split(" ")[1];
        //we can scces cooki from pc version but we cant acces from it in mobile so we need to use header, 
       //hear i need only my token but header is not have the token the token come after the space so we need to split using the space then we can get the token
       // why [1] mean when we split the header it is con vert as array like this ["bearer", "token"] hear we need only tokrn so i give [1] becouse token is there in the first index
        // ? this quesan mark some time the feld not ther it is course error . if we use ? it is not coursing ther error
        

        if (!token) {
            return res.status(401).json({
                message: "Provide token"
            });
        }

        // Verify the token
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        // Debug: Log the decoded token
        console.log("Decoded token:", decode);

        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        // Attach userId to the request object
        req.userId = decode.id; // Ensure this matches the key in the decoded token
           //hear i store deails in side the userId then i req  , mean send to server mean if it is not come and display to the user it is for thr server  mean it is used in controller 
           //can easly get the userId 



        // Debug: Log the userId being attached
        console.log("Attached userId:", req.userId);

        next();//it is help to send req.userId to controller whicj is next auth in the route 
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export default auth;