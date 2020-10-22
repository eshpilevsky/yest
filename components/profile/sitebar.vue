<template>
  <div class="sidebar">
    <div class="sidebar-menu">
      <ul class="sidebar-menu__list">
        <li class="sidebar-menu__item active"><nuxt-link to="/profile">История заказов</nuxt-link></li>
        <li class="sidebar-menu__item"><nuxt-link to="/profile/bonus">Бонусный счет</nuxt-link></li>
        <li class="sidebar-menu__item"><nuxt-link to="/profile/edit">Личные данные</nuxt-link></li>
      </ul>
    </div>
    <div class="sidebar-bonus">
      <div class="sidebar-bonus__box">
        <img class="sidebar-bonus__img" src="@/assets/diamond.svg" alt="diamond" id="Capa_1">
      </div>
      <div class="sidebar-bonus__value">0<span>руб.</span></div>
      <div class="sidebar-bonus__descr">На Вашем бонусном счете</div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "sitebar",
        props: {
          activePage: String,
        }
    }
</script>

<style scoped lang="scss">
  .sidebar {
    max-width: 300px;
    width: 100%;

    &-menu {
      &__list {
        list-style: none;
        padding: 0;
        border-radius: 12px;
        border: 1px solid #fff;
        background: white;
        box-shadow: 0 0 15px rgba(81, 92, 98, 0.1);
        -webkit-box-shadow: 0 0 15px rgba(81, 92, 98, 0.1);
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
        margin-bottom: 20px;
      }

      &__item {
        margin: 0 20px;
        padding: 20px 0;
        border-bottom: 1px solid #e6e6e6;

        &.active {
          a {
            color: #ee5a6d;
          }
        }

        a {
          color: #000;
          text-decoration: none;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }

    &-bonus {
      height: 280px;
      background: rgb(233,72,110);
      background: -moz-linear-gradient(45deg, rgba(233,72,110,1) 0%, rgba(251,125,107,1) 100%);
      background: -webkit-linear-gradient(45deg, rgba(233,72,110,1) 0%,rgba(251,125,107,1) 100%);
      background: linear-gradient(45deg, rgba(233,72,110,1) 0%,rgba(251,125,107,1) 100%);
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e9486e', endColorstr='#fb7d6b',GradientType=1 );
      padding: 10px;
      border-radius: 12px;
      text-align: center;

      &__box {
        text-align: center;
        height: 150px;
        margin-bottom: 30px;
      }

      &__img {
        height: 100%;
        width: 150px;
      }

      &__value {
        font-size: 45px;
        line-height: 30px;
        font-weight: 300;
        color: #fff;
        margin-bottom: 4px;

        span {
          margin-left: 6px;
          font-size: 26px;
        }
      }

      &__descr {
        color: #fff;
        font-size: 16px;
        letter-spacing: -0.2px;
      }
    }

    @media screen and (max-width: 992px) {
      display: none;
    }
  }
</style>
