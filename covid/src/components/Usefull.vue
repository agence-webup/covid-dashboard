<template>
  <a
    :href="link"
  >
    <div
      class="caution"
    >
      <p class="desc">
        {{ desc }}
      </p>
      <p class="link">
        {{ link }}
      </p>
    </div>
  </a>
</template>

<script>
export default {
  name: 'Usefull',
  props: {
    desc: {
      type: String,
      required: true
    },
    link: {
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
    padding: 25px 23px;
    margin: 20px 0;
    text-align: left;
    word-wrap: break-word;
    line-height: 24px;
    font-size: 16px;
    .desc {
      color: #4B4545;
      text-decoration: none;
    }
    .link {
      text-decoration: underline;
      color: #1862AB;
    }
  }
</style>
