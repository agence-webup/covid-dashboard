<template>
  <div>
    <div
      v-show="popupHeader"
      class="popupFrame"
    >
      <div class="popupContent">
        <label for="popupPersonInside">Personne à l'interieur :</label>
        <input
          id="popupPersonInside"
          v-model="personInside"
          type="number"
          min="1"
        >
        <label for="popupLevel1">Niveau 1 max (taux d'incidence) :</label>
        <input
          id="popupLevel1"
          v-model="plagePerLevel[0]"
          type="number"
          min="1"
        >
        <label for="popupLevel2">Niveau 2 max :</label>
        <input
          id="popupLevel2"
          v-model="plagePerLevel[1]"
          type="number"
          min="1"
        >
        <label for="popupLevel3">Niveau 3 max :</label>
        <input
          id="popupLevel3"
          v-model="plagePerLevel[2]"
          type="number"
          min="1"
        >
      </div>
      <div class="popupButton">
        <div
          class="popupCancel"
          @click="popupHeader = false; popup = false"
        >
          Annuler
        </div>
        <div
          class="popupValid"
          @click="updateDB('mainInfos', { personInside: personInside, incidencePlageForEachLevel: plagePerLevel }); popupHeader = false; popup = false;setCasesAndRisk()"
        >
          Confirmer
        </div>
      </div>
    </div>
    <div
      v-show="popupCautions.state"
      v-if="popupCautions.id != null"
      class="popupFrame"
    >
      <div
        class="popupContent"
        :style="popupCautionsStyle"
      >
        <label for="popupMinLevelRequired">Niveau minimum requis :</label>
        <input
          id="popupMinLevelRequired"
          v-model="cautions[popupCautions.id].levelRequired"
          type="number"
          min="1"
          max="4"
        >
      </div>
      <div class="popupButton">
        <div
          class="popupCancel"
          @click="popupCautions.state = false; popup = false"
        >
          Annuler
        </div>
        <div
          class="popupValid"
          @click="updateDB('cautions', { data: cautions }); popupCautions.state = false; popup = false"
        >
          Confirmer
        </div>
      </div>
    </div>
    <div
      v-if="popupUsefulls.state"
      class="popupFrame"
    >
      <div
        class="popupContent popupContent_textarea"
      >
        <label for="popupUsefullsDesc">Texte :</label>
        <textarea
          id="popupUsefullsDesc"
          v-model="usefulls[popupUsefulls.id].desc"
        />
        <label for="popupUsefullsLink">URL :</label>
        <input
          id="popupUsefullsLink"
          v-model="usefulls[popupUsefulls.id].link"
          type="text"
        >
      </div>
      <div class="popupButton">
        <div
          class="popupCancel"
          @click="popupUsefulls.state = false; popup = false"
        >
          Annuler
        </div>
        <div
          class="popupValid"
          @click="updateDB('usefulls', { data: usefulls }); popupUsefulls.state = false; popup = false"
        >
          Confirmer
        </div>
      </div>
    </div>
    <div
      v-if="popupAddUsefull.state"
      class="popupFrame"
    >
      <div
        class="popupContent popupContent_textarea"
      >
        <label for="popupAddUsefullsDesc">Texte :</label>
        <textarea
          id="popupAddUsefullsDesc"
          v-model="popupAddUsefull.desc"
          placeholder="lorem ipsum dolor..."
        />
        <label for="popupAddUsefullsLink">URL :</label>
        <input
          id="popupAddUsefullsLink"
          v-model="popupAddUsefull.link"
          type="text"
          placeholder="https://www.exemple.com"
        >
      </div>
      <div class="popupButton">
        <div
          class="popupCancel"
          @click="popupAddUsefull.state = false; popup = false"
        >
          Annuler
        </div>
        <div
          class="popupValid"
          @click="addNewItem('usefulls'); popupAddUsefull.state = false; popup = false"
        >
          Confirmer
        </div>
      </div>
    </div>
    <div
      v-if="popupAddCaution.state"
      class="popupFrame"
    >
      <div
        class="popupContent popupContent_textarea"
      >
        <label for="popupAddCautionDesc">Texte :</label>
        <textarea
          id="popupAddCautionDesc"
          v-model="popupAddCaution.desc"
          placeholder="lorem ipsum dolor..."
        />
        <label for="popupAddCautionLink">Niveau minimum requis :</label>
        <input
          id="popupAddCautionLink"
          v-model="popupAddCaution.levelRequired"
          type="number"
          placeholder="1"
        >
        <div class="simpleFlex radioCenter">
          <Radio
            :data="'Clients'"
            @click="popupAddCaution.icon = 'Clients'"
          />
          <Radio
            :data="'Contact'"
            @click="popupAddCaution.icon = 'Contact'"
          />
          <Radio
            :data="'Cuisine'"
            @click="popupAddCaution.icon = 'Cuisine'"
          />
          <Radio
            :data="'Discord'"
            @click="popupAddCaution.icon = 'Discord'"
          />
          <Radio
            :data="'Fenetres'"
            @click="popupAddCaution.icon = 'Fenetres'"
          />
          <Radio
            :data="'FermetureSalon'"
            @click="popupAddCaution.icon = 'FermetureSalon'"
          />
          <Radio
            :data="'Fete'"
            @click="popupAddCaution.icon = 'Fete'"
          />
          <Radio
            :data="'Mains'"
            @click="popupAddCaution.icon = 'Mains'"
          />
          <Radio
            :data="'Masque'"
            @click="popupAddCaution.icon = 'Masque'"
          />
          <Radio
            :data="'Reunion'"
            @click="popupAddCaution.icon = 'Reunion'"
          />
          <Radio
            :data="'Salon'"
            @click="popupAddCaution.icon = 'Salon'"
          />
          <Radio
            :data="'Teletravail'"
            @click="popupAddCaution.icon = 'Teletravail'"
          />
        </div>
      </div>
      <div class="popupButton">
        <div
          class="popupCancel"
          @click="popupAddCaution.state = false; popup = false"
        >
          Annuler
        </div>
        <div
          class="popupValid"
          @click="addNewItem('cautions'); popupAddCaution.state = false; popup = false"
        >
          Confirmer
        </div>
      </div>
    </div>
  </div>
  <div
    class="home"
    :style="makeHomeBlur"
  >
    <header @click="popupHeader = true; popup = true">
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
    <h2>Précautions à observer</h2>
    <div
      v-for="(caution, i) in cautions"
      :key="i"
      class="simpleFlex"
    >
      <span
        class="removeButton"
        @click="removeItem(i, cautions, 'cautions')"
      >
        x
      </span>
      <Caution
        :class="{ invisibleItem: caution.levelRequired > level }"
        :icon="caution.icon"
        :desc="caution.desc"
        @click="setupCautionPopup(i); popup = true"
      />
    </div>
    <Caution
      id="addCaution"
      :icon="''"
      :desc="'+ Ajouter une nouvelle Précautions à observer'"
      @click="setupNewItem('cautions'); popup = true"
    />
    <h2 id="dropDownTitle">
      Liens utiles
    </h2>
    <div
      v-for="(usefull, i) in usefulls"
      :key="i"
      class="simpleFlex"
    >
      <span
        class="removeButton"
        @click="removeItem(i, usefulls, 'usefulls')"
      >
        x
      </span>
      <AdminUsefull
        v-show="usefullsSpoiler"
        :desc="usefull.desc"
        :link="usefull.link"
        class="adminUsefulls"
        @click="setupUsefullsPopup(i); popup = true"
      />
    </div>
    <AdminUsefull
      id="addUsefull"
      :desc="'+ Ajouter un nouveau Liens utiles'"
      :link="''"
      @click="setupNewItem('usefulls'); popup = true"
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
import AdminUsefull from '@/components/AdminUsefull.vue'
import Radio from '@/components/Radio.vue'
import axios from 'axios'

export default {
  name: 'Admin',
  components: {
    Caution,
    AdminUsefull,
    Radio
  },
  data () {
    return {
      fullData: null,
      level: 1,
      cautions: [],
      usefulls: [],
      covid: {},
      cases: '...',
      risk: '...',
      usefullsSpoiler: true,
      warningDisplay: false,
      personInside: 0,
      plagePerLevel: [0, 0, 0],
      popup: false,
      popupHeader: false,
      popupAddUsefull: {
        state: false,
        desc: null,
        link: null
      },
      popupAddCaution: {
        state: false,
        desc: null,
        levelRequired: null,
        icon: null
      },
      popupCautions: {
        state: false,
        id: null
      },
      popupUsefulls: {
        state: false,
        id: null
      }
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
    },
    makeHomeBlur () {
      if (this.popup === true) {
        return 'filter: blur(5px)'
      }
      return ''
    },
    popupCautionsStyle () {
      return "background-image: url('" + this.cautions[this.popupCautions.id].icon + "');background-repeat: no-repeat;background-position: 25px 25px;"
    }
  },
  mounted () {
    this.jsonGet()
    this.getCovidApi()
  },
  methods: {
    addNewItem (target) {
      if (target === 'usefulls') {
        this.fullData.usefulls.data.push({ desc: this.popupAddUsefull.desc, link: this.popupAddUsefull.link })
        axios.get('/jsonEditer.php?data=' + JSON.stringify(this.fullData))
          .catch(function (e) {
            console.log(e.response)
          })
      } else if (target === 'cautions') {
        this.fullData.cautions.data.push({ desc: this.popupAddCaution.desc, levelRequired: this.popupAddCaution.levelRequired, icon: './assets/Precautions/Icones/' + this.popupAddCaution.icon + '.svg' })
        axios.get('/jsonEditer.php?data=' + JSON.stringify(this.fullData))
          .catch(function (e) {
            console.log(e.response)
          })
      }
    },
    removeItem (id, data, target) {
      console.log(id)
      console.log(data)
      console.log(target)
      if (target === 'cautions') {
        data.splice(id, 1)
        this.fullData.cautions = { data: data }
      } else if (target === 'usefulls') {
        data.splice(id, 1)
        this.fullData.usefulls = { data: data }
      }
      axios.get('/jsonEditer.php?data=' + JSON.stringify(this.fullData))
        .catch(function (e) {
          console.log(e.response)
        })
    },
    updateDB (target, data) {
      if (target === 'mainInfos') {
        this.fullData.mainInfos = data
      } else if (target === 'cautions') {
        this.fullData.cautions = data
      } else if (target === 'usefulls') {
        this.fullData.usefulls = data
      }
      axios.get('/jsonEditer.php?data=' + JSON.stringify(this.fullData))
        .catch(function (e) {
          console.log(e)
        })
    },
    setupCautionPopup (i) {
      this.popupCautions.id = i
      this.popupCautions.state = true
    },
    setupUsefullsPopup (i) {
      this.popupUsefulls.id = i
      this.popupUsefulls.state = true
    },
    setupNewItem (target) {
      if (target === 'cautions') {
        this.popupAddCaution.state = true
      } else if (target === 'usefulls') {
        this.popupAddUsefull.state = true
      }
    },
    jsonGet () {
      // GET CAUTIONS (icon + desc)
      // GET USEFULLS (desc + link)
      axios.get('/db.json', {
      }).then(response => {
        this.fullData = response.data
        this.cautions = response.data.cautions.data
        this.usefulls = response.data.usefulls.data
      }).catch(e => {
        console.log(e)
      })
    },
    getCovidApi () {
      // COVID STATS FOR "Aube"
      // GET DATE -7 days
      var date = new Date()
      date.setDate(date.getDate() - 7)
      const formatDate = (date) => {
        const formattedDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
        return formattedDate
      }
      const lastWeek = formatDate(date)
      axios.get('/quarry.php?link=' + 'https://coronavirusapifr.herokuapp.com/data/departements-by-date/' + lastWeek, {
        headers: { 'Access-Control-Allow-Origin': '*', crossDomain: true }
      }).then(response => {
        if (response.data.toString().startsWith('<?php')) {
          axios.get('/db.json', {
          }).then(response => {
            this.covid = response.data.covid[0]
            this.setCasesAndRisk()
            this.warningDisplay = true
          }).catch(e => {
            console.log(e)
          })
        } else {
          this.covid = response.data[9]
          this.setCasesAndRisk()
        }
      }).catch(e => {
        console.log(e)
        axios.get('/db.json', {
        }).then(response => {
          this.covid = response.data.covid[0]
          this.setCasesAndRisk()
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
      axios.get('/db.json', {
      }).then(response => {
        this.personInside = response.data.mainInfos.personInside
        // i = cases & N = peoples
        const i = ((v1 * 100000) / v2) * 2
        const N = this.personInside
        const mult = (1 - i / 100000) ** N
        const riskCalc = Math.round((1 - mult) * 1000) / 10
        this.risk = riskCalc + '%'
        // SET LEVEL
        this.plagePerLevel = response.data.mainInfos.incidencePlageForEachLevel
        if (casesCalc < this.plagePerLevel[0]) {
          this.level = 1
        } else if (casesCalc >= this.plagePerLevel[0] && casesCalc < this.plagePerLevel[1]) {
          this.level = 2
        } else if (casesCalc >= this.plagePerLevel[1] && casesCalc < this.plagePerLevel[2]) {
          this.level = 3
        } else if (casesCalc >= this.plagePerLevel[2]) {
          this.level = 4
        }
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .caution {
    &:hover {
      box-shadow: gold 0 0 0 3px;
      opacity: 1;
      cursor: pointer;
      border-radius: 5px;
    }
  }
  textarea {
    padding: 10px 20px;
    min-height: 100px;
  }
  header:hover {
    box-shadow: gold 0 0 0 3px;
    cursor: pointer;
  }
  .popupFrame {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .popupContent {
      background-color: white;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      padding: 50px 100px 75px 100px;
      box-shadow: 0 6px 12px -5px #00000035;
      &_textarea {
        padding: 50px 20px 50px 20px;
        width: 80%;
      }
      label {
        margin-top: 25px
      }
      input {
        padding: 5px 10px;
        border: none;
        border-bottom: solid 1px #333;
        text-align: center;
        color: #FA5252;
        font-weight: bold;
        font-size: 1em;
      }
    }
    .popupButton {
      display: flex;
      justify-content: space-around;
      margin-top: 25px;
      .popupCancel {
        background-color: #FA5252;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        margin-right: 25px;
        width: 100px;
        box-shadow: 0 6px 12px 3px #00000035;
        cursor: pointer;
      }
      .popupValid {
        background-color: limegreen;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        width: 100px;
        box-shadow: 0 6px 12px 3px #00000035;
        cursor: pointer;
      }
      div:hover {
        box-shadow: 0 0 0 1px black,
        0 6px 12px 3px #00000035;
      }
    }
  }
  .invisibleItem {
    opacity: .35;
  }
</style>

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
    z-index: 10;
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
  .simpleFlex {
    display: flex;
  }
  #popupAddCautionLink {
    margin: auto;
    border: none;
    border-bottom: solid 1px #333;
  }
  .radioCenter {
    justify-content: center;
    align-items: center;
    margin-top: 25px;
    flex-wrap: wrap;
  }
  .adminUsefulls {
    flex: 100%;
  }
  .removeButton {
    position: absolute;
    transform: translateX(-15px) translateY(5px);
    background-color: #FA5252;
    color: white;
    padding: 5px 11px 6px 11px;
    border-radius: 5px;
    z-index: 1;
  }
  // PC
  @media screen and (min-width: 800px) {
    .removeButton {
      position: absolute;
      transform: translateX(-50px) translateY(25px);
      background-color: #FA5252;
      color: white;
      padding: 5px 11px 6px 11px;
      border-radius: 5px;
      &:hover {
        background-color: #b63939;
        cursor: pointer;
      }
    }
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
