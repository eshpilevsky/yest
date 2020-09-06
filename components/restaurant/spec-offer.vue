<template>
<div>
    <div class="rest-info-compared">
        <div class="rest-info-compared__row" v-for="sale in this.salesText" :key="sale.id">
            <span class="rest-info-compared__logo">%</span>
            <p class="rest-info-compared__box">
                <span class="rest-info-compared__title">{{sale.header}}</span>
                <span class="rest-info-compared__descr">{{sale.text}}</span>
            </p>
        </div>
        <!-- <div class="rest-info-compared__row">
            <span class="rest-info-compared__logo">
                <v-icon color="#fff">card_giftcard</v-icon>
            </span>
            <p class="rest-info-compared__box">
                <span class="rest-info-compared__title">Блюдо в подарок</span>
                <span class="rest-info-compared__descr">При первом заказе от (сумма) BYN из этого ресторана (блюдо) бесплатно</span>
            </p>
        </div> -->
    </div>
</div>
</template>

<script>
export default {
	props: {
		salesText: Array,
	},
	mounted () {
		console.log(this.salesText);
	},
}
</script>

<style scoped>
.rest-info-compared {
    padding: 40px 80px 20px;
    /*background-image: linear-gradient(to bottom, #ffffff, hsl(0deg 0% 29% / 14%) 480px);*/
    background-color: #f2f2f2;
}

.rest-info-compared__row {
    display: flex;
    align-items: center;
    padding: 10px;
    overflow: hidden;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05);
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 20px;
}

.rest-info-compared__logo {
    color: #fff;
    font-size: 30px;
    font-weight: 600;
    line-height: 70px;
    flex: 0 0 auto;
    width: 70px;
    height: 70px;
    display: flex;
    background: #4ca647;
    box-shadow: 0 2px 16px 0px rgba(0, 0, 0, 0.07);
    box-sizing: content-box;
    align-items: center;
    margin-right: 20px;
    border-radius: 4px;
    justify-content: center;
}

.rest-info-compared__box {
    display: flex;
    flex-direction: column;
}

.rest-info-compared__title {
    font-size: 18px;
    line-height: 1.3;
}

.rest-info-compared__descr {
    color: #b0b0b0;
    font-size: 14px;
    margin-top: 1px;
    line-height: 1.43;
}

@media screen and (max-width: 992px) {
  .rest-info-compared {
    padding: 0;
    background-image: none;
  }

  .rest-info-compared__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    padding: 10px 0;
    box-shadow: none;
    margin-bottom: 0;
  }

  .rest-info-compared__row:last-child {
    border-bottom: none;
  }

  .rest-info-compared__logo {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    line-height: 42px;
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    border: 5px solid #fff;
    display: flex;
    background: #4ca647;
    box-shadow: 0 2px 16px 0px rgba(0, 0, 0, 0.07);
    box-sizing: content-box;
    align-items: center;
    margin-right: 12px;
    border-radius: 999px;
    justify-content: center;
  }

  .rest-info-compared__box {
    display: flex;
    flex-direction: column;
  }

  .rest-info-compared__title {
    font-size: 14px;
    line-height: 1.43;
  }

  .rest-info-compared__descr {
    color: #b0b0b0;
    font-size: 12px;
    margin-top: 1px;
    line-height: 1.16;
  }
}

</style>
