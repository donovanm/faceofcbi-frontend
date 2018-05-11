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
    get('/api').then(results => this.employees = results.employees.map(result => ({
      id: result.id,
      photoUrl: result.photoUrl,
      selected: false,
      name: result.displayName,
    })));
  },
  data: function () {
    return {
      employees: [],
      filterValue: '',
      selectedEmployees: [],
    };
  },
  computed: {
    filteredEmployees: function () {
      if (!this.filterValue) {
        return this.employees;
      }
      return this.employees
        .filter(employee => employee.name.toLowerCase().includes(this.filterValue.toLowerCase()));
    }
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
      // this.filterText = ''; Doesn't update the filtered employees for some reason. No time to fix
    },
    handleStart: function () {
      const idList = this.selectedEmployees.join(',');

      // Resulting image
      get(`http://localhost:5000?ids=${idList}`).then((data) => {
        const canvas = this.$refs.myCanvas;
        const ctx = canvas.getContext('2d');
        const imageData = new ImageData(250, 300);
        let counter = 0;
        for (var y = 0; y < 300; y++) {
          for (var x = 0; x < 250; x++) {
            const pixel = data[y][x];
            imageData.data[counter] = pixel[0] ? pixel[0] : 255;
            imageData.data[counter + 1] = pixel[1] ? pixel[1] : 255;
            imageData.data[counter + 2] = pixel[2] ? pixel[2] : 255;
            imageData.data[counter + 3] = 255;
            counter+=4;
          }
        }
        ctx.putImageData(imageData, 0, 0)
      });
    },
    handleFilterChange: function (event) {
      this.filterValue = event.target.value;
    },
  },
  template: `
    <div>
      <div style="textAlign: center">
        <canvas ref="myCanvas" width=250 height=300 />
      </div>
      <div class="action-bar">
        <button @click="handleStart">BLEND!</button>
        <button @click="handleClear">CLEAR</button>
        <div style="float: right">
          Filter <input type="text" v-model="filterValue" @keyup="handleFilterChange" />
        </div>
      </div>
      <employee
        v-for="(employee, index) in filteredEmployees"
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
