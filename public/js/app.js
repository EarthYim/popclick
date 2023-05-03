const app = Vue.createApp({
  data() {
    return {
      countA: 0,
      countB: 0,
      totalCountA: 0,
      totalCountB: 0,
      optionA_ID: "0",
      optionB_ID: "1",
      optionA_Name: '',
      optionB_Name: '',
      apiA: '',
      apiB: '',
    }
  },
  mounted() {
    setInterval(this.reportClicks, 1000);
    setInterval(this.updateOptions, 1000); // change to 10000
    fetch('/api/optionInfo', {
      method: 'GET'
    }) 
    .then(response => response.json())
    .then(data => {
      this.optionA_ID = data.optionA;
      this.optionB_ID = data.optionB;
    })
    fetch('/api/candidateInfo', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        this.optionA_Name = data[this.optionA_ID].name;
        this.apiA = data[parseInt(this.optionA_ID)].api;
        this.optionB_Name = data[this.optionB_ID].name;
        this.apiB = data[parseInt(this.optionB_ID)].api;
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
        console.log(this.optionB_ID)
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
        //console.log(`Count A: ${data[this.optionA_ID]}`);
        this.totalCountA = data[this.optionA_ID];
        //console.log(`Count B: ${data[this.optionB_ID]}`);
        this.totalCountB = data[this.optionB_ID];
      })
      .catch(error => {
        console.error(error);
      });
      this.countA = 0;
      this.countB = 0;
    },
    updateCandidate() {
      fetch('/api/candidateInfo', {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.optionA_Name = data[this.optionA_ID].name;
          this.apiA = data[parseInt(this.optionA_ID)].api;
          this.optionB_Name = data[this.optionB_ID].name;
          this.apiB = data[parseInt(this.optionB_ID)].api;
        })
    },
    updateOptions() {
      fetch('/api/optionInfo', {
        method: 'GET'
      }) 
      .then(response => response.json())
      .then(data => {
        this.optionA_ID = data.optionA;
        this.optionB_ID = data.optionB;
      })
      this.updateCandidate();
    }
  }
})
app.mount('#app')
