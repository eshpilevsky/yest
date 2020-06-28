<template>
<div class="mobileSearch">
    <v-text-field placeholder="Найти в Еде" height="48" dense clearable filled outlined prepend-inner-icon="search" class='mobileSearchInput' v-model="search" ></v-text-field>
</div>
</template>

<script>
export default {
	name: 'mobileSearch',
	data () {
		return {
			search: ''
		}
	}
}
</script>

<style scoped>
.mobileSearch {
    /* display: none; */
}

.v-input__icon--append .v-icon {
    color: black;
}

@media screen and (max-width: 450px) {
    .mobileSearch {
        display: flex;
        position: fixed;
        top: 65px;
        background-color: white;
        width: 100%;
		padding: 10px;
		margin: 0 0px !important;
        height: 70px;
		z-index:1;
    }
    .mobileSearchInput{
        margin: 10px;
        border-radius: 10px !important;
    }
}
</style>
