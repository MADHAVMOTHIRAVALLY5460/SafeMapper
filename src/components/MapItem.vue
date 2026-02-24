<script setup>
    import { onMounted, toRaw, watch } from 'vue'
    import * as Leaflet from 'leaflet'
    import 'leaflet/dist/leaflet.css'

    import { mapformHandle } from '@/stateHandle/mapform';

    import defaultMarkerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
    import defaultMarkerIcon from 'leaflet/dist/images/marker-icon.png';
    import defaultMarkerShadow from 'leaflet/dist/images/marker-shadow.png';
    
    L.Icon.Default.mergeOptions({
      iconUrl: defaultMarkerIcon.src,
      iconRetinaUrl: defaultMarkerIconRetina.src,
      shadowUrl: defaultMarkerShadow.src,
    });

    let markers;
    let map;

    onMounted(() => {
        let lat = 0;
        let lon = 0;

        let getLocation = () => {
            return new Promise ((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })
        }

        getLocation().then(async (data) => {
            lat = Math.round(data.coords.latitude * 10000) / 10000;
            lon = Math.round(data.coords.longitude * 10000) / 10000;

            map = Leaflet.map('map', {preferCanvas: true}).setView([lat, lon], 18)
            markers = Leaflet.featureGroup().addTo(map)

            Leaflet.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                { maxZoom: 19 }
            ).addTo(map)

            Leaflet.marker([lat, lon]).addTo(markers)

            watch(
                () => mapformHandle.coords,
                (newcoords) => {
                    const dataArray = JSON.parse(JSON.stringify(mapformHandle.coords))
                    console.log(dataArray[0])
        
                    Leaflet.polyline(toRaw(dataArray[0]), {
                        color: "#27EB1D",
                        weight: 5,
                    }).addTo(map)
                },
                {deep: true}
            )
        })
    })
</script>
<template setup>
    <div class="w-full h-[482px] p-[30px]">
        <div id="map" class="w-[693px] h-[422px] bg-[#F4F3F3] rounded-[10px]"></div>
    </div>
</template>
