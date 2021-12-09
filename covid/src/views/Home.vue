<template>
  <div
    v-if="jsonIsLoaded == 3"
    class="home"
  >
    <picture>
      <source
        :srcset="'/assets/Desktop/Jauge/' + level + '.svg'"
        media="(min-width: 800px)"
      >
      <img
        class="tacometer"
        :src="'/assets/Mobile/Jauge/' + level + '.svg'"
        :alt="'Danger de niveau ' + level"
      >
    </picture>
    <h2>Précautions à observer</h2>
    <Caution
      v-for="(caution, i) in cautions"
      :key="i"
      :icon="caution.icon"
      :desc="caution.desc"
    />
    <h2>Liens utiles ▼</h2>
    <Usefull
      v-for="(usefull, i) in usefulls"
      :key="i"
      :desc="usefull.desc"
      :link="usefull.link"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Caution from '@/components/Caution.vue'
import Usefull from '@/components/Usefull.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Caution,
    Usefull
  },
  data () {
    return {
      jsonIsLoaded: 0,
      level: 1,
      cautions: [],
      usefulls: []
    }
  },
  mounted () {
    this.jsonGet()
  },
  methods: {
    jsonGet () {
      // GET LEVEL (0-4)
      axios.get('http://localhost:3000/level', {
      }).then(response => {
        this.level = response.data.state
        this.jsonIsLoaded += 1
      }).catch(e => {
        console.log(e)
      })
      // GET CAUTIONS (icon + desc)
      axios.get('http://localhost:3000/cautions', {
      }).then(response => {
        this.cautions = response.data
        this.jsonIsLoaded += 1
      }).catch(e => {
        console.log(e)
      })
      // GET USEFULLS (desc + link)
      axios.get('http://localhost:3000/usefulls', {
      }).then(response => {
        this.usefulls = response.data
        this.jsonIsLoaded += 1
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
  .home {
    margin: 0 20px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
  }
  .tacometer {
    margin: 80px 0 20px 0;
    height: 217.15px;
  }
  h2 {
    margin-top: 60px;
    font-weight: 500;
    color: #4B4545;
    font-size: 24px;
    text-align: left;
  }
</style>
