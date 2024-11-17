import multer from "multer"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
        // console.log(req)
    },
    filename: function (req, file, cb) {
        // const id = req.params.id || req.user.user_id
        // console.log(id);
        
        
        const date = Date.now()
        const originalname = file.originalname
        const extension = originalname.substring(originalname.lastIndexOf('.'))
        // console.log(extension);
        cb(null, `${date}${extension}`)
    }
}
)

export const upload = multer({storage})