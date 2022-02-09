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
        <label for="popupLevel3">Niveau actuel :</label>
        <select
          id="popupLevel3"
          v-model="level"
        >
          <option value="1">
            1
          </option>
          <option value="2">
            2
          </option>
          <option value="3">
            3
          </option>
          <option value="4">
            4
          </option>
        </select>
      </div>
      <div class="popupButton">
        <div
          class="popupCancel"
          @click="level = fullData.mainInfos.level;personInside = fullData.mainInfos.personInside;popupHeader = false; popup = false"
        >
          Annuler
        </div>
        <div
          class="popupValid"
          @click="fullData.mainInfos.level = parseInt(level);fullData.mainInfos.personInside = personInside;updateJSON(); popupHeader = false; popup = false;setCasesAndRisk()"
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
        <span>
          Conditions d'affichage :<br>
          lvl.1 => 1 & 1 uniquement<br>
          lvl.2 => 2<br>
          lvl.3 => 3 & 1<br>
          lvl.4 => 4<br>
        </span>
        <label for="popupMinLevelRequired">Niveau minimum requis :</label>
        <select
          id="popupMinLevelRequired"
          v-model="cautions[popupCautions.id].levelRequired"
        >
          <option
            :disabled="cautions[popupCautions.id].levelRequired === 0"
            value="0"
          >
            1 uniquement
          </option>
          <option
            :disabled="cautions[popupCautions.id].levelRequired === 1"
            value="1"
          >
            1
          </option>
          <option
            :disabled="cautions[popupCautions.id].levelRequired === 2"
            value="2"
          >
            2
          </option>
          <option
            :disabled="cautions[popupCautions.id].levelRequired === 3"
            value="3"
          >
            3
          </option>
          <option
            :disabled="cautions[popupCautions.id].levelRequired === 4"
            value="4"
          >
            4
          </option>
        </select>
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
          @click="updateJSON(); popupCautions.state = false; popup = false"
        >
          Confirmer
        </div>
      </div>
    </div>
    <div
      v-if="popupPassword.state"
      class="popupFrame"
    >
      <div
        class="popupContent"
      >
        <label for="popupPassword">{{ popupPassword.text }}</label>
        <input
          id="popupMinLevelRequired"
          v-model="password"
          type="password"
          @keydown.enter="checkPassword()"
        >
      </div>
      <div class="popupButton">
        <div
          class="popupCancel"
          @click="$router.push('/')"
        >
          Annuler
        </div>
        <div
          class="popupValid"
          @click="checkPassword()"
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
          @click="updateJSON(); popupUsefulls.state = false; popup = false"
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
          @click="updateJSON('addNew', { target: 'usefulls' }); popupAddUsefull.state = false; popup = false"
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
        <select
          id="popupAddCautionLink"
          v-model="popupAddCaution.levelRequired"
        >
          <option value="0">
            1 uniquement
          </option>
          <option value="1">
            1
          </option>
          <option value="2">
            2
          </option>
          <option value="3">
            3
          </option>
          <option value="4">
            4
          </option>
        </select>
        <div
          class="simpleFlex radioCenter"
        >
          <Radio
            v-for="(icon, i) in icons"
            :key="i"
            :data="icon"
            @click="popupAddCaution.icon = icon"
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
          @click="updateJSON('addNew', { target: 'cautions' }); popupAddCaution.state = false; popup = false"
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
    <h2>
      Précautions à observer
    </h2>
    <div
      id="sort"
    >
      <div
        v-for="(caution, i) in cautions"
        :id="'caution-' + i"
        :key="i"
        class="simpleFlex"
        :style="'order: ' + caution.order + ';' + dragReady.style"
        :draggable="dragReady.state"
        @dragenter="dragEvent('enter', caution.order, i)"
        @dragleave="dragEvent('leave', caution.order, i)"
        @dragover.prevent
        @dragstart="dragEvent('start', caution.order, i)"
        @dragend="dragEvent('drop')"
      >
        <span
          class="removeButton"
          @click="updateJSON('remove', { key: i, target: 'cautions' })"
        >
          x
        </span>
        <Caution
          :class="{ invisibleItem: !showCaution(parseInt(caution.levelRequired)) }"
          :icon="caution.icon"
          :desc="caution.desc"
          @click="setupCautionPopup(i); popup = true"
        />
      </div>
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
        @click="updateJSON('remove', { key: i, target: 'usefulls' })"
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
    <p>La page Admin n'est pas utilisable en local. Impossible d'obtenir les statistiques. Les chiffres utilisés sont donc des exemples à ne pas prendre en compte.</p>
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
      password: '',
      icons: [
        'Clients', 'Contact', 'Cuisine',
        'Discord', 'Fenetres', 'FermetureSalon',
        'Fete', 'Mains', 'Masque',
        'Reunion', 'Salon', 'Teletravail',
        'Client', 'FermetureCuisine', 'FeteInterdit',
        'Sorties', 'Ventilation'
      ],
      fullData: null,
      functionURL: '/.netlify/functions/',
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
      popup: true,
      popupHeader: false,
      popupAddUsefull: {
        state: false,
        desc: null,
        link: null
      },
      popupAddCaution: {
        state: false,
        desc: null,
        levelRequired: 1,
        icon: null
      },
      popupCautions: {
        state: false,
        id: null
      },
      popupPassword: {
        state: true,
        text: 'Mot de passe :'
      },
      popupUsefulls: {
        state: false,
        id: null
      },
      dropTarget: {
        from: null,
        to: null,
        idFrom: null,
        idTo: null
      },
      dragReady: {
        state: false,
        style: ''
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
    this.fetchAPI()
    this.jsonGet()
  },
  methods: {
    dragEvent (action, order, i) {
      if (action === 'enter') {
        this.dropTarget.to = order
        this.dropTarget.idTo = i
        document.getElementById('caution-' + i).style.backgroundColor = '#32cd3215'
      } else if (action === 'start') {
        this.dropTarget.from = order
        this.dropTarget.idFrom = i
        document.getElementById('caution-' + this.dropTarget.idFrom).style.opacity = '.15'
      } else if (action === 'leave') {
        document.getElementById('caution-' + i).style.backgroundColor = 'unset'
      } else if (action === 'drop') {
        document.getElementById('caution-' + this.dropTarget.idFrom).style.opacity = 'unset'
        if (this.dropTarget.from !== this.dropTarget.to) {
          // this.dropTarget.to--
          // this.dropTarget.idTo--
          if (this.cautions[this.dropTarget.idFrom].order < this.cautions[this.dropTarget.idTo].order) {
            for (let i = 0; i < this.cautions.length; i++) {
              if (this.cautions[i].order > this.cautions[this.dropTarget.idFrom].order && this.cautions[i].order <= this.cautions[this.dropTarget.idTo].order) {
                // console.log(this.cautions[i].order + ' -> ' + (this.cautions[i].order - 1))
                this.cautions[i].order--
              }
            }
            // console.log(this.cautions[this.dropTarget.idFrom].order + ' -> ' + this.dropTarget.to)
            this.cautions[this.dropTarget.idFrom].order = this.dropTarget.to
          } else if (this.cautions[this.dropTarget.idFrom].order > this.cautions[this.dropTarget.idTo].order) {
            for (let i = 0; i < this.cautions.length; i++) {
              if (this.cautions[i].order < this.cautions[this.dropTarget.idFrom].order && this.cautions[i].order >= this.cautions[this.dropTarget.idTo].order) {
                // console.log(this.cautions[i].order + ' -> ' + (this.cautions[i].order + 1))
                this.cautions[i].order++
              }
            }
            // console.log(this.cautions[this.dropTarget.idFrom].order + ' -> ' + this.dropTarget.to)
            this.cautions[this.dropTarget.idFrom].order = this.dropTarget.to
          }
          this.dropTarget.from = null
          this.dropTarget.to = null
          // console.log('-----------------')
          this.dragReady.state = false
          this.dragReady.style = 'background-color: #DC143C10'
          this.updateJSON()
        }
      }
    },
    log (str) {
      console.log(str)
    },
    // updateJSON('remove', { key: i, target: 'cautions' })
    updateJSON (action, data) {
      if (action === 'remove') {
        if (data.target === 'cautions') {
          this.popupCautions.id = null
          this.fullData.cautions.data.splice([data.key], 1)
        } else if (data.target === 'usefulls') {
          this.fullData.usefulls.data.splice([data.key], 1)
        }
      } else if (action === 'addNew') {
        if (data.target === 'cautions') {
          this.fullData.cautions.data.push({ order: this.fullData.cautions.data.length, desc: this.popupAddCaution.desc, levelRequired: parseInt(this.popupAddCaution.levelRequired), icon: './assets/Precautions/Icones/' + this.popupAddCaution.icon + '.svg' })
        } else if (data.target === 'usefulls') {
          this.fullData.usefulls.data.push({ desc: this.popupAddUsefull.desc, link: this.popupAddUsefull.link })
        }
      }
      for (let i = 0; i < this.fullData.cautions.data.length; i++) {
        this.fullData.cautions.data[i].levelRequired = parseInt(this.fullData.cautions.data[i].levelRequired)
      }

      axios.get(this.functionURL + 'uploadJSON?password=' + this.password + '&newData=' + JSON.stringify(this.fullData), {
      }).then(response => {
        this.jsonGet()
        console.log('s3 Updated')
      }).catch(e => {
        console.log(e)
      })
    },
    setupNewItem (target) {
      this.popupAddUsefull = {
        state: false,
        desc: null,
        link: null
      }
      this.popupAddCaution = {
        state: false,
        desc: null,
        levelRequired: 1,
        icon: null
      }
      if (target === 'cautions') {
        this.popupAddCaution.state = true
      } else if (target === 'usefulls') {
        this.popupAddUsefull.state = true
      }
    },
    setupCautionPopup (i) {
      this.popupCautions.id = i
      this.popupCautions.state = true
    },
    setupUsefullsPopup (i) {
      this.popupUsefulls.id = i
      this.popupUsefulls.state = true
    },
    checkPassword () {
      axios.get(this.functionURL + 'password?password=' + this.password, {
      }).then(response => {
        if (response.data === true) {
          this.popupPassword.state = false
          this.popup = false
        } else if (response.data === false) {
          this.password = ''
          this.popupPassword.text = 'Mot de passe incorrect, essayez à nouveau :'
        }
      }).catch(e => {
        console.log(e)
      })
    },
    showCaution (x) {
      if (this.level === 1 && (x === 0 || x === 1)) {
        return true
      } else if (this.level === 2 && (x === 1 || x === 2)) {
        return true
      } else if (this.level === 3 && (x === 1 || x === 3)) {
        return true
      } else if (this.level === 4 && x === 4) {
        return true
      }
    },
    jsonGet () {
      // GET USEFULLS (desc + link) & CAUTIONS (icon + desc)
      axios.get(this.functionURL + 'getJSON', {
      }).then(response => {
        this.fullData = JSON.parse(response.data.Body)
        this.level = this.fullData.mainInfos.level
        this.cautions = this.fullData.cautions.data
        this.usefulls = this.fullData.usefulls.data
        this.personInside = this.fullData.mainInfos.personInside
        this.cautions.sort(function (a, b) {
          return a.order - b.order
        })
        for (let i = 0; i < this.cautions.length; i++) {
          if (typeof this.cautions[i + 1] !== 'undefined') {
            if (this.cautions[i].order < (this.cautions[i + 1].order - 1)) {
              while (this.cautions[i].order < (this.cautions[i + 1].order - 1)) {
                this.cautions[i + 1].order--
              }
            } else if (this.cautions[i].order === (this.cautions[i + 1].order)) {
              while (this.cautions[i].order < (this.cautions[i + 1].order - 1)) {
                this.cautions[i + 1].order++
              }
            }
          }
        }
        this.dragReady.state = true
        this.dragReady.style = ''
      }).catch(e => {
        console.log(e)
      })
    },
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

      const v1 = this.covid.pos_7j // corrected: *2
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
      // SET FAVICON
      if (this.level === 1) {
        document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/1.svg'
      } else if (this.level === 2) {
        document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/2.svg'
      } else if (this.level === 3) {
        document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/3.svg'
      } else if (this.level === 4) {
        document.querySelector("link[rel*='icon']").href = '/assets/Desktop/Jauge/4.svg'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dragLoading {
    background-color: red;
  }
  #sort {
    display: flex;
    flex-direction: column;
  }
  .caution {
    &:hover {
      border-right: solid 3px orangered;
      opacity: 1;
      cursor: pointer;
    }
  }
  textarea {
    padding: 10px 20px;
    min-height: 100px;
  }
  header:hover {
    box-shadow: 3px 0 0 orangered;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
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
    user-select: none;
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
    transform: translateX(-15px);
    align-self: center;
    height: fit-content;
    background-color: #FA5252;
    color: white;
    padding: 5px 11px 6px 11px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
  }
  // PC
  @media screen and (min-width: 800px) {
    .removeButton {
      transform: translateX(-30px);
      align-self: center;
      height: fit-content;
      background-color: #FA5252;
      color: white;
      padding: 5px 11px 6px 11px;
      border-radius: 5px;
      cursor: pointer;
      user-select: none;
      &:hover {
        background-color: #b63939;
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
