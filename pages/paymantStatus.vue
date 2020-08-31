<template>
<div class="d-flex justify-center align-center payment-status">
    <v-card class="payment-status__container">
        <v-card-title class="payment-status__title">
            {{this.currentStatus.text.title}}
            <v-icon class="payment-status__icon" color="primary">
                {{this.currentStatus.icon}}
            </v-icon>
        </v-card-title>
        <v-card-text class="payment-status__description">
            {{this.currentStatus.text.subTitle}}
        </v-card-text>
        <v-card-actions class="d-flex align-center justify-center">
            <v-btn class="payment-status__btn" to="/" color="primary" outlined>
                На главную
            </v-btn>
        </v-card-actions>
    </v-card>
</div>
</template>

<script>
import axios from 'axios'
import Cookie from 'js-cookie'

export default {
    async asyncData({
        params,
        store,
        app,
        redirect,
        req,
        res,
        query,
    }) {


        let order_id

        if (query.hasOwnProperty('order_id')) {
            if (req.headers.cookie) {
                order_id = getCookie('order_id', req.headers.cookie)

                function getCookie(cookieName, stringCookie) {
                    let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
                    return unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
                }
                if (order_id == undefined) {
                    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
                    res.setHeader('Access-Control-Allow-Credentials', 'true');
                    res.setHeader('Set-Cookie', [`order_id=${order_id}`]);
                }
                redirect('/checkout/success')
            } else {
                res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Set-Cookie', [`order_id=${query.order_id}`]);
                redirect('/checkout/success')
            }

        }

        let statusList = [{
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
        let currentStatus = {}
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

        let categoriesList = await axios.post('https://yestapi.xyz/categories', {
            zone_id: 1
        })

        let categoriesListData = categoriesList.data

        store.dispatch('user/allCategory', categoriesListData)

        return {
            currentStatus: currentStatus,
        }
    },
}
</script>

<style lang="scss" scoped>
.payment-status {
    height: 80vh;

    &__container {
        box-shadow: none;
        border: none;
    }

    &__title {
        margin: 0 auto 14px !important;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        padding: 0;
        justify-content: center;
    }

    &__description {
        margin-bottom: 18px !important;
        padding: 0;
        text-align: center;
    }

    &__icon {
        margin-left: 6px;
    }

    &__btn {
        text-transform: initial !important;
        height: 41px !important;
        min-width: 160px !important;
        font-size: 16px !important;
        font-weight: 600 !important;
    }
}
</style>
