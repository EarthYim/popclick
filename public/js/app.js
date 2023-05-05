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
      colorA: '',
      colorB: '', 
      imgnA: '',
      imgpA: '',
      imgnB: '',
      imgpB: '',
      imgA: '',
      imgB: ''
    }
  },
  mounted() {
    setInterval(this.reportClicks, 1000);
    setInterval(this.updateOptions, 10000); // change to 10000
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
        this.colorA = data[parseInt(this.optionA_ID)].color;
        this.colorB = data[parseInt(this.optionB_ID)].color;
        this.imgnA = data[parseInt(this.optionA_ID)].imgn;
        this.imgA = this.imgnA;
        this.imgpA = data[parseInt(this.optionA_ID)].imgp;
        this.imgnB = data[parseInt(this.optionB_ID)].imgn;
        this.imgB = this.imgnB;
        this.imgpB = data[parseInt(this.optionB_ID)].imgp;
      })
  },
  methods: {
    incrementCountA() {
      this.countA++
      //console.log("A updated");
    },
    incrementCountB() {
      this.countB++
    },
    reportClicks() {
      if (this.countA != 0) {
        const dataA = { "number_of_count": this.countA };
        //console.log(this.optionB_ID)
        fetch(this.apiA, {
          method: 'POST',
          body: JSON.stringify(dataA),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json();
          })
          .then(data => console.log(data))
          .catch(error => console.error(error));
        //console.log(`Button A clicks in last second: ${this.countA}`);
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
        //console.log(`Button B clicks in last second: ${this.countB}`);
      }
      // fetch('/api/score')
      // .then(response => {
      //   if (!response.ok) {
      //     throw new Error('Network response was not ok');
      //   }
      //   return response.json();
      // })
      // .then(data => {
      //   //console.log(`Count A: ${data[this.optionA_ID]}`);
      //   this.totalCountA = data[this.optionA_ID];
      //   //console.log(`Count B: ${data[this.optionB_ID]}`);
      //   this.totalCountB = data[this.optionB_ID];
      // })
      // .catch(error => {
      //   console.error(error);
      // });
      this.totalCountA += this.countA;
      this.totalCountB += this.countB;
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
          this.colorA = data[parseInt(this.optionA_ID)].sheeID;
          this.colorB = data[parseInt(this.optionB_ID)].sheeID;
          this.imgnA = data[parseInt(this.optionA_ID)].imgn;
          this.imgpA = data[parseInt(this.optionA_ID)].imgp;
          this.imgnB = data[parseInt(this.optionB_ID)].imgn;
          this.imgpB = data[parseInt(this.optionB_ID)].imgp;
          //console.log(this.imgA);
        })
    },
    updateOptions() {
      fetch('/api/optionInfo', {
        method: 'GET'
      }) 
      .then(response => response.json())
      .then(data => {
        if (this.optionA_ID != data.optionA || this.optionB_ID != data.optionB) {
          this.totalCountA = 0;
          this.totalCountB = 0;
        }
        this.optionA_ID = data.optionA;
        this.optionB_ID = data.optionB;
      })
      this.updateCandidate();
    },
    togglepopA() {
      this.imgA = this.imgpA;
      setTimeout(() => {
        this.imgA = this.imgnA;
      }, 200);
    },

    togglepopB() {
      //console.log("B clicked");
      this.imgB = this.imgpB;
      setTimeout(() => {
        this.imgB = this.imgnB;
      }, 200);
    },
  }
})
app.mount('#app')
