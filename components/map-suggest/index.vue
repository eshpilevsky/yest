<template>
  <div class="address-input">
    <v-text-field
      append-icon="close"
      @click:append="appendIconCallback"
      v-model="searchString"
    >
      <template v-slot:append-outer>
        <v-btn outlined @click="onCancel">Отменить</v-btn>
      </template>
    </v-text-field>
  </div>
</template>
<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { loadYmap } from 'vue-yandex-maps';
  import { settings } from '@/plugins/ymapPlugin'

  export default {
    data: () => ({
      searchString: ''
    }),
    async mounted () {
      await loadYmap(settings);
      this.addSuggestView(ymaps)
    },
    methods: {
      ...mapMutations ('map', {
        hideMap: 'HIDE_MAP',
        switchToMapMode: 'UNSET_INPUT_ADDRESS_MODE'
      }),
      ...mapGetters('map', {
        getCurrentCoords: 'getCurrentCoords',
        getCurrentAddress: 'getCurrentAddress'
      }),
      addSuggestView (ymaps) {
        var suggestView = new ymaps.SuggestView(this.$el.querySelector('input'))
        suggestView.events.add('select', (e) => {
          this.$emit('select', e)
        })
      },
      appendIconCallback (e) {
        this.searchString = ''
      },
      onCancel () {
        this.switchToMapMode()
      }
    }
  }
</script>
<style lang="scss">
  .v-text-field__slot ymaps {
    color: black;
  }
  ymaps[class*=suggest-item_selected_yes] {
    background-color: #00A646;
  }

  .address-input{
	  width: 90%;
	  margin: auto;
  }
</style>
