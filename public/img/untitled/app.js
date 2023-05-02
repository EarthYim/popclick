const app = Vue.createApp({
  data() {
    return {
      authenticated: false, 
      publicKey: '',
      optionA: 0,
      optionB: 1,
      candidateLists: [],
    }
  },
  mounted() {
    fetch('/cadnidate.json')
      .then(response => response.json())
      .then(data => {
        this.candidateLists = data;
        this.optionA = data[0];
        this.optionB = data[1];
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
            const token = data.token;
            //axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    updateOptions() {
      console.log(this.candidateLists.a);
      fetch('/admin/updateOptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          },
        body: JSON.stringify({ "optionA": this.optionA, "optionB": this.optionB })
      });
    }
  }
});
app.mount('#app')
