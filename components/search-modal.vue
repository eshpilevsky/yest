<template>
	<v-card width="100vw" height="100vh" class="d-flex flex-row justify-lg-space-between">
		<v-text-field v-model="search"/>
		<div @click="closeModalWindow()">
			Закрыть
		</div>
	</v-card>
</template>

<script>
	export default {
		data() {
			return {
				search: ''
			}
		},
		methods: {
			closeModalWindow() {
				this.$emit('closeModalWindow')
			}
		},
	}
</script>

<style lang="scss" scoped>

</style>