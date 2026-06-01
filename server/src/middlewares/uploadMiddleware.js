
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req, file)=>{

        const extension = file.originalname.split(".").pop();
        const baseName = file.originalname.split(".")[0];
        return {
        folder: "classroom-notes",
        resource_type: "raw",
        public_id : `${baseName}-${Date.now()}.${extension}`
        }
    },
});


export const upload = multer({ storage });

