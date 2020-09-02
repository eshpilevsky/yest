<template>
<div>
    <div class="modal-container">
        <p class="modal-title">
            {{restuarant.name}}
        </p>
        <div>
            <ul class="rest-info-list">
                <li class="modal-text-gray" v-for="branch in restuarant.branch">
                    {{branch.address}}
                </li>
            </ul>
        </div>
        <div class="rest-info-categories__container">
            <div class="modal-text-gray rest-info-categories">
                <span class="rest-info-categories__item" v-for="tag in restuarant.tags">
                    {{tag.name}}
                </span>
            </div>
        </div>
        <div class="modal-text-gray modal-text-gray__fs12">
            Исполнитель (продавец): {{restuarant.legal_info.business_firm_name}}, {{restuarant.legal_info.business_address}}, УНП {{restuarant.legal_info.business_unp}}.
        </div>
        <div class="modal-text-gray modal-text-gray__fs12">
            Режим работы ресторана: с 09:00 до 21:00
        </div>
    </div>
</div>
</template>

<script>
export default {
	props: {
		restuarant:Object
	},

}
</script>

<style scoped>
  .modal-title {
    font-size: 20px;
    font-weight: 600;
    padding: 20px 20px 0;
    margin-bottom: 10px !important;
  }

  .modal-text-gray {
    padding: 3px 20px;
    line-height: 1em;
    font-size: 14px;
    color: #a0a0a0;
  }

  .modal-container {
    padding-bottom: 14px;
  }

  .rest-info-categories {
    margin-bottom: 10px;
  }

  .rest-info-list {
    padding: 0;
    margin-bottom: 10px;
    list-style: none;
  }

  @media screen and (max-width: 992px) {
    .modal-title {
      display: none;
    }

    .modal-text-gray {
      padding: 3px 16px;
    }

    .rest-info-list {
      padding-top: 16px;
      margin-bottom: 18px;
    }

    .rest-info-categories__container {
      padding: 0 16px;
    }

    .rest-info-categories {
      padding: 16px 0;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      margin-bottom: 16px;
      font-size: 16px;
      color: #000;
    }

    .rest-info-categories__item {
      margin-right: 16px;
      position: relative;
    }

    .rest-info-categories__item:after {
      content: "";
      position: absolute;
      left: calc(100% + 4px);
      top: 50%;
      transform: translateY(-50%);
      display: block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: #c1c1c1;
    }

    .rest-info-categories__item:last-child:after {
      content: none;
      display: none;
    }

    .modal-text-gray__fs12 {
      font-size: 12px;
      margin-bottom: 6px;
    }
  }
</style>
