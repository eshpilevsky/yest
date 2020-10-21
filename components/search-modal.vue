<template>
	<v-card class="d-flex flex-row justify-lg-space-between">
		<v-text-field v-model="search"/>
		<div @click="closeModalWindow()">
			Закрыть
		</div>
    <search></search>
	</v-card>
</template>

<script>
  import search from '@/components/search/index'

	export default {
		data() {
			return {
				search: ''
			}
		},
    components: {
      search,
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
