<template>
  <div class="radioFlex">
    <input
      :id="data"
      type="radio"
      :value="data"
      name="icone"
      :checked="selected === './assets/Precautions/Icones/' + data + '.svg'"
    >
    <label :for="data">
      <img :src="'/assets/Precautions/Icones/' + data + '.svg'">
    </label>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  props: {
    data: {
      type: String,
      required: true
    },
    selected: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
  .radioFlex {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 20px;
  }
</style>
