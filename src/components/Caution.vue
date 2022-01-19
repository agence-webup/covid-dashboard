<template>
  <section
    class="caution"
  >
    <img
      v-if="icon != ''"
      :src="icon"
      :alt="desc"
    >
    <p>
      {{ desc }}
    </p>
  </section>
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
    justify-content: flex-start;
    align-items: center;
    margin: 20px 0;
    flex: 100%;
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
      font-size: 16px;
    }
  }
  @media screen and (min-width: 800px) {
    .caution {
      border: none;
      border-bottom: solid 1px #B8C1C1;
      border-radius: 0;
      background-color: transparent;
      margin: 0;
      padding: 0;
      p {
        margin: 0;
        text-align: left;
        color: #6E6E6E;
        line-height: 22px;
        width: 100%;
        font-size: 18px;
        padding: 29px 0;
      }
    }
  }
</style>
