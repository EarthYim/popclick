const app = Vue.createApp({
  data() {
    return {
      countA: 0,
      countB: 0,
      totalCountA: 0,
      totalCountB: 0
    }
  },
  mounted() {
    setInterval(this.reportClicks, 1000);
  },
  methods: {
    incrementCountA() {
      this.countA++
    },
    incrementCountB() {
      this.countB++
    },
    reportClicks() {
      // make API call to report the click counts for each button in the last second
      // this is just a placeholder for the actual API call
      if (this.countA != 0) {
        //call API report a click
        const dataA = { "number_of_count": this.countA };
        fetch('http://localhost:3000/voteA', {
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
        //call API report b click
        const dataB = { "number_of_count": this.countB };
        fetch('http://localhost:3000/voteB', {
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
      //call API for total score
      fetch('http://localhost:3000/score')
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
    }
  }
})

app.mount('#app')
