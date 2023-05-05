const app = Vue.createApp({
  data() {
    return {
      authenticated: false, 
      publicKey: '',
      optionA: "0",
      optionB: "1",
      candidateA: '',
      candidateBB: '',
      candidateLists: [],
      token: '',
    }
  },
  mounted() {
    fetch('/api/candidateInfo')
      .then(response => response.json())
      .then(data => {
        this.candidateLists = data;
      })
  },
  methods: {
    authenticate() {
      if (this.publicKey) {
        // Authenticate the user using their public key
        fetch('/admin/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key: this.publicKey })
        })
          .then(response => {
            if (response.ok) {
              this.authenticated = true;
              return response.json();
            } else {
              throw new Error('Authentication failed');
            }
          })
          .then(data => {
            this.token = data.token;
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    updateOptions() {
      this.candidateId();
      console.log(this.optionA);
      console.log(this.optionB);  
      fetch('/admin/updateOptions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
          },
        body: JSON.stringify({ "optionA": this.optionA, "optionB": this.optionB })
      });
    },
    candidateId() {
      const objectA = this.candidateLists.find(candidate => candidate.name === this.candidateA);
      const objectB = this.candidateLists.find(candidate => candidate.name === this.candidateB);
      this.optionA = objectA.id;
      this.optionB = objectB.id;
    }
  }
});
app.mount('#app')
