<template>
<div class="d-flex justify-center align-center paymant-status-container" >
    <v-card class="status-card">
        <v-card-title>
            {{this.currentStatus.text.title}}
            <v-icon color="primary">
                {{this.currentStatus.icon}}
            </v-icon>
        </v-card-title>
        <v-card-text>
            {{this.currentStatus.text.subTitle}}
        </v-card-text>
        <v-card-actions class="d-flex align-center justify-center">
            <v-btn color="primary" outlined>
                На главную
            </v-btn>
        </v-card-actions>
    </v-card>

</div>
</template>

<script>
import axios from 'axios'

export default {
    async asyncData({
        params,
		store,
		app
    }) {
        let statusList= [{
                name: 'success',
                text: {
                    title: 'Оплата прошла успешно',
                    subTitle: 'Спасибо за оплату, скоро с Вами свяжутся',
                },
                icon: 'check_circle',
            },
            {
                name: 'fail',
                text: {
                    title: 'Ошибка оплаты',
                    subTitle: 'Оплата не удалась',
                },
                icon: 'error',
            },
            {
                name: 'cancel',
                text: {
                    title: 'Оплата отменена',
                    subTitle: 'Повторите попытку',
                },
                icon: 'cancel',
            },
		]
		let currentStatus ={}
        let findStatus = statusList.findIndex((stat) => {
            return stat.name == params.status
		})

        if (findStatus == undefined) {
            currentStatus = statusList[1]
        } else {
            currentStatus = statusList[findStatus]
        }

        let zoneList = await axios.get('https://yestapi.xyz/get-zones')
        const zoneListData = zoneList.data
        store.dispatch('zone/setZone', zoneListData)
        let currentZone = zoneListData.find((zones) => {
            if (zones.alias == params.region) {
                return zones
            }
        })

        if (currentZone == undefined) {
            currentZone = zoneListData[0]
        }
        app.currentZone = currentZone

        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: currentZone.id
        })

        let categoriesListData = categoriesList.data

        store.dispatch('user/allCategory', categoriesListData)

        return {
            currentStatus: currentStatus,
        }
    },
}
</script>

<style scoped>
.paymant-status-container{
	height: 80vh;
}
</style>
