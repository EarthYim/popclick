new Vue({
    el: '#app',
    data: {
      countA: 0,
      countB: 0
    },
    mounted() {
      setInterval(this.reportClicks, 1000);
    },
    methods: {
      incrementCountA() {
        this.countA++;
      },
      incrementCountB() {
        this.countB++;
      },
      APICall(vote, count) {
        if (count>30){
          count = 30;
        }
        var data = {N: count}
        
      },
      reportClicks() {
        // make API call to report the click counts for each button in the last second
        // this is just a placeholder for the actual API call
        console.log(`Button A clicks in last second: ${this.countA}`);
        console.log(`Button B clicks in last second: ${this.countB}`);
        // reset the click counts for the next second
        this.countA = 0;
        this.countB = 0;
      }
    }
  });
  