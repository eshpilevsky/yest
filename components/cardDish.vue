<template>
<v-card class="card-dish">
    <div class="dish-info-top">
        <div class="dish-price">
			{{this.computedPrice}} BYN
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
        <v-img cover :src="'https://img.eatmealby.com/resize/dish/400/'+this.img" lazy-src='https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg' :alt="this.name" class="dish-img" />
    </div>
</v-card>
</template>

<script>
export default {
    name: 'cardDish',
    props: {
        name: String,
        description: String,
        dishinfo: Array,
        img: String,
    },
	computed: {
		computedPrice() {
			if (this.dishinfo.length > 1) {
				return `От ${this.dishinfo[0].price}`
			} else {
				return `${this.dishinfo[0].price}`
			}
		}
	},

}
</script>

<style scoped>

.dish-info-top{
    flex: 1 0 auto;
}

.dash-info-bottom {
    margin-top: 24px;
}

.card-dish {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    cursor: pointer;
    display: flex;
    padding: 18px 20px;
    position: relative;
    border-radius: 4px;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 5px;
}

.dish-img {
    max-height: 210px;
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
