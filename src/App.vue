<template>
    <div id="app">
        <div class="view" :style="{height: quotesViewHeight}">
            <router-view name="quotes"></router-view>
        </div>
        <div class="divider" :style="{height: dividerHeight}" draggable="true" v-on:dragend="dragEnd" ></div>
        <div class="view" :style="{height: userViewHeight}">
            <router-view name="user"></router-view>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ContextMenu from '@/components/ContextMenu.vue'

export default {
  name: 'home',
  components: {
        ContextMenu
    },
  data() { 
    return { 
        contextMenuVisible: false,
        contextMenuEvent: null,
        dividerHeight: this.$store.state.dividerHeight + 'px',
    }
  },
  computed: {
    ...mapState({
        quotesViewHeight: (state) => state.quotesViewHeight + 'px',
        userViewHeight: (state) => state.userViewHeight + 'px'
    })
  },
  methods: {
    dragEnd: function (e) {
        this.$store.commit('SET_LAYOUT', e.pageY)
    }
  }
}
</script>

<style lang="scss">
    html,
    body {
        height: 100%;
        margin: 0;
        overflow: hidden;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0;
        padding: 0;
        height: 100%;
        .divider {
            width: 100%;
            cursor: ns-resize;
            background-color: #000000;
            overflow: hidden;
        }
        .view{
            width: 100%;
            overflow: hidden;
            .quotes-container {
                width: 100%;
                height: 100%;
            }
            .user-container{
                height: 100%;
                overflow: hidden;
            }
        }
    }

    // #app .right-menu {
    //     position: absolute;
    //     background: #fff;
    //     border: solid 1px rgba(0, 0, 0, .2);
    //     border-radius: 3px;
    //     z-index: 6;
    //     // display: none;

    //     a {
    //         width: 75px;
    //         height: 28px;
    //         line-height: 28px;
    //         text-align: center;
    //         display: block;
    //         color: #1a1a1a;
    //         text-decoration: none;
    //         background: #42b983;
    //         padding: 2px;
    //         &:hover {
    //             background: #eee;
    //             color: #fff;
    //         }
    //     }
    // }

    // .right-menu {
    //     border: 1px solid #eee;
    //     box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
    //     border-radius: 1px;
    // }
</style>
