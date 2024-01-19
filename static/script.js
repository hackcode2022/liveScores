let lastFetchTime = 100000;
let i = 1;
function getScores() {

  const now = Date.now();

  if(now - lastFetchTime < 10000) {

    return;

  }



  axios.get('/get_scores')
    .then(function(response) {

      displayScores(response.data);
      console.log('succes')
      lastFetchTime = now;
    })
    .catch(function(error) {

      console.log('Error fetching scores:', error);

    });

}

function displayScores(scores) {


  let scoresContainer = document.getElementById('scores-container');

  scoresContainer.innerHTML = '';

  if(scores.matches && scores.matches.length > 0) {

    scores.matches.forEach(function(match) {

      let matchDiv = document.createElement('div');
      matchDiv.classList.add('match');

      let teamsDiv = document.createElement('div');
      teamsDiv.classList.add('teams');

      let mScore = match.score.fullTime.home;
      let aScore = match.score.fullTime.away;

      teamsDiv.innerHTML = `
        <div class="hteam">
          <div>
            <img src="${match.homeTeam.crest}">
            <span>${match.homeTeam.name}</span>
          </div>
        </div>
        <p class="score" id="score"><strong>${mScore} - ${aScore}</strong> </p>
        <div class="ateam">
          <div>
            <span>${match.awayTeam.name}</span>
            <img src="${match.awayTeam.crest}">
          </div>
        </div>
      `;

      let detailsDiv = document.createElement('div');
      detailsDiv.classList.add('details');
      detailsDiv.innerHTML = `

                                    <p>Matchday: ${match.matchday}</p>
                                    <p>Status: ${match.status}</p>`;



      matchDiv.appendChild(teamsDiv);
      matchDiv.appendChild(detailsDiv);
      scoresContainer.appendChild(matchDiv);
      if (match.status === 'IN_PLAY'){
      const divscore = document.getElementById('score');
      divscore.classList.add('livematch')
      };

    });

  } else {

    scoresContainer.innerHTML = '<p>No matches available</p>';

  }

}








setInterval(getScores, 1000);



