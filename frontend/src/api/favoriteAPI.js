import ErrorHandler from "./ErrorHandler";



class Favorite {

    constructor() {
        this.url = "http://localhost:8000/api/v1/favorite";
    }

    async addToFavorite(id) {
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/addFavorite/${id}`, {
                method: "post",
                credentials: "include",
            });
            const parseData = await response.json();
            return parseData;
        });
    }

    async removeFromFavorite(id) {
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/deleteFavorite/${id}`, {
                method: "delete",
                credentials: "include",
            });
            const parseData = await response.json();
            return parseData;
        });
    }

    async getFavoriteList() {
        return await ErrorHandler(async () => {
            const response = await fetch(`${this.url}/getFavorite`, {
                method: "GET",
                credentials: "include",
            });
            const parseData = await response.json();
            return parseData;
        });
    }
}

const favoriteApi = new Favorite();

export default favoriteApi;
