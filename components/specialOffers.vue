<template>
<div class='containe'>
    <swiper v-if="loadingSO === false" class='specialOfferSwiper' ref="mySwiper" :options="swiperOptions">
        <swiper-slide v-for='(item, index) in specilaOffers' :key='index' class='specialOfferSwiper'>
            <nuxt-link :to='item.link'>
                <v-img :src='item.image' class="specialOfferImg" />
            </nuxt-link>
        </swiper-slide>
        <div class="customBtnPrev" slot="button-prev"></div>
        <div class="customBtnNext" slot="button-next"></div>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div v-else class="loading">
        <v-skeleton-loader type="image" class="loading-item"></v-skeleton-loader>
    </div>
</div>
</template>

<script>
import ApiService from '../common/api.service'

import {
	mapGetters
} from 'vuex'

export default {
	name: 'specialOffers',
	data () {
		return {
			serachAdress: '',
			specilaOffers: [],
			loadingSO: true,
			notFindImg: require('../assets/logo.png'),
			swiperOptions: {
				slidesPerView: 1,
				spaceBetween: 30,
				navigation: {
					nextEl: '.customBtnNext',
					prevEl: '.customBtnPrev'
					// nextEl: '.swiper-button-next',
					// prevEl: '.swiper-button-prev'
				},
				effect: 'fade',
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				}
			}
		}
	},
	computed: {
		...mapGetters({
			getSelectedZone: 'zone/getSelectedZone',
			getUserCoordinate: 'user/getUserCoordinate'
		}),
		swiper () {
			return this.$refs.mySwiper.$swiper
		}
	},
	methods: {
		getSpecialOffers () {
			ApiService.post(`/restaurants/special-offers`, {
				zone_id: this.getSelectedZone.id,
				latitude: parseInt(this.getUserCoordinate.latitude),
				longitude: parseInt(this.getUserCoordinate.longitude)
			}).then((response) => {
				if (response.status === 200) {
					const resp = response.data
					this.specilaOffers = resp
					this.loadingSO = false
				}
			}).catch((error) => {
				console.error(error)
			})
		}
	},
	watch: {
		getSpecialOffers (newValue) {
			this.loadingSO = true
			setTimeout(() => {
				this.getSpecialOffers()
			}, 100)
		}
	},
	mounted () {
		this.getSpecialOffers()
		if (window.innerWidth < 450) {
			this.swiperOptions.effect = 'none'
			this.swiperOptions.spaceBetween = 1
			this.swiperOptions.slidesPerView = 1.15
			this.swiperOptions.pagination.el = ''
		}
	}
}
</script>

<style>
.swiper-pagination-bullet {
    width: 5px !important;
    height: 5px !important;
}

.swiper-pagination-bullet-active {
    background: #000000 !important;
    /* #DCDCDC */
}
</style><style scoped>
.customBtnNext,
.swiper-container-rtl .customBtnPrev {
    right: 10px;
    left: auto;
}

.customBtnNext {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTAgMGgyNHYyNEgweiIvPjxwYXRoIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNOC41IDYuNTVsNS42NTcgNS42NTdMOC41IDE3Ljg2NGgwIi8+PC9nPjwvc3ZnPg==);
}

.customBtnPrev {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTAgMGgyNHYyNEgweiIvPjxwYXRoIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTUuNSA2LjU1bC01LjY1NyA1LjY1NyA1LjY1NyA1LjY1N2gwIi8+PC9nPjwvc3ZnPg==);
    left: 10px;
}

.customBtnPrev.swiper-button-disabled,
.customBtnNext.swiper-button-disabled {
    opacity: 0;
}

.customBtnPrev,
.customBtnNext {
    position: absolute;
    top: 50%;
    width: calc(var(--swiper-navigation-size) / 44 * 27);
    height: var(--swiper-navigation-size);
    margin-top: calc(-1 * var(--swiper-navigation-size) / 2);
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    height: 40px;
    width: 40px;
    background-position: center;
    background-color: #00a646;
}

.specialOfferImg {
    width: 90%;
    display: flex;
    margin: auto;
    border-radius: 10px;
}

.loading-item {
    width: 100%;
    margin: 20px;
}

.loading {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.specialOffer-title {
    font-size: 28px;
    font-weight: bold;
    color: black;
    padding: 20px 20px;
}

.specialOfferSwiper {
    cursor: pointer;
}

.specialOfferSwiper {
    padding: 2rem 0;
}

.containe {
    width: 100%;
    max-width: 1420px;
    margin: auto;
    border-left: 1px solid rgba(0, 0, 0, .1);
    border-right: 1px solid rgba(0, 0, 0, .1);
}

@media screen and (max-width: 768px) {
	.specialOfferImg{
		width: 80%;
	}
}

@media screen and (max-width: 450px) {

    .specialOfferImg {
        width: 95%;
        border-radius: 20px;
        height: 170px;
    }

    .customBtnPrev,
    .customBtnNext {
        display: none;
    }

    .specialOfferSwiper {
        padding: 1rem 0;
    }
}
</style>
