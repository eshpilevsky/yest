<template>
<div>
    <div class="pa-3">
        <h3>
            {{restuarant.name}}
        </h3>
        <div>
            <ul>
                <li v-for="branch in restuarant.branch">
                    {{branch.address}}
                </li>
            </ul>
        </div>
        <div>
            <span v-for="tag in restuarant.tags">
                {{tag.name}}
            </span>
        </div>
        <div>
            Исполнитель (продавец): {{restuarant.legal_info.business_firm_name}}, {{restuarant.legal_info.business_address}}, УНП {{restuarant.legal_info.business_unp}}.
        </div>
        <div>
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

