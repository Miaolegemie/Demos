<template lang="html">
<div class="board">
  <div class="board-row" v-for="board in boards">
    <div class="board-cell" v-for="cell in board">

    </div>
  </div>
</div>
</template>

<script>
import Cell from './cell.vue'

export default {
  data() {
    return {
      boards: {}
    }
  },
  mounted(){
    for(let i = 1; i <= 4; i++){
      let row = []
      for(let j = 1; j <= 4; j++){
        row.push(`${i}-${j}`)
      }
      this.boards[i] = row
    }
  },
}
</script>

<style lang="stylus">
.board
  width 450px
  padding 5px
  display flex
  flex-direction column
  background-color #bbada0
  border-radius 8px
  .board-row
    display flex
    .board-cell
      width 100px
      height 100px
      margin 5px
      background-color rgba(238, 228, 218, 0.35)
      border-radius 8px
</style>
