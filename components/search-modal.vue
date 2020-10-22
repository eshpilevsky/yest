<template>
	<v-card class="mobile-cat-search">
    <div class="mobile-cat-search__input">
      <v-text-field v-model="search" placeholder="Найти в еде"/>
      <div class="mobile-cat-search__clear" @click="closeModalWindow()">
        Отменить
      </div>
    </div>
    <search_component :searchText="search"></search_component>
	</v-card>
</template>

<script>
  import search_component from '@/components/search/index'

	export default {
    data(){
      return {
        search: ''
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
  .mobile-cat-search {
    box-shadow: none !important;
    border-bottom: 1px solid #ddd !important;
    background: #fff;

    &__input {
      display: flex;
      align-items: center;
      background-color: #fff;

      .v-input {
        border-right: 1px solid #ddd;
        padding-top: 0;
        margin: 10px 14px 10px 20px;
      }
    }

    &__clear {
      padding-right: 14px;
      font-size: 14px;
    }
  }
</style>

<style>
  .mobile-cat-search .v-input__slot {
    position: initial;
    margin-bottom: 0;
  }

  .mobile-cat-search .v-input__slot:before {
    display: none !important;
  }

  .mobile-cat-search .v-input__slot:after {
    display: none !important;
  }

  .mobile-cat-search .v-text-field__details {
    display: none;
  }
</style>
