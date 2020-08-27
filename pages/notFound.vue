<template>
<v-container class="text-center notFound" fill-height style="height: calc(100vh - 210px);">
    <v-row align="center">
        <v-col>
            <h1 class="display-2 secondary--text notFound__title">
                Упс, 404
            </h1>
            <p class="notFound__descr">Страница не найдна</p>
            <v-btn class="notFound__btn" :to="`/${this.getSelectedZone.alias}`" color="primary" outlined>
                Вернуться на главную
            </v-btn>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    mapGetters
} from 'vuex'

export default {
    name: 'NotFound',
    async asyncData({
        params,
        store,
        redirect,
    }) {
        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        let currentZone = zoneListData.find((zones) => {
            return zones.alias == params.region
        })
        if (currentZone !== undefined) {
            store.dispatch('zone/setSelectedZone', currentZone)
        } else {
            redirect('/')
        }
        app.currentZone = currentZone
        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: currentZone.id
        })
        let categoriesListData = categoriesList.data
        store.dispatch('user/allCategory', categoriesListData)
    },
    computed: {
        ...mapGetters({
            getSelectedZone: 'zone/getSelectedZone'
        })
    }
}
</script>

<style lang="scss" scoped>
.notFound {
    &__title {
        margin-bottom: 20px;
    }

    &__descr {
        margin-bottom: 20px;
    }

    &__btn {
        text-transform: initial !important;
    }
}
</style>
