import { reactive } from "vue";

export const mapformHandle = reactive({
    coords: [],
    async getPath () {
        const APIBase = import.meta.env.VITE_API_BASE
        const proxyURL = await fetch (`${APIBase}/find-safest-route`) 
    
        const data = await proxyURL.json()
        this.coords.push(data)
    },
    
    async postLocation (params) {
        const APIBase = import.meta.env.VITE_API_BASE
        const payload = new URLSearchParams(params).toString()

        const proxyURL = await fetch (`${APIBase}/get-cords?${payload}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }).then(() => {
            console.log("Posted!")
            await this.getPath()
        })
    },
})
