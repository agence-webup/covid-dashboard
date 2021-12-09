<template>
  <div
    v-if="jsonIsLoaded == 3"
    class="home"
  >
    <header>
      <span id="risk">{{ risk }} ⚠️</span>
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
      <div>
        <h1>Niveau d’alerte lié à l’épidémie de Covid-19</h1>
        <span>{{ level }} / 4</span>
        <p>
          Il y a {{ risk }} de risques que l’un de nous soit infecté
          <br>
          Taux d’incidence dans l’Aube : {{ cases }}
        </p>
      </div>
    </header>
    <h2>Précautions à observer</h2>
    <Caution
      v-for="(caution, i) in cautions"
      v-show="caution.levelRequired <= level"
      :key="i"
      :icon="caution.icon"
      :desc="caution.desc"
    />
    <h2
      id="dropDownTitle"
      @click="showUsefull()"
    >
      Liens utiles
    </h2>
    <Usefull
      v-for="(usefull, i) in usefulls"
      v-show="usefullsSpoiler"
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
      usefulls: [],
      covid: {},
      covidIsRdy: false,
      cases: '...',
      risk: '...',
      usefullsSpoiler: true
    }
  },
  computed: {

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
      // COVID STATS FOR "Aube"
      // GET DATE -7 days
      var date = new Date()
      date.setDate(date.getDate() - 7)
      const formatDate = (date) => {
        const formattedDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
        return formattedDate
      }
      const lastWeek = formatDate(date)
      axios.get('https://coronavirusapifr.herokuapp.com/data/departements-by-date/' + lastWeek, {
      }).then(response => {
        console.log(response.data[9])
        this.covid = response.data[9]
        this.setCasesAndRisk()
        this.covidIsRdy = true
      }).catch(e => {
        console.log(e)
        axios.get('http://localhost:3000/covid', {
        }).then(response => {
          console.log(response.data[0])
          this.covid = response.data[0]
          this.setCasesAndRisk()
          this.covidIsRdy = true
        }).catch(e => {
          console.log(e)
        })
      })
    },
    // USEFULLS SPOILER
    showUsefull () {
      var styleElem = document.head.appendChild(document.createElement('style'))
      this.usefullsSpoiler ? this.usefullsSpoiler = false : this.usefullsSpoiler = true
      if (this.usefullsSpoiler) {
        styleElem.innerHTML = '#dropDownTitle:after {transform: translateY(25%);}'
      } else {
        styleElem.innerHTML = '#dropDownTitle:after {transform: translateY(25%) rotateZ(-90deg);}'
      }
    },
    // CALC CASES & RISK
    setCasesAndRisk () {
      // '.pos' = Number of people declared positive (D-3 date of sampling)
      // '.pos_7j' = Number of people declared positive over a week (D-3 date of sampling)
      // v2 = N in Aube
      const v1 = this.covid.pos_7j / 3
      const v2 = 300000 / 3

      this.cases = Math.round(((v1 * 100 / v2) + Number.EPSILON) * 100) / 100 + '%'

      // i = cases & N = peoples
      const i = v1 * 100 / v2
      const N = 12
      this.risk = Math.round((Math.pow(1 - (1 - i / 100000), N) + Number.EPSILON) * 100) / 100 + '%'
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
  header div {
    display: none;
  }
  #dropDownTitle {
    display: flex;
    align-items: center;
  }
  #dropDownTitle::after {
    content: '';
    background-image: url('/assets/Icons/Down.svg');
    width: 13.2px;
    height: 7.6px;
    margin: 0 0 0 10px;
    transform: translateY(25%);
    transition: transform .15s;
  }
  #risk {
    position: absolute;
    top: 0;
    left: 20px;
    background-color: orangered;
    padding: 0 5px 5px 5px;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  // PC
  @media screen and (min-width: 800px) {
    #risk {
      display: none;
    }
    .home {
      max-width: 788px;
      margin: auto;
      margin-bottom: 280px;
    }
    header {
      background-color: #565B6C;
      border-radius: 12px;
      padding: 35px 56px 30px 56px;
      width: fit-content;
      width: -moz-fit-content;
      display: flex;
      justify-content: space-between;
      margin: auto;
      margin-top: 60px;
      .tacometer {
        max-width: 170px;
        max-height: 121px;
        margin: 0 44px 0 0;
      }
      div {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        max-width: 461px;
        h1 {
          color: #FFFFFF;
          font-weight: 500;
          font-size: 24px;
          text-align: left;
          width: 100%;
          margin: 0;
        }
        > span {
          background-color: #FA5252;
          border-radius: 3px;
          padding: 6px 11px;
          margin-right: 16px;
          font-size: 24px;
          color: #FFFFFF;
          font-weight: 700;
          height: fit-content;
          height: -moz-fit-content;
        }
        p {
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 400;
          text-align: left;
          line-height: 19px;
          margin: 0;
        }
      }
    }
  }
</style>
