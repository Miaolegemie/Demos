<template>
  <div id="app">
    <com-title></com-title>
    <com-board></com-board>
    <com-end></com-end>
  </div>
</template>

<script>
import Title from './component/title.vue'
import Board from './component/board.vue'
import End from './component/end.vue'

export default {
  data () {
    return {

    }
  },
  components: {
    comTitle: Title,
    comBoard: Board,
    comEnd: End,
  }
}
</script>

<style lang="stylus">
#app
  width 450px
  margin 0 auto

/* reset */
*{box-sizing:border-box;}
html,body{color:#000;background:#fff;}
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,input,button,textarea,p,blockquote,th,td{margin:0;padding:0;}
body{font:12px/1.5 Tahoma,Helvetica,Arial,"\5b8b\4f53",sans-serif;}
img{border:none;}
em,strong{font-style:normal;font-weight:normal;}
li{list-style:none;}
table {border-collapse:collapse;border-spacing:0;}
h1{font-size:18px;}
h2{font-size:16px;}
h3{font-size:14px;}
h4, h5, h6{font-size:100%;}

q:before,q:after{content:'';}/* 消除q前后的内容 */
button,input,select,textarea{font-size:100%;}/* 使得表单元素在 ie 下能继承字体大小 */
input,button,textarea,select,optgroup,option{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;}
address,cite,dfn,em,var{font-style:normal;} /* 将斜体扶正 */

/* link */
a{color:#000;text-decoration:none;}
a:hover{color:#f60;text-decoration:none;}
</style>
