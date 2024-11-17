import ErrorHandler from './ErrorHandler'
class Report{

    constructor() {
        this.url = 'http://localhost:8000/api/v1/report'
    }

    async createReport(data) {
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/createReport`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const parseData = await response.json()
            return parseData
        })
    }

    async getReport() {
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/getReport`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const parseData = await response.json()
            return parseData
        })
    }
}

const reportApi = new Report()

export default reportApi