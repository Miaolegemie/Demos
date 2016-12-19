<template lang="html">
<div class="title">
  <div class="score">
    <h1>2048</h1>
    <div class="score-container">
      <div class="now">
        <p>当前分数</p>
        <p>当前分数</p>
      </div>
      <div class="best">
        <p>最高分数</p>
        <p>最高分数</p>
      </div>
    </div>
  </div>
  <div class="above-game">
    <p class="game-intro">使用vue2.0开发</p>
    <a class="restart-button">重新开始</a>
  </div>
</div>
</template>

<script>
export default {
}
</script>

<style lang="stylus">
.title
  display flex
  flex-direction column
  align-items center
  .score
    display flex
    .score-container
      display flex
  .above-game
    display flex
</style>
