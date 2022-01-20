<template>
  <div
    class="home"
  >
    <header>
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
    <p
      id="riskBanner"
      :style="riskBanner"
    >
      <b>{{ risk }}</b> Risque de transmission dans l'agence
    </p>
    <h2 class="marginTop50">
      Précautions à observer
    </h2>
    <Caution
      v-for="(caution, i) in cautions"
      v-show="showCaution(caution.levelRequired)"
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
      functionURL: '/.netlify/functions/',
      level: 1,
      cautions: [],
      usefulls: [],
      covid: {},
      cases: '...',
      risk: '...',
      usefullsSpoiler: true,
      warningDisplay: false,
      personInside: null,
      rate: null
    }
  },
  computed: {
    riskBanner () {
      if (this.level === 1) {
        return 'background-color: #D3F9D8;border: 1px #40C057 solid;color: #0C5A16;'
      } else if (this.level === 2) {
        return 'background-color: #FEEC98;border: 1px #FAB004 solid;color: #655301;'
      } else if (this.level === 3) {
        return 'background-color: #FEE8CC;border: 1px #FC7E15 solid;color: #643902;'
      } else if (this.level === 4) {
        return 'background-color: #FEE3E3;border: 1px #F03E3E solid;color: #950404;'
      } else {
        return 'background-color: #eee;border: 1px #777 solid;color: #222;'
      }
    }
  },
  mounted () {
    document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/1.svg'
    this.fetchAPI()
    this.jsonGet()
  },
  methods: {
    fetchAPI () {
      var date = new Date()
      date.setDate(date.getDate() - 7)
      const formatDate = (date) => {
        const formattedDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
        return formattedDate
      }
      const lastWeek = formatDate(date)
      axios.get(this.functionURL + 'fetchAPI?targetedDate=' + lastWeek, {
      }).then(response => {
        this.covid = response.data.data[9]
        this.setCasesAndRisk()
      }).catch(e => {
        console.log(e)
      })
    },
    showCaution (x) {
      if (this.level === 1 && x === 1) {
        return true
      } else if (this.level === 2 && x <= 2) {
        return true
      } else if (this.level === 3 && (x === 1 || x === 3)) {
        return true
      } else if (this.level === 4 && x === 4) {
        return true
      }
    },
    jsonGet () {
      // GET USEFULLS (desc + link) & CAUTIONS (icon + desc)
      // GET USEFULLS (desc + link) & CAUTIONS (icon + desc)
      axios.get(this.functionURL + 'getJSON', {
      }).then(response => {
        this.fullData = JSON.parse(response.data.Body)
        this.cautions = this.fullData.cautions.data
        this.usefulls = this.fullData.usefulls.data
        this.personInside = this.fullData.mainInfos.personInside
        this.rate = this.fullData.mainInfos.incidencePlageForEachLevel
      }).catch(e => {
        console.log(e)
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
      // '.pos_7j' = Number of people declared positive over a week (D-3 date of sampling)  !!
      // v2 = N in Aube

      const v1 = this.covid.pos_7j * 2 // corrected: *2
      const v2 = 310000

      const casesCalc = (v1 * 100000) / v2
      this.cases = Math.round((casesCalc + Number.EPSILON) * 100) / 100

      // SET LEVEL (0-4)
      // i = cases & N = peoples
      const i = ((v1 * 100000) / v2) * 2
      const N = this.personInside
      const mult = (1 - i / 100000) ** N
      const riskCalc = Math.round((1 - mult) * 1000) / 10
      this.risk = riskCalc + '%'
      // SET LEVEL
      const rate = this.rate
      if (casesCalc < rate[0]) {
        this.level = 1
        document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/1.svg'
      } else if (casesCalc >= rate[0] && casesCalc < rate[1]) {
        this.level = 2
        document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/2.svg'
      } else if (casesCalc >= rate[1] && casesCalc < rate[2]) {
        this.level = 3
        document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/3.svg'
      } else if (casesCalc >= rate[2]) {
        this.level = 4
        document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/4.svg'
      }
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
    width: 100%;
    max-width: 305.5px;
  }
  h2 {
    margin-top: 60px;
    font-weight: 500;
    color: #4B4545;
    font-size: 24px;
    text-align: left;
  }
  .marginTop50 {
    margin-top: 50px;
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
  #riskBanner {
    text-align: left;
    padding: 10px 20px;
    margin-top: 74.5px;
    flex: 100%;
    border-radius: 4px;
    font-size: 15px;
    b {
      margin-right: 9px;
    }
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
  .loadingText {
    margin-top: 40vh;
  }
  // PC
  @media screen and (min-width: 800px) {
    #riskBanner {
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
