const app = Vue.createApp({
  data() {
    return {
      countA: 0,
      countB: 0,
      totalCountA: 0,
      totalCountB: 0,
      optionA_ID: 0,
      optionB_ID: 1,
      optionA_Name: '',
      optionB_Name: '',
      apiA: '',
      apiB: '',
    }
  },
  mounted() {
    setInterval(this.reportClicks, 1000);
    setInterval(this.updateOptions, 10000); // change to 10000
    fetch('/api/candidateInfo', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        this.optionA_Name = data[this.optionA_ID].name;
        this.apiA = data[this.optionA_ID].api;
        this.optionB_Name = data[this.optionB_ID].name;
        this.apiB = data[this.optionB_ID].api;
      })
    fetch('/api/optionInfo', {
      method: 'GET'
    }) 
    .then(response => response.json())
    .then(data => {
      this.optionA_ID = parseInt(data.optionA);
      this.optionB_ID = parseInt(data.optionB);
    })
  },
  methods: {
    incrementCountA() {
      this.countA++
    },
    incrementCountB() {
      this.countB++
    },
    reportClicks() {
      if (this.countA != 0) {
        const dataA = { "number_of_count": this.countA };
        fetch(this.apiA, {
          method: 'POST',
          body: JSON.stringify(dataA),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => console.log(data))
          .catch(error => console.error(error));
        console.log(`Button A clicks in last second: ${this.countA}`);
      }
      if (this.countB != 0) {
        const dataB = { "number_of_count": this.countB };
        fetch(this.apiB, {
          method: 'POST',
          body: JSON.stringify(dataB),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
        console.log(`Button B clicks in last second: ${this.countB}`);
      }
      fetch('/api/score')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(`Count A: ${data.countA}`);
        this.totalCountA = data.countA;
        console.log(`Count B: ${data.countB}`);
        this.totalCountB = data.countB;
      })
      .catch(error => {
        console.error(error);
      });
      this.countA = 0;
      this.countB = 0;
    },
    updateOptions() {
      fetch('/api/optionInfo', {
        method: 'GET'
      }) 
      .then(response => response.json())
      .then(data => {
        this.optionA_ID = parseInt(data.optionA);
        this.optionB_ID = parseInt(data.optionB);
        console.log(`Option A ID: ${this.optionA_ID}`);
        console.log(`Option B ID: ${this.optionB_ID}`);
      })
    }
  }
})
app.mount('#app')
