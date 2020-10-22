<template>
  <div class="history">
    <div class="history-empty">
      <div class="history-empty__box">
        <img class="history-empty__img" src="@/assets/sadSmile.svg" alt="sad smile">
      </div>
      <span>Вы не сделали ни одного заказа</span>
    </div>
  </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped lang="scss">
  .history {
    &-empty {
      display: flex;
      align-items: center;
      border-radius: 6px;
      border: 1px dashed #ddd;
      padding: 10px 20px;

      @media screen and (max-width: 992px) {
        margin-top: 30px;
      }

      &__box {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }

      &__img {
        width: 100%;
      }
    }
  }
</style>
