
# Pop Candidate

Pop Candidate is a [PopCat.click](popcat.click) inspired game/webapp 
that is inteded as an audience participation medium for the debate event Candidate Classroom.

## About this game
The game is used during the debate between two candidates from each party. The audiences who watch the event both on-site and online can access the link
and participate thier votes (clicks) to the candidates they like, just like a clicking contest. The score for each candidate is then shown on the
stage main screen live during the debate.

## How it work
This game written in Javascript using:

- **Express.js** for backend server
- **MongoDB** for storing and managing votes
- **Vue.js/HTML/CSS** for the client side application

The flow is simple, each user's client calls an API reporting the score every one second. The server store each vote in each 
candidate's vote collection (simplicity is the key here).

To report the score, the server counts all the documents in the vote collection once every one second and serving back through the api request.

As there are many possibility to pair each candidate together, the app is design to be dynamic where the active candidate pair 
can be selected and loaded thorugh the admin interface. Each client is checking in with the server every 1o second to aquire which candidate is active,
then the client app can load the respective informations and APIs for each candidate that has been previously stored in JSON file.


## About the Event
The event **Candidate Classroom** was organize by a student activist organization BadStudent from Thailand for the upcoming 2023 Thai general election.
BadStudent, as a student and youth activist, focuses on the discussing of the education and others policies that effect children and youths.
For more information about BadStudent, please visit [Facebook: badstudent](www.facebook.com/Badstudent.th), [badstudent.co](badstudent.co)
