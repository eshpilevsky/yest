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
        <div class="modal-text-gray rest-info-categories">
            <span v-for="tag in restuarant.tags">
                {{tag.name}}
            </span>
        </div>
        <div class="modal-text-gray">
            Исполнитель (продавец): {{restuarant.legal_info.business_firm_name}}, {{restuarant.legal_info.business_address}}, УНП {{restuarant.legal_info.business_unp}}.
        </div>
        <div class="modal-text-gray">
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
  }
</style>
