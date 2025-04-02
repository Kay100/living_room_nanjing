<script setup lang="ts">
</script>

<template>
  <div class="body">
    <tm-nav back fixed white backgroundColor="black" title=""></tm-nav>

    <div class="video">
      <video :src="cdn + '/v10/%E5%8D%97%E4%BA%AC%E6%96%87%E5%AD%A6%E8%A7%86%E9%A2%913.mp4'" autoplay loop />
    </div>
  </div>
</template>

<style scoped lang="scss">
.body {
  height: 100vh;
  background-color: black;
  display: flex;
  align-items: center;

  .video {
    width: 100%;
    video {
      width: 100%;
    }
  }
}
</style>
