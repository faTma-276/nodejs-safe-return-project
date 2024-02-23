import adminRouter from "./modules/admin/admin.router.js"
import authRouter from "./modules/auth/auth.router.js"
import citizenRouter from "./modules/citizen/citizen.router.js"
import foundReportRouter from "./modules/foundReport/foundReport.router.js"
import missingReportRouter from "./modules/missingReport/missingReport.router.js"
import userRouter from "./modules/user/user.router.js"
import { globalErrorMiddleware } from "./utils/globalMiddleWare.js"



export function init(app){
    
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/missingReport',missingReportRouter)
app.use('/api/v1/foundReport',foundReportRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/citizen',citizenRouter)
app.use('/api/v1/admin',adminRouter)


app.all('*',(req,res,next)=>{
    next(new AppError("invalid url - can't access this endpoint "+req.originalUrl,404))
})
app.use(globalErrorMiddleware)


}