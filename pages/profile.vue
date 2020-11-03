<template>
  <div class="container">
    <div class="profile">
      <sitebar :activePage="page"></sitebar>

      <div class="profile-content">
        <h1 class="profile-title">Личный кабинет</h1>

        <content_index v-show="page === 'index'"/>
        <content_bonus v-show="page === 'bonus'"/>
        <content_edit v-show="page === 'edit'"/>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import sitebar from '~/components/profile/sitebar.vue'

  import content_index from '~/components/profile/index.vue'
  import content_bonus from '~/components/profile/bonus.vue'
  import content_edit from '~/components/profile/edit.vue'

  export default {
    name: 'profile',
    components: {
      sitebar,
      content_index,
      content_bonus,
      content_edit
    },
    async asyncData({app, store, params, req, redirect, router}) {
      if(params.obj){
        if(params.obj !== 'edit' && params.obj !== 'bonus'){
          redirect(404,'/404');
        // console.log(12322);
        }
      }else{
        params.obj = 'index';
      }



      let currentZone = await store.getters['zone/getSelectedZone'];

      let zoneList = await axios.get('https://yestapi.xyz/get-zones');
      const zoneListData = zoneList.data;
      store.dispatch('zone/setZone', zoneListData);

      let categoriesList = await axios.post('https://yestapi.xyz/categories', {
        zone_id: 1
      });

      let categoriesListData = categoriesList.data;
      store.dispatch('user/allCategory', categoriesListData);



      return {
        page:params.obj
      }
    },
    head() {
      return {
        title: '',
        meta: [{
          hid: 'description',
          name: 'description',
          content: ''
        },
          {
            hid: 'keywords',
            name: 'keywords',
            content: ''
          },
        ]
      }
    },
  }
</script>

<style scoped lang="scss">
  .profile {
    display: flex;
    padding: 20px 0 40px 0;

    @media screen and (max-width: 992px) {
      padding-top: 0;
      margin-top: -10px;
    }

    &-content {
      padding: 20px 20px 20px 50px;
      width: 100%;

      @media screen and (max-width: 992px) {
        padding: 0 20px 20px;
      }
    }

    &-title {
      font-size: 35px;
      margin-bottom: 30px;

      @media screen and (max-width: 992px) {
        margin-bottom: 10px;
      }

      @media screen and (max-width: 600px) {
        text-align: center;
      }
    }
  }
</style>
