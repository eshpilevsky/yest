<template>
<v-card class="card-dish" :class="{selected: this.counter > 0}">
    <div class="dish-info-top">
        <div class="dish-price">
            <span>
                {{this.counter > 0 ? `${this.counter} х`: ''}}
            </span>
			<div class="d-flex flex-column">
				<span class="pl-1">
					{{this.computedPrice}} BYN
				</span>
				<span class="old-price" v-show="this.dishinfo[0].sale == 2">
					{{(this.dishinfo[0].price + this.dishinfo[0].discount).toFixed(1)}} BYN
				</span>
			</div>
        </div>
        <h3 class="dish-card-title">
            {{this.name}}
        </h3>
        <span class="dish-weight">
            {{this.dishinfo[0] != null ? this.dishinfo[0].weight: null}}
        </span>
        <div class="dish-description">
            {{this.description}}
        </div>
    </div>
    <div class="dash-info-bottom">
        <span class="dash-info-compare" v-show="this.dishinfo[0].sale == 2">%</span>
        <img v-if="this.img == 1" :src="'https://img.eatmealby.com/resize/dish/400/'+this.img" :alt="this.name" class="dish-img" />
        <img v-else src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="this.name" class="dish-img" />
    </div>
</v-card>
</template>

<script>
import {
    mapGetters
} from "vuex"
export default {
    name: 'cardDish',
    props: {
        name: String,
        description: String,
        dishinfo: Array,
        img: String,
        id: Number,
        count: Number,
    },
    data() {
        return {
            counter: 0,
        }
    },
    computed: {
        computedPrice() {
            this.dishinfo = this.dishinfo.sort(function (a, b) {
                if (a.price > b.price) {
                    return 1;
                }
                if (a.price < b.price) {
                    return -1;
                }
                return 0;
			});

            if (this.dishinfo.length == 0) {
                return 'Нет цены'
            } else if (this.dishinfo.length > 1) {
                let chekDiffrentPrice = this.dishinfo.find((dish, index, arr) => {
                    return dish.price == arr[index - 1] !== undefined ? arr[index - 1] : 0
                })
                if (chekDiffrentPrice !== undefined) {
                    return `От ${this.dishinfo[0].price}`
                } else {
                    return `${this.dishinfo[0].price}`
                }
            } else {
                return `${this.dishinfo[0].price}`
            }
        },
        ...mapGetters({
            getSelectedDishs: "basket/getSelectedDishs",
        }),
    },
    watch: {
        getSelectedDishs(newValue) {
            if (newValue.length !== 0) {
                this.checkInBasket(newValue)
            } else {
                this.counter = 0
            }
        },
        count(newValue) {
            this.counter = newValue
            return newValue
        }
    },
    methods: {
        checkInBasket(mass) {
            let searchDish = mass.find((dish) => {
                return dish.id == this.id
            });
            if (searchDish !== undefined) {
                this.counter = searchDish.selectSize.count
            }
        }
    },
    mounted() {
        this.$store.watch(
            (state) => {
                return this.$store.state.basket.data.dishs
            },
            (newValue, oldValue) => {
                let findDish = newValue.find((dish) => {
                    return dish.id == this.id
                })
                if (findDish !== undefined) {
                    this.counter = findDish.selectSize.count
                } else {
					this.counter = 0
				}
            }, {
                deep: true
            }
        )
        this.checkInBasket(this.getSelectedDishs)
    },
}
</script>

<style scoped>

.old-price{
	color: #b0b0b0;
    font-size: 14px;
    text-decoration: line-through;
}

.selected {
    border-left: 3px solid #00a646 !important;
}

.dish-info-top {
    flex: 1 0 auto;
}

.dash-info-bottom {
    margin-top: 24px;
    height: 210px;
    overflow: hidden;
    position: relative;
    border-radius: 5px;
}

.dash-info-compare {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #4ca647;
    width: 49px;
    height: 31px;
    display: flex;
    justify-content: center;
    line-height: 31px;
    color: #fff;
    font-weight: 600;
    font-size: 21px;
    border-radius: 0 0 3px 0;
}

.card-dish {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    cursor: pointer;
    display: flex;
    padding: 18px 20px;
    position: relative;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: none;
}

.dish-img {
    /* max-height: 210px; */
    object-fit: contain;
    width: 100%;
    border-radius: 5px;
    background-repeat: no-repeat;
    background-position: center;
}

.dish-description {
    color: #b0b0b0;
    width: 100%;
    overflow: hidden;
    font-size: 15px;
    margin-top: 8px;
    line-height: 1.33;
    overflow-wrap: break-word;
}

.dish-price {
    display: flex;
    justify-content: flex-end;
    float: right;
    min-width: 80px;
    text-align: right;
    margin-left: 10px;
    font-weight: bold;
}

.dish-weight {
    color: #999999;
    line-height: 1.39;
    white-space: nowrap;
}

.dish-card-title {
    display: inline;
    font-size: 18px;
    line-height: 1.39;
}
</style>
