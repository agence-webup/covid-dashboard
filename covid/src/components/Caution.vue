<template>
  <div
    class="caution"
  >
    <img
      :src="icon"
      :alt="desc"
    >
    <p>
      {{ desc }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Caution',
  props: {
    icon: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .caution {
    background-color: white;
    border-radius: 12px;
    border: solid 1px #B8C1C1;
    color: #B8C1C1;
    padding: 23px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    img {
      width: 34px;
      height: 34px;
      margin-right: 23px;
    }
    p {
      margin: 0;
      text-align: left;
      color: #6E6E6E;
      line-height: 22px;
    }
  }
</style>
