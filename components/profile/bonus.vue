<template>
  <div class="bonus">
    <div class="bonus-head">
      <img class="bonus-head__img" src="@/assets/diamondRed.svg" alt="diamond">
      <div class="bonus-sale">
        <p class="bonus-sale__item">3 <span>%</span></p>
        <p class="bonus-sale__item">4 <span>%</span></p>
        <p class="bonus-sale__item">5 <span>%</span></p>
        <p class="bonus-sale__item">6 <span>%</span></p>
        <p class="bonus-sale__item">7 <span>%</span></p>
      </div>
    </div>
    <p class="bonus-title">Условия бонусной программы</p>
    <ul class="bonus-list">
      <li class="bonus-list__item">Бонусы зачисляются на счет после выставления заказу статуса "Доставлен"</li>
      <li class="bonus-list__item">На сумму покупки оплаченному бонусами, бонусы не начисляются.</li>
      <li class="bonus-list__item">Один бонусный рубль эквивалентен одному рублю.</li>
      <li class="bonus-list__item">Бонусами можно оплатить до 20% от стоимости заказа</li>
      <li class="bonus-list__item">Наша компания оставляет за собой право изменить правила и условия программы в любое время без предварительного уведомления.</li>
      <li class="bonus-list__item">Бонусные рубли не могут быть переведены в рубли</li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "bonus"
    }
</script>

<style scoped lang="scss">
  .bonus {
    width: 100%;

    &-head {
      display: flex;
      align-items: center;
      margin-bottom: 40px;

      @media screen and (max-width: 600px) {
        flex-direction: column;
      }

      &__img {
        width: 20%;
        max-width: 150px;
        margin-right: 30px;

        @media screen and (max-width: 600px) {
          width: 110px;
          margin: 0 0 20px;
        }
      }
    }

    &-sale {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      align-items: center;
      border: 1px dashed #ddd;
      border-radius: 6px;
      padding: 10px 0;
      width: 70%;
      max-width: 480px;

      @media screen and (max-width: 600px) {
        width: 100%;
        margin: 0 0 20px;
      }

      &__item {
        border-right: 1px solid #ddd;
        font-size: 44px;
        font-weight: 600;
        color: #afafaf;
        text-align: center;

        @media screen and (max-width: 600px) {
          font-size: 32px;
        }

        span {
          margin-left: -10px;
        }

        &:last-child {
          border-right: none;
        }
      }
    }

    &-title {
      font-size: 20px;
      margin-bottom: 20px !important;
    }

    &-list {
      list-style: none;

      @media screen and (max-width: 992px) {
        padding-left: 0;
      }

      &__item {
        list-style: none;
        padding-left: 20px;
        position: relative;
        margin-bottom: 6px;

        &:before {
          content: "";
          position: absolute;
          top: 8px;
          left: 0;
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #ee5a6d;
        }
      }
    }
  }
</style>
