<template>
	<v-card class="d-flex flex-row justify-lg-space-between">
    <v-text-field v-model="search"></v-text-field>
		<div @click="closeModalWindow()">
			Закрыть
		</div>
    <search_component :showData="showData" :searchText="search"></search_component>
	</v-card>
</template>

<script>
  import search_component from '@/components/search/index'

	export default {
    data(){
      return {
        search: '',
        showData: [{},{},{}]
      }
    },
    components: {
      search_component,
    },
    watch:{
      async search(newValue){
        if(newValue.length > 3){
          this.search = newValue;

          console.log(this.search);

          // await this.Action__SearchSuggestions({
          //   address: newValue,
          //   city: this.currentZone.id
          // });
        }
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
