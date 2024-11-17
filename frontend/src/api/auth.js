import ErrorHandler from "./ErrorHandler";

class UserAuth {
    constructor() {
        this.url = 'http://localhost:8000/api/v1/user'
    }


    async login(userCrendentials) {
        // console.log(userCrendentials);

        return await ErrorHandler(async () => {
            // console.log(userCrendentials);

            const response = await fetch(`${this.url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(userCrendentials)
            })

            const parseData = await response.json();
            console.log(parseData)
            return parseData
        })
    }


    async logout() {
        return await ErrorHandler(async () => {

            const response = await fetch(`${this.url}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            })

            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })

    }

    async register(userData) {

        if (userData["name"] === "") {
            let ran = Date.now()
            userData["name"] = `User${ran.toString().slice(0, 5)}`
        }

        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }

    async changeRole(userRole) {
        // console.log(userRole);

        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/changeRole`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(userRole)
            })
            const parseData = await response.json();
            console.log(parseData)
            return parseData
        })

    }

    async jwtLogin() {
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/jwtLogin`, {
                method: 'get',
                credentials: "include",
            })
            const parseData = await response.json();
            // console.log("login "+parseData)
            return parseData
        })

    }

    async userDetails() {
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/userDetails`, {
                method: 'get',
                credentials: "include",
            })
            const parseData = await response.json();
            // console.log("login "+parseData)
            return parseData
        })
    }

    async updateUserDetais(userDetails) {
        // console.log(userDetails);
        
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/updateUserDetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(userDetails)
            })

            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }
    async updatePassword(data) {
        // console.log(userDetails);
        
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/updatePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(data)
            })

            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }

}




const userAuth = new UserAuth();

export default userAuth