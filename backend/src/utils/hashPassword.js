import bcrypt, { compare, hash } from 'bcrypt'


async function hashPassword(password){
    return await bcrypt.hash(password,10)
}


async function comparPassword(hashPassword,plainPassword){
    return await bcrypt.compare(plainPassword,hashPassword)
}

export {hashPassword,comparPassword}