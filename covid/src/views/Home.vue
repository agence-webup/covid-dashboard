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
          Taux d’incidence dans l’Aube : {{ cases }} / 100 000
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
  <span
    v-if="warningDisplay"
    id="warningText"
    @click="warningDisplay = false"
  >
    <p>Impossible d'obtenir les statistiques. Les chiffres utilisés sont donc des exemples à ne pas prendre en compte.</p>
  </span>
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
      usefullsSpoiler: true,
      warningDisplay: false,
      personInside: null
    }
  },
  computed: {

  },
  mounted () {
    this.jsonGet()
  },
  methods: {
    jsonGet () {
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
        this.covid = response.data[9]
        this.setCasesAndRisk()
        this.covidIsRdy = true
      }).catch(e => {
        console.log(e)
        axios.get('http://localhost:3000/covid', {
        }).then(response => {
          this.covid = response.data[0]
          this.setCasesAndRisk()
          this.covidIsRdy = true
          this.warningDisplay = true
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

      const v1 = this.covid.pos_7j / 7 // divided by 7 to get an average per day
      const v2 = 310000

      const casesCalc = (v1 * 100000) / v2
      this.cases = Math.round((casesCalc + Number.EPSILON) * 100) / 100

      // SET LEVEL (0-4)
      axios.get('http://localhost:3000/mainInfos', {
      }).then(response => {
        this.personInside = response.data.personInside
        // i = cases & N = peoples
        const i = ((v1 * 100000) / v2) * 2
        const N = this.personInside
        const mult = (1 - i / 100000) ** N
        let riskCalc = Math.round((1 - mult) * 1000) / 10
        if (riskCalc > 5) {
          riskCalc = Math.round(riskCalc)
        }
        this.risk = riskCalc + '%'
        // SET LEVEL
        const rate = response.data.incidenceRateForEachLevel
        if (casesCalc < rate[1]) {
          this.level = 1
        } else if (casesCalc >= rate[1] && casesCalc < rate[2]) {
          this.level = 2
        } else if (casesCalc >= rate[2] && casesCalc < rate[3]) {
          this.level = 3
        } else if (casesCalc >= rate[3]) {
          this.level = 4
        }
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
    background-color: #FA5252;
    color: white;
    font-weight: bold;
    padding: 0 5px 5px 5px;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  #warningText {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #FA5252;
    width: 100%;
    cursor: pointer;
    p {
      margin: 0;
      color: white;
      font-weight: bold;
      text-align: left;
      padding: 10px 20px;
      font-size: .8em;
    }
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
