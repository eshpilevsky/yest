<template>
<div>
    <transition name="slide-x-transition">
        <notifications group="Notification" position="bottom left" :duration=5000>
            <template slot="body" slot-scope="props">
                <div class="notif_block" >
                    <span class="notif_block_text" v-html="props.item.text" >
                    </span>
                    <div v-if="!props.item.title">
                        <a class="close" @click="props.close">
                            <v-icon >
                                close
                            </v-icon>
                        </a>
                    </div>
                    <div v-else @click="props.close" class="go_to_support_or_close">
                        <nuxt-link :to="props.item.title" class="goOver_btn" >
                            Перейти
                        </nuxt-link>
                        <a class="close" @click="props.close">
                            <v-icon >
                                close
                            </v-icon>
                        </a>
                    </div>
                </div>
            </template>
        </notifications>
    </transition>
</div>
</template>

<script>
export default {
	name: 'Notification'
}
</script>

<style>
.vue-notification-wrapper {
    width: 30vw !important;
}

.go_to_support_or_close {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.close {
    padding-right: 8px;
}

.notification-wrapper {
    overflow: visible !important;
}

.notifications {
    width: 100%;
    user-select: none;
}

.goOver_btn {
    text-transform: uppercase;
    text-decoration: none;
    padding-right: 10px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    user-select: none;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.25px;
    line-height: 16px;
}

.notif_block_text {
    display: flex;
    padding: 10px;
    height: 100%;
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    color: black;
}

.notif_block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 3rem;
    margin-left: 2rem;
    position: relative;
    z-index: 9999;
}

@media only screen and (max-width: 600px) {
    .notifications {
        width: 100%;
    }

    .notif_block {
        width: 80vw;
    }

    .vue-notification-wrapper {
        width: 100vw !important;
    }

}
</style>
