<script setup>
    import accent from "@/assets/accent.svg"
    import { mapformHandle } from "@/stateHandle/mapform";

    import {onMounted, ref} from 'vue';

    const riskScore = ref(0);
    const isLoading = ref(false);

    const handleInput = async (evt) => {
        if (evt.key === "Enter") {
            console.log(evt.target.value)

            const requestURL = `https://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(evt.target.value)}`
            const proxyUrl = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(requestURL)}`);

            const data = await proxyUrl.json()
            
            let result = JSON.parse(data.contents)

            let dlon = result[0].lon, dlat = result[0].lat;
            console.log(dlat, dlon)

            const getData = async (location) => {
            //const position = await getLocation()
                isLoading.value = true;

                try {
                    lat = location.coords.latitude
                    lon = location.coords.longitude
                    const userRep = Math.round(Math.random() * 100) / 100

                    const response = await fetch(`https://safemapperbackend.onrender.com/risk?lat=${lat}&lon=${lon}&userReports=${userRep}`)
                    const data = await response.json()

                    riskScore.value = Math.round(data.finalRiskScore * 100)
                    
                    const riskDisp = document.getElementById("riskfactor")
                    if (riskScore.value > 50 && riskScore < 70) {
                        riskDisp.classList.remove("text-[#27EB1D]/52")
                        riskDisp.classList.add("text-yellow/52")
                    }
                    else if (riskScore.value > 70) {
                        riskDisp.classList.remove("text-[#27EB1D]/52")
                        riskDisp.classList.add("text-red/52")
                    }
                } catch (err) {
                            console.err("Error in fetching value!", error);
                } finally {
                    isLoading.value = false;
                }
            }

            const getLocation = () => {
                return new Promise ((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                })
            };
                
            getLocation().then((data) => {
                getData(data).then(() => {
                    let postData = {
                        start_lat: data.coords.latitude,
                        start_lon: data.coords.longitude,
                        end_lat: dlat,
                        end_lon: dlon
                    }

                    mapformHandle.postLocation(postData)
                })
            });
        }
    }
</script>

<template setup>
    <div class="border-r w-97 h-120.5 border-[#DEDEDE]">
        <div class="border-b-1 w-full py-7.5 border-[#DEDEDE] flex items-center px-7.5">
            <img :src="accent">
            <span>
                <input type="text" class="w-[305px] h-10 pl-4 bg-[#F4F3F3] ml-3 mb-5 rounded-md font-main font-medium" placeholder="Current Location"><br>
                <input @keydown="handleInput" type="text" class="placeholder-black w-[305px] h-10 pl-4 bg-[#F4F3F3] ml-3 rounded-md font-main font-medium" placeholder="Where To?">
            </span>
        </div>

        <div class="flex justify-center items-center">
            <div class="w-[330px] h-50 bg-[#F4F3F3] flex items-center mt-[60px] rounded-lg">
                <div class="ml-7.5">
                    <h3 class="font-semibold font-main text-xl mb-2">Risk Factor</h3>
                    <h1 class="font-semibold font-main text-3xl text-[#27BE1D]/52" id="riskfactor">
                        <span v-if="isLoading" class="flex items-center">
                            <svg class="animate-spin h-23 w-23 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        
                        <span v-else="isLoading">
                            <span class="text-8xl">{{ riskScore }}</span>
                            %
                        </span>
                    </h1>
                </div>
                <div class="ml-4 mt-9">
                    <p class="font-main text-[#6A6A6A] mb-2">Incident Density</p>
                    <p class="font-main text-[#6A6A6A] mb-2">Weather Severity</p>
                    <p class="font-main text-[#6A6A6A] font-medium">Road Isolation</p>
                </div>
            </div>
        </div>
    </div>
</template>
