<template>
  <span
    :href="link"
  >
    <div
      class="usefull"
    >
      <p class="desc">
        {{ desc }}
      </p>
      <p class="link">
        {{ link }}
      </p>
    </div>
  </span>
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
  .usefull {
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
    cursor: pointer;
    .desc {
      color: #4B4545;
      text-decoration: none;
    }
    .link {
      text-decoration: underline;
      color: #1862AB;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  @media screen and (min-width: 800px) {
    .usefull {
      border: none;
      box-shadow: 0 6px 12px -12px #00000035;
      width: auto;
      &:hover {
        box-shadow: 0 6px 12px -12px #00000035,
                    3px 0 0 orangered;
        border-top-right-radius: unset !important;
        border-bottom-right-radius: unset !important;
        border-radius: 5px;
      }
    }
  }
</style>
