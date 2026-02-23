<script setup>
	import TopBar from "@/components/TopBar.vue"
	import FormMenu from "@/components/FormMenu.vue"
	import MapItem from "@/components/MapItem.vue"
</script>

<template>
	<div class="w-full h-screen bg-[#F3F3F3] flex justify-center items-center">
		<div class="w-285 h-145.5 bg-white">
			<TopBar />
			<div class="flex">
				<FormMenu />
				<MapItem />
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>