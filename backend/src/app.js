import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(new URL('.', import.meta.url));
const __dirname = path.dirname(__filename);

const app = express();

app.use(cookieParser());
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded(({extended:true,limit:"16kb"})));
app.use(cors({origin:"http://localhost:5173",credentials:true}));

// for accessing images
app.use('/public', express.static(path.join(__dirname, 'public')));

//User routes 
import UserRoute from './routes/userRoutes.js';
app.use("/api/v1/user",UserRoute)


// Service routes
import ServiceRoute from './routes/serviceRoutes.js';
app.use("/api/v1/service",ServiceRoute)

// admin routes
import adminRoutes from './routes/adminRoutes.js'
app.use("/api/v1/admin",adminRoutes)

// booking routes
import bookingRoutes from './routes/bookingRoutes.js'
app.use("/api/v1/booking",bookingRoutes)

// otp routes
import otpRoutes from './routes/otpRoutes.js'
app.use("/api/v1/otp",otpRoutes)

// review route
import reviewRoutes from './routes/reviewRoutes.js'
app.use("/api/v1/review",reviewRoutes)

// favorite route
import favoriteRoute from './routes/favoriteRoute.js'
app.use("/api/v1/favorite",favoriteRoute)

// change password route
import changePasswordRoutes from './routes/changePasswordRoutes.js'
app.use("/api/v1/password",changePasswordRoutes)

// report routes
import reportRoute from './routes/reportRoutes.js'
app.use("/api/v1/report",reportRoute)

// if no route found
app.all('*',(req,res)=>{
    res.send("404 Not Found")
})
export default app;