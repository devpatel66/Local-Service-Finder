import jwt from 'jsonwebtoken'

const generatesAccessToken = async (userObj) => {
    let token = await jwt.sign(userObj,
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: "15 days"
        }
    )

    return token

}

// const generatesRefreshTToken = async (id) => {
//     let token = await jwt.sign({
//         id: id
//     },
//     process.env.REFRESH_TOKEN_KEY,
//         {
//             expiresIn: "1 days"
//         }
//     )

//     return token
// }

export {generatesAccessToken}