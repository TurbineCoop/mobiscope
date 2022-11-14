<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="h-screen w-full bg-brand-primary pt-14">
    <MapuiOfferui v-if="step == 'view'" @close="step = 'possibilities'" />
    <MapuiPrintPopup
      v-if="nav.printNode"
      @print="print"
      @close="nav.printNode = ''"
    />

    <div
      v-if="step === 'view'"
      class="z-1000 absolute right-0 top-10 bottom-0 mt-14 w-1/3 overflow-y-scroll bg-brand-secondary"
    >
      <MapuiDataListing :layer="section.layer" @select="viewSelected" />
    </div>
    <div
      v-if="['desc', 'placement', ''].includes(step)"
      class="absolute flex w-full justify-center p-4"
    >
      <MapuiAddressSearch
        :nearby="Object.values(Object.values(center))"
        :show-results="showAddressSearchRes"
        @click.stop
        @show="showAddressSearchRes = true"
        @select="initNewPoint"
      />
    </div>

    <MapuiAutonomyPopUp
      v-if="step === 'desc'"
      :location="newPoint.location"
      :point-id="newPoint.id"
      :old-data="newPoint"
      :home="!!home"
      @click.stop
      @send="send"
      @close="closePopups"
    />

    <MapuiPointSummary
      v-if="selectedPointId && !step"
      :point="getPointData(selectedPointId)"
      :home="home ? home : {}"
      @click.stop
      @send="send"
      @close="selectedPointId = ''"
      @edit="edit"
      @remove="remove"
      @selectHome="getHome"
    />
    <div>
      <div
        v-if="!nav.printNode"
        class="z-900 absolute top-20 right-3 rounded bg-brand-secondary p-2 ring-2 ring-gray-light"
        @mouseover="layers.popup = true"
      >
        <img class="w-8" src="@/components/assets/Layer.png" />
      </div>
    </div>

    <div
      v-if="layers.popup"
      class="z-900 absolute top-20 right-3 divide-y divide-n-gray rounded bg-brand-secondary py-3 px-5 ring-2 ring-gray-light"
      @mouseleave="layers.popup = false"
    >
      <div class="flex justify-center py-2">
        <span
          class="ml-3 mt-1 mr-3 text-lg font-medium text-gray-900 dark:text-gray-300"
          >Carte</span
        >
        <label
          for="checked-toggle"
          class="relative inline-flex cursor-pointer items-center"
        >
          <input
            id="checked-toggle"
            v-model="tileIndex"
            type="checkbox"
            class="peer sr-only"
            checked
          />
          <div
            class="peer h-6 w-11 rounded-full bg-brand-primary after:absolute after:top-0.5 after:left-[2px] after:mt-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-primary peer-checked:after:translate-x-full peer-checked:after:border-white"
          ></div>
        </label>
        <span
          class="ml-3 mt-1 text-lg font-medium text-gray-900 dark:text-gray-300"
          >Satellite</span
        >
      </div>
      <div
        v-if="step !== 'view' && jobs.dataAvailable"
        class="flex-inline my-2 mr-4 justify-end"
      >
        <div class="mt-4 flex justify-end gap-2 text-lg">
          <label class="">Offres</label>
          <button
            class="ml-2 mt-2 h-3 w-3 rounded-full ring-1"
            :class="
              layers.offers
                ? 'bg-brand-primary'
                : 'ring-n-gray hover:bg-brand-primary'
            "
            @click="
              researchOrAskSector({ ...jobs.terms, searchType: 'Un emploi' })
            "
          />
        </div>
        <div class="flex justify-end gap-2 text-lg">
          <label class="">SIAE</label>
          <button
            class="ml-2 mt-2 h-3 w-3 rounded-full ring-1"
            :class="
              layers.siaes
                ? 'bg-brand-primary'
                : 'ring-n-gray hover:bg-brand-primary'
            "
            @click="research({ ...jobs.terms, searchType: 'Une SIAE' })"
          />
        </div>

        <div class="flex justify-end gap-2 text-lg">
          <label class="">Entreprises</label>
          <button
            class="ml-2 mt-2 h-3 w-3 rounded-full ring-1"
            :class="
              layers.companies
                ? 'bg-brand-primary'
                : 'ring-n-gray hover:bg-brand-primary'
            "
            @click="
              researchOrAskSector({
                ...jobs.terms,
                searchType: 'Une entreprise active',
              })
            "
          />
        </div>

        <div class="flex justify-end gap-2 text-lg">
          <label class="">Formations</label>
          <button
            class="ml-2 mt-2 h-3 w-3 rounded-full ring-1"
            :class="
              layers.formations
                ? 'bg-brand-primary'
                : 'ring-n-gray hover:bg-brand-primary'
            "
            @click="
              research({
                ...jobs.terms,
                searchType: 'Une formation',
              })
            "
          />
        </div>
      </div>
    </div>

    <div
      v-if="nav.search"
      class="z-1100 absolute top-16 w-full bg-brand-secondary p-6"
    >
      <MapuiResearch
        :initial-max-duration="maxDuration"
        @updateDuration="updateMax"
        @search="research"
        @close="jobClose"
      />
    </div>

    <button
      v-if="home && !nav.printNode"
      class="z-600 absolute left-10 rounded-md bg-brand-primary py-2 px-4 text-xl text-brand-secondary hover:bg-brand-primary-dark"
      :class="
        ['possibilities', 'view'].includes(step) ? 'bottom-28' : 'bottom-10'
      "
      @click="center = home.location"
    >
      Recentrer
    </button>

    <div class="z-600 absolute bottom-10 right-10 flex gap-4">
      <button
        v-if="!step && !nav.printNode"
        class="rounded-full bg-brand-primary py-2 px-4 text-xl text-brand-secondary hover:bg-brand-primary-dark"
        @click="initNewPoint({ latlng: center })"
      >
        Ajouter un point
      </button>
      <button
        v-if="!step && nav.invalidMap && points.length > 1 && home"
        class="rounded-md bg-brand-violet py-2 px-4 text-xl text-brand-secondary hover:bg-brand-violet-dark"
        @click="validateMap"
      >
        Valider ma carte
      </button>
    </div>

    <button
      v-if="step === 'placement'"
      class="z-600 absolute bottom-10 right-10 rounded-md bg-brand-primary py-2 px-4 text-xl text-brand-secondary hover:bg-brand-primary-dark"
      @click="startDesc"
    >
      Valider la position
    </button>

    <div v-if="section.layer">
      <button
        v-if="
          jobs[section.layer].length &&
          step === 'possibilities' &&
          !jobs.selected &&
          !nav.printNode
        "
        class="z-600 absolute bottom-10 right-6 rounded-md bg-brand-primary py-2 px-4 text-xl text-brand-secondary hover:bg-brand-primary-dark"
        :class="layers.popup ? '' : ''"
        @click="step = 'view'"
      >
        VOIR LES {{ jobs[section.layer].length }} {{ section.btn }}
      </button>
    </div>

    <div class="z-600 absolute top-60 flex w-full justify-center">
      <MapuiErrorPopup
        v-if="error && leafletReady"
        :error="error"
        :msg="errorMsg"
        @search="research(jobs.terms)"
        @close=";(error = ''), (errorMsg = '')"
      />
    </div>

    <MapuiTransportLayers
      v-if="['possibilities', 'view'].includes(step) && !nav.printNode"
      @toggleIso="toggleIso"
    />

    <l-map
      id="mapToPrint"
      ref="map"
      v-model:zoom="zoom"
      v-model:center="center"
      @click="handleMapClick"
    >
      <l-tile-layer :url="tile.url" :name="tile.name" layer-type="base" />

      <div
        v-if="step === 'possibilities' && !nav.printNode"
        class="z-1000 absolute top-4 left-14 cursor-pointer rounded bg-brand-primary p-3 hover:bg-brand-primary-dark"
        @click="backToEdition()"
      >
        <Return />
      </div>

      <l-marker
        v-if="['desc', 'placement'].includes(step)"
        v-model:lat-lng="newPoint.location"
        class="no-anim"
        :draggable="step === 'placement'"
        :icon="getPointIcon(newPoint)"
      />

      <div v-if="layers.points">
        <l-marker
          v-for="point in points"
          :key="'interest_' + point.id"
          :lat-lng="point.location"
          class="text-brand-primary"
          :icon="getPointIcon(point)"
          @click="focusOnPoint(point)"
        />
        <l-polyline
          v-for="line in pointLines"
          :key="line"
          :weight="60"
          :lat-lngs="line.pos"
          :color="line.zoneColor"
          :no-clip="true"
        />
      </div>

      <div v-if="jobs.selected?.lines?.length">
        <l-polyline
          v-for="line in jobs.selected.lines"
          :key="line"
          :lat-lngs="line.pos"
          :color="line.color"
        />
        <div v-for="line in jobs.selected.lines" :key="line">
          <div v-if="line.iconUrl">
            <l-marker :lat-lng="line.iconPos">
              <l-icon
                :icon-anchor="line.anchor"
                class-name="p-2 bg-brand-secondary ring-2 ring-n-gray rounded-xl"
              >
                <img class="mx-auto" :src="line.iconUrl" />
                <p class="flex">{{ line.duration }}</p>
              </l-icon>
            </l-marker>
          </div>
        </div>
      </div>

      <l-polygon
        v-if="isochronous[jobs.isoToDisplay]"
        fill
        :stroke="false"
        :fill-color="'#4ADEBA'"
        :lat-lngs="isochronous[jobs.isoToDisplay]"
        :fill-opacity="0.6"
        :noclip="true"
      />

      <div v-if="layers.offers">
        <l-marker
          v-for="(offer, i) in jobs.offers"
          :key="'offer_' + offer.id"
          class="text-brand-primary"
          :lat-lng="[offer.lieuTravail.latitude, offer.lieuTravail.longitude]"
          :icon="getOfferIcon(offer.isAccessible)"
          @click="viewSelected(offer, i)"
        />
        <l-polyline
          v-for="line in offersLines"
          :key="line"
          :lat-lngs="line.pos"
          :color="line.color"
        />
      </div>

      <div v-if="layers.siaes">
        <l-marker
          v-for="(siae, i) in jobs.siaes"
          :key="'siae_' + siae.raison_sociale.replaceAll(' ', '')"
          class="text-brand-primary"
          :lat-lng="[siae.lieuTravail.latitude, siae.lieuTravail.longitude]"
          :icon="getOfferIcon(siae.isAccessible)"
          @click="viewSelected(siae, i)"
        />
      </div>

      <div v-if="layers.companies">
        <l-marker
          v-for="(company, i) in jobs.companies"
          :key="'company_' + i"
          class="text-brand-primary"
          :lat-lng="company.location"
          :icon="getOfferIcon(company.isAccessible)"
          @click="viewSelected(company, i)"
        />
      </div>

      <div v-if="layers.formations">
        <l-marker
          v-for="(formation, i) in jobs.formations"
          :key="'formation' + i"
          class="text-brand-primary"
          :lat-lng="formation.location"
          :icon="getOfferIcon(formation.isAccessible)"
          @click="viewSelected(formation, i)"
        />
      </div>

      <div
        class="z-600 absolute w-full p-4"
        :class="['desc', 'placement', ''].includes(step) ? 'top-14' : ''"
      >
        <div
          v-if="!nav.invalidMap && !nav.printNode && !nav.loading"
          class="m-auto w-1/3"
        >
          <div class="w-full">
            <label class="relative">
              <p
                v-if="step === 'possibilities'"
                class="flex w-full justify-center rounded-xl bg-gray-lighter px-4 py-3 text-xl font-light italic"
              >
                Temps de trajet maximum :
                <span class="px-2 font-bold">{{ maxDurationText() }}</span>
              </p>
              <p
                v-if="!['possibilities', 'view'].includes(step)"
                class="flex w-full justify-center rounded-xl bg-gray-lighter px-4 py-3 text-xl font-light italic"
              >
                Vous faites jusqu’à
                <span class="px-2 font-bold">{{ maxDurationText() }}</span> de
                trajet depuis chez vous !
              </p>
            </label>
          </div>
        </div>
      </div>
    </l-map>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPolygon,
  LPolyline,
} from '@vue-leaflet/vue-leaflet'
import { icon } from 'leaflet/dist/leaflet-src.esm'
// import vClickOutside from 'click-outside-vue3'
import domtoimage from 'dom-to-image'
import Return from '../components/assets/Return.svg'
import { usePointStore } from '@/stores/Points'
import { useNavigationStore } from '@/stores/Navigation'
import { useJobsStore } from '@/stores/Jobs'
import { useUserStore } from '@/stores/User'
import { useBenefStore } from '@/stores/Benef'

const parseDuration = (duration) => {
  const pattern =
    /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/
  return pattern.exec(duration)
}
const durationToMinutes = (duration) => {
  const part = parseDuration(duration)
  const seconds =
    (((part[1] === undefined ? 0 : part[1] * 1) * 24 +
      (part[2] === undefined ? 0 : part[2] * 1)) *
      60 +
      (part[3] === undefined ? 0 : part[3] * 1)) *
      60 +
    (part[4] === undefined ? 0 : part[4] * 1)

  return Math.floor(seconds / 60)
}

const durationToText = (duration) => {
  if (!duration) return `unknown duration`
  const part = parseDuration(duration)
  return `${part[2] ? part[2] + ' heure(s) ' : ''}${
    part[3] ? part[3] + ' minute(s)' : ''
  }`
}

const scoreDuration = (duration) => {
  const part = parseDuration(duration)
  let score = ''
  for (let i = 1; i < 4; i++) {
    if (part[i]) score += part[i].padStart(2, '0')
  }
  return parseInt(score)
}

const findMiddle = (links) => {
  const av1 = Math.ceil(Math.floor(links.length / 2))
  const av2 = Math.ceil(Math.floor(links[av1].length / 2))
  return links[av1][av2]
}

const getEmptyLayers = (OffersDefault) => {
  return {
    popup: false,
    siaes: false,
    points: true,
    offers: OffersDefault || false,
    companies: false,
    satellite: false,
  }
}

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPolygon,
    LPolyline,
    Return,
  },
  /*   directives: {
    clickOutside: vClickOutside.directive,
  }, */
  data() {
    return {
      jobs: useJobsStore(),
      nav: useNavigationStore(),
      user: useUserStore(),
      benef: useBenefStore(),
      pointsStore: usePointStore(),
      zoom: 12,
      center: [45.18318629369083, 5.731258392333984],
      home: false,
      tileIndex: 0,
      showAddressSearchRes: true,
      isochronous: {
        transports: false,
        pedestrian: false,
        carOrBike: false,
        carpooling: false,
        bicycle: false,
        elecBicycle: false,
        scooter: false,
      },
      pointLines: [],
      offersLines: [],
      step: '',
      error: '',
      errorMsg: '',
      leafletReady: false,
      layers: getEmptyLayers(true),

      newPoint: {},
      selectedPointId: false,
      maxDuration: 'PT1M0S',
      section: {},
    }
  },

  computed: {
    points() {
      return this.benef.points
    },
    tile() {
      return [
        {
          url: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
          name: `Carte`,
        },
        {
          url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
          name: `Satellite`,
        },
      ][+this.tileIndex]
    },
  },
  async mounted() {
    this.resetError()
    if (!this.nav.loading) this.nav.loading = 'full'
    try {
      useBenefStore().setBenef(
        useUserStore().beneficiaries.find((b) => b.id === this.benef.id)
      )
      await this.pointsStore.loadPoints(this.benef.id)
    } catch (e) {
      await navigateTo('/user/login', { replace: true })
    }

    try {
      this.resetError()
      if (this.$refs.map.leafletObject._size?.x === 0) window.location.reload()
      else this.leafletReady = true

      this.resetError()
      await this.getHome(false)
      if (this.home) {
        this.center = this.home.location
        this.zoom = 14
      }

      this.resetError()
      useNavigationStore().updatePage({ title: 'Mes déplacements familiers' })
      if (this.points.length >= 2 && this.home) this.validateMap()
      this.resetError()
    } catch (e) {
      console.error(e)
      this.error = 'CATCHED'
      this.errorMsg = e
      this.nav.loading = false
    }
  },
  methods: {
    resetError() {
      this.error = ''
      this.errorMsg = ''
    },
    async getHome(pointId) {
      let pointToStore = false
      if (pointId && this.nav.loading !== 'full') this.nav.loading = 'partial'
      if (!pointId) {
        this.points.forEach((p) => {
          if (p.tag === 'Domicile') pointToStore = p
        })
      } else {
        this.points.forEach((p) => {
          if (p.id === pointId) pointToStore = p
        })
      }
      this.home = pointToStore
      await this.getTraces()
      this.refreshMap()
      if (pointId) {
        this.loadPointsLines()
        if (this.nav.loading === 'partial') this.nav.loading = false
      }
    },
    getMax() {
      this.jobs.distance = 5
      this.maxDuration = 'PT1M0S'
      this.points.forEach((p) => {
        if (p.id !== this.home.id) {
          Object.values(p.traces).forEach((trace) => {
            if (scoreDuration(trace.duration) > scoreDuration(this.maxDuration))
              this.maxDuration = trace.duration

            const traceDistance = Math.ceil(trace.distance / 1000)
            if (traceDistance > this.jobs.distance)
              this.jobs.distance = traceDistance
          })
        }
      })
    },
    updateMax(newDuration) {
      this.maxDuration = newDuration
    },
    maxDurationText() {
      return durationToText(this.maxDuration)
    },
    print() {
      const node = document.getElementById(this.nav.printNode)
      domtoimage.toPng(node).then(function (dataUrl) {
        const img = new Image()
        img.src = dataUrl
        const fileLink = document.createElement('a')

        fileLink.href = dataUrl
        fileLink.setAttribute('download', 'Mobiscope_map.png')

        fileLink.click()
      })
    },
    validateMap() {
      this.getMax()
      this.loadPointsLines()
      this.nav.invalidMap = false
    },
    backToEdition() {
      this.jobs.isoToDisplay = ''
      this.step = ''
      this.jobs.resetData()
      this.nav.updatePage({ title: 'Mes déplacements familiers' })
      this.validateMap()
    },
    getPointData(id) {
      return this.points.find((p) => p.id === id)
    },
    focusOnClick(event) {
      this.focusOnPoint(Object.values(event.latlng))
    },
    initNewPoint(event) {
      this.step = 'placement'
      this.newPoint = {
        location: Object.values(event.latlng),
        goAlone: true,
        id: -1,
      }

      this.selectedPointId = -1

      this.focusOnPoint(this.newPoint)
    },
    loadPointsLines() {
      const pointLines = []

      this.points.forEach((p) => {
        if (p.id !== this.home.id) {
          const path = Object.values(p.traces)[0].pathLines
          pointLines.push({
            pos: path,
            zoneColor: p.goAlone ? '#EFD02E80' : '#DBA5D980',
          })
        }
      })
      this.pointLines = pointLines
    },
    drawLine() {
      this.jobs.selected.lines = []
      const trace = this.jobs.selected.traces[this.jobs.isoToDisplay]
      trace.steps.forEach((step) => {
        this.jobs.selected.lines.push({
          pos: step.links,
          color: step.type === 'WALK' ? '#3DB094' : '#878080',
          anchor: 43,
          iconUrl:
            step.type === 'WALK' && trace.type !== 'pedestrian'
              ? false
              : `/assets/vehiclesBlack/${trace.type}.png`,
          iconPos: findMiddle(step.links),
          duration: durationToText(step.duration || step.Duration),
        })
      })
    },
    handleMapClick(event) {
      this.showAddressSearchRes = false
      if (
        event.latlng &&
        !['placement', 'desc'].includes(this.step) &&
        !this.jobs.dataAvailable
      )
        this.closePopups()
    },
    focusOnPoint(point) {
      if (Array.isArray(point)) {
        this.center = point
        return 0
      }
      this.center = point.location
      this.selectedPointId = point.id
    },
    viewSelected(point) {
      this.center = point.location || [
        point.lieuTravail.latitude,
        point.lieuTravail.longitude,
      ]

      this.jobs.selected = point
      this.step = 'view'

      this.drawLine()
    },
    startDesc() {
      this.focusOnPoint(this.newPoint)
      this.step = 'desc'
    },
    edit() {
      this.step = 'desc'
      this.newPoint = this.getPointData(this.selectedPointId)
      this.focusOnPoint(this.newPoint)
    },
    closePopups() {
      this.selectedPointId = null
      this.step = ''
    },
    async remove() {
      try {
        this.nav.loading = 'partial'
        await this.pointsStore.removePoint(this.selectedPointId)
        await this.pointsStore.loadPoints(this.benef.id)
        this.getHome(false)
        this.refreshMap()
        if (this.home && this.points.length > 1) {
          this.pointsStore.modifyPoints(
            await this.jobs.getTraces(this.points, this.home, false)
          )
        }
        this.pointLines = []
        this.nav.loading = false
        this.nav.invalidMap = true
      } catch (e) {
        console.error(e)
        this.error = 'CATCHED'
        this.errorMsg = e
        this.nav.loading = false
      }
    },
    refreshMap() {
      this.selectedPointId = 0
      this.zoom -= 1
      this.zoom += 1
    },
    async getTraces() {
      if (this.home && this.points.length > 1) {
        this.pointsStore.modifyPoints(
          await this.jobs.getTraces(this.points, this.home, false)
        )
      }
    },
    async send(point) {
      try {
        this.nav.loading = 'partial'
        this.step = ''
        const cacheId = this.selectedPointId
        this.selectedPointId = 0
        if (!Array.isArray(point.location)) {
          point.location = [point.location.lat, point.location.lng]
        }
        if (this.home) {
          const pointInDep = await this.jobs.isPointInDep(point, this.home)
          if (!pointInDep) {
            this.error = 'POINTSEND'
            this.nav.loading = false
            return
          }
        }

        cacheId === -1
          ? await this.pointsStore.addPoint(point)
          : await this.pointsStore.updatePoint(point)

        await this.pointsStore.loadPoints(this.benef.id)
        await this.getHome()
        this.getTraces()
        this.refreshMap()
        this.selectedPointId = 0
        this.pointLines = []
        this.nav.loading = false
        this.nav.invalidMap = true
      } catch (e) {
        console.error(e)
        this.error = 'CATCHED'
        this.nav.loading = false
      }
    },
    jobClose() {
      this.nav.toggleSearch()
      this.nav.updatePage({ title: 'Mes déplacements familiers' })
      this.nav.invalidMap = false
    },
    async researchOrAskSector(terms) {
      this.jobs.terms = terms
      if (
        !this.jobs.terms.activitySector ||
        !this.jobs.terms.activitySectorName
      )
        this.error = 'NOSECTOR'
      else await this.research(terms)
    },
    async research(terms, reloadIsos) {
      this.resetError()
      if (this.nav.search) this.nav.toggleSearch()
      try {
        this.nav.loading = 'partial'
        if (terms) this.jobs.terms = terms
        if (this.home && terms) {
          terms.inseeCode = await this.jobs.loadInseeCode(this.home.location)
        }
        this.jobs.home = this.home
        let data = []
        const section = {
          'Un emploi': {
            layer: 'offers',
            btn: `OFFRES`,
            ref: this.jobs.loadOffers,
          },
          'Une formation': {
            layer: 'formations',
            btn: `CENTRES DE FORMATIONS`,
            ref: this.jobs.loadFormations,
          },
          'Une SIAE': {
            layer: 'siaes',
            btn: `SIAEs`,
            ref: this.jobs.loadSiaes,
          },
          'Une entreprise active': {
            layer: 'companies',
            btn: `ENTREPRISES`,
            ref: this.jobs.loadCompanies,
          },
        }[this.jobs.terms.searchType]
        data = await section.ref(terms)

        if (data.length) {
          if (this.error === 'SECTOREMPTY') this.resetError()
          this.section = section
          if (reloadIsos)
            await this.loadAutonomyZones(this.jobs.terms.withVehicles)

          data = await this.jobs.processData(data)

          this.selectLayer(section.layer)
          this.jobs[section.layer] = data
          let firstIso = 'pedestrian'
          for (const [k, v] of Object.entries(this.jobs.terms.withVehicles)) {
            if (v) {
              firstIso = k
              break
            }
          }
          this.jobs.updateAvailability(
            section.layer,
            this.isochronous[this.jobs.isoToDisplay || firstIso]
          )
          this.nav.updatePage({ title: 'Consulter mes possibles' })
          this.step = 'possibilities'
          this.nav.invalidMap = false
        } else {
          if (!terms) {
            this.nav.updatePage({ title: 'Mes déplacements familiers' })
            this.step = ''
            this.section = {}
          }

          this.error = 'SECTOREMPTY'
        }

        this.nav.loading = false
      } catch (e) {
        console.error(e)
        this.error = 'CATCHED'
        this.errorMsg = e
        this.nav.loading = false
      }
    },
    async toggleIso(opt) {
      this.nav.loading = 'partial'
      await this.jobs.updateAvailability(
        this.section.layer,
        this.isochronous[opt]
      )
      this.jobs.isoToDisplay = opt
      if (this.jobs.selected) this.drawLine()
      this.nav.loading = false
    },
    setPointsOver() {
      this.layers.points = false
      setTimeout(
        function () {
          this.layers.points = true
        }.bind(this),
        1
      )
    },
    resetLayers(OffersDefault) {
      this.layers = getEmptyLayers(OffersDefault)
    },
    selectLayer(layer) {
      this.layers = getEmptyLayers()
      this.layers[layer] = true
    },
    async loadAutonomyZones(withVehicles) {
      const ptRefs = {
        pedestrian: { Type: 1, WalkSpeed: 5 },
        carOrBike: { Type: 3 },
        transports: { Type: 0, WalkSpeed: 5 },
        carpooling: { Type: 3 },
        bicycle: { Type: 2, BikeSpeed: 15 },
        elecBicycle: { Type: 2, BikeSpeed: 20 },
        scooter: { Type: 2, BikeSpeed: 12 },
      }
      await Promise.all(
        Object.keys(withVehicles).map(async (v) => {
          if (withVehicles[v]) {
            this.isochronous[v] = await this.jobs.loadIsochronous(
              this.home.location,
              {
                ...ptRefs[v],
                MaxDuration: durationToMinutes(this.maxDuration),
              }
            )
          }

          return v
        })
      )
      for (const [key, value] of Object.entries(withVehicles)) {
        if (value) {
          this.jobs.isoToDisplay = key
          break
        }
      }

      this.setPointsOver()
    },
    getPointIcon(point = { goAlone: true, tag: null }) {
      const iconNames = {
        Domicile: 'home',
        'Amis / Famille': 'family',
        'Ancien lieu de travail ou formation': 'work',
        'Travail et formation (lieu ancien ou actuel)': 'work',
        Commerce: 'shop',
        'Etablissement scolaire': 'school',
        Sante: 'health',
        Loisirs: 'spareTime',
        siae: 'siae',
        Administratif: 'administrative',
        Autre: 'other',
      }

      const color = point?.goAlone ? 'yellow' : 'violet'
      const selected = point?.id === this.selectedPointId ? '_selected' : ''

      return icon({
        iconUrl: `/assets/markers/${
          iconNames[point.tag] || 'empty'
        }_${color}${selected}.png`,
        iconSize: [32, 38].map((size) =>
          point.id === this.selectedPointId ? size * 1.2 : size
        ),
        iconAnchor: [16, 38].map((size) =>
          point.id === this.selectedPointId ? size * 1.2 : size
        ),
      })
    },
    getOfferIcon(isAccessible) {
      return icon({
        iconUrl: `/assets/markers/offer_${isAccessible ? 'green' : 'gray'}.png`,
        iconSize: 28,
        iconAnchor: 28,
      })
    },
    getPictoIcon(iconUrl) {
      return icon({
        iconUrl,
        iconSize: 28,
        iconAnchor: 28,
      })
    },
  },
}
</script>

<style>
.z-200 {
  z-index: 200 !important;
}
.z-400 {
  z-index: 400 !important;
}
.z-600 {
  z-index: 600 !important;
}
.z-900 {
  z-index: 900 !important;
}
.z-1000 {
  z-index: 1000 !important;
}

.scrollbar::-webkit-scrollbar {
  width: 10px;
}

.scrollbar::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-color: gray;
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
}
</style>

<style scoped>
* {
  transition: 0.2s;
}
</style>
