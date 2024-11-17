import app from "./app.js";
import {PrismaClient} from '@prisma/client'
const port  = process.env.PORT



//
// async function demo(){
//     const user = await prisma.users.findUnique({
//         where:{
//             user_id : 4
//         }
//     })

//     console.log(user);
// }

// demo().catch(async (err)=>{
//     console.log(err.message)
//     await prisma.$disconnect()
// }).then(async ()=>{
//     console.log("Successfully")
//     await prisma.$disconnect()
// })

app.listen(port,()=>{
    console.log(`App is Listening on http://localhost:${port}`);
})