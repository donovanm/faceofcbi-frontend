const get = (url) => fetch(url, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: 'GET',
})
.then(response => response.json());

Vue.component('app', {
  created: function () {
    get('/api').then(results => this.employees = results.map(result => ({
      id: result.id,
      photoUrl: result.photo_url,
      selected: false,
    })));
  },
  data: function () {
    return {
      employees: [],
      filterText: '',
      selectedEmployees: [],
    };
  },
  methods: {
    handleToggle: function (id) {
      if (this.selectedEmployees.includes(id)) {
        this.selectedEmployees.splice(this.selectedEmployees.indexOf(id), 1);
      } else {
        this.selectedEmployees.push(id);
      }
    },
    handleClear: function () {
      this.selectedEmployees = [];
    },
    handleStart: function () {
      const idList = this.selectedEmployees
        .map(index => this.employees[index].id)
        .join(',');

      // Resulting image
      get(`localhost:5000?ids=${idList}`).then(console.log);
    }
  },
  template: `
    <div>
      <div>
        <button @click="handleStart">Blend!</button>
        <button @click="handleClear">Clear Selections</button>
        <div style="float: right">
          <input type="text" v-model="filterText" />
        </div>
      </div>
      <employee
        v-for="(employee, index) in employees"
        :key="employee.id"
        :onToggle="handleToggle.bind(null, employee.id)"
        :pictureUrl="employee.photoUrl"
        :selected="selectedEmployees.includes(employee.id)"
      />
    </div>
  `,
});

Vue.component('employee', {
  props: ['pictureUrl', 'selected', 'onToggle'],
  methods: {
    toggle: function () {
      this.selected = !this.selected;
    },
  },
  template: `
    <div :class="['employee', selected ? 'selected' : '']" @click="onToggle">
      <img :src="pictureUrl" />
    </div>
  `,
});

var app = new Vue({
  el: '#app',
});
