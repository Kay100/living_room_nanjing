<template>
  <div v-for="(item,index) in line" :key="index" :class="{ indent: indent }">{{item}}</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  // 首行缩进
  indent: {
    type: Boolean,
    default: true,
  }
});

const line = computed(() => props.text.split('\n'));
</script>

<style scoped>
.indent {
  text-indent: 2em;
}
</style>
