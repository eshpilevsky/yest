<template>
<v-card class="card-dish" :class="{selected: this.counter > 0}">
  <div class="dash-info-bottom">
    <span class="dash-info-compare" v-show="this.dishinfo[0].sale == 2">%</span>
    <img v-if="this.img !== ''" v-lazy="'https://img.eatmealby.com/resize/dish/400/'+this.img" :alt="this.name" class="dish-img" />
    <img v-else src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="this.name" class="dish-img" />
  </div>
<!--  <div class="dish-info-top">-->
<!--      <div class="dish-price">-->
<!--          <span>-->
<!--              {{this.counter > 0 ? `${this.counter} х`: ''}}-->
<!--          </span>-->
<!--    <div class="d-flex flex-column">-->
<!--      <span class="pl-1">-->
<!--        {{this.computedPrice}} BYN-->
<!--      </span>-->
<!--      <span class="old-price" v-show="this.dishinfo[0].sale == 2">-->
<!--        {{(this.dishinfo[0].price + this.dishinfo[0].discount).toFixed(1)}} BYN-->
<!--      </span>-->
<!--    </div>-->
<!--      </div>-->
<!--      <h3 class="dish-card-title">-->
<!--        {{this.name}}-->
<!--      </h3>-->
<!--      <div class="dish-description">-->
<!--        <span class="dish-weight">{{this.dishinfo[0] != null ? this.dishinfo[0].weight: null}}</span> {{this.description}}-->
<!--      </div>-->
<!--  </div>-->

  <div class="menu-product__info-container">
    <div class="menu-product__info">
      <div class="menu-product__info-block-container">
        <div class="menu-product__info-block">
          <div class="menu-product__title">{{this.name}}</div>
          <div class="menu-product__desc">
            <span class="dish-weight">{{this.dishinfo[0] != null ? this.dishinfo[0].weight: null}}</span> {{this.description}}
          </div>
        </div>
        <div class="menu-product__info-block menu-product__info-block--hover">
          <div class="menu-product__title">{{this.name}}</div>
          <div class="menu-product__desc">
            <span class="dish-weight">{{this.dishinfo[0] != null ? this.dishinfo[0].weight: null}}</span> {{this.description}}
          </div>
        </div>
      </div>
      <div class="menu-product__row">
        <div class="menu-product__price-wrapper">
          <div class="menu-product__price">
            {{(this.dishinfo[0].price + this.dishinfo[0].discount).toFixed(1)}} BYN
          </div>
        </div>
        <button class="menu-product__btn green-btn">В корзину</button>
      </div>
    </div>
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
  padding: 0 10px 10px;
}

.dash-info-bottom {
    height: 190px;
    overflow: hidden;
    position: relative;
  margin-bottom: 10px;
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
    padding: 0;
    position: relative;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 0 !important;
    box-shadow: none;
}

.dish-img {
    /* max-height: 210px; */
    object-fit: contain;
    width: 100%;
    height: 190px;
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
  margin-right: 10px;
  position: relative;
}

.dish-weight:after {
  content: "";
  position: absolute;
  top: 8px;
  right: -8px;
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #ddd;
}

.dish-card-title {
    display: inline;
    font-size: 18px;
    line-height: 1.39;
}
.card-dish:hover .menu-product__btn {
  display: inline-block;
  vertical-align: middle;
}
.card-dish:hover .menu-product__info-block--hover .menu-product__desc {
  -webkit-line-clamp: initial;
}

  .menu-product__info-container {
    z-index: 2;
  }
  .menu-product__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    transition: all 0.2s ease;
  }
  .menu-product__info-block-container {
    position: relative;
    min-height: 72px;
  }
  .menu-product__info-block {
    padding: 16px 16px 0;
    box-sizing: border-box;
  }
  .menu-product__info-block--hover {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
  }
  .menu-product__title {
    font-size: 15px;
    line-height: 20px;
  }
  .menu-product__desc {
    color: #919399;
    font-size: 12px;
    line-height: 16px;
    display: -webkit-box;
    overflow: hidden;
    word-break: break-word;
    font-weight: 400;
    margin-bottom: 4px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .menu-product__row {
    justify-content: space-between;
    line-height: 32px;
    padding: 0 16px 16px;
    box-sizing: border-box;
    margin-top: 16px;
    display: flex;
    align-items: center;
  }
  .menu-product__price-wrapper {
    margin-left: 0;
    order: 1;
  }
  .menu-product__price {
    display: inline-block;
    vertical-align: middle;
    font-size: 15px;
    line-height: 20px;
    font-weight: bold;
    margin-right: 8px;
  }
  .menu-product__btn {
    width: 128px;
    display: none;
    order: 2;
    background-color: #0ec645;
    color: #fff;
    height: 32px;
    padding: 0 16px;
    line-height: 32px;
    border-radius: 4px;
    text-align: center;
    border: 0;
    cursor: pointer;
    font-size: 15px;
  }
</style>
