let lastFetchTime = 0;

function getScores() {

  const now = Date.now();

  if (now - lastFetchTime < 60000) {
    console.log('no')
    return;
  }

  lastFetchTime = now;

  axios.get('/get_scores')
    .then(function (response) {
      displayScores(response.data);
    })
    .catch(function (error) {
      console.error('Error fetching scores:', error);
    });

}

function displayScores(scores) {
    var scoresContainer = document.getElementById('scores-container');


    if (scores.matches && scores.matches.length > 0) {
        scores.matches.forEach(function (match) {
            var matchDiv = document.createElement('div');
            matchDiv.classList.add('match');

            var teamsDiv = document.createElement('div');
            teamsDiv.classList.add('teams');
            mscore = match.score.fullTime.home;
            ascore = match.score.fullTime.away
            utcDate = match.utcDate
            const matchTime = new Date(utcDate);
            const hour = matchTime.getHours(); 
            const minute = matchTime.getMinutes();

            console.log(hour); // 19
            console.log(minute); // 45
            console.log(utcDate)
            gscore =  mscore + " - " + ascore
            if (mscore === null || ascore === null) {
              gscore = hour + " h " + minute;
            }
            scoresContainer.innerHTML = '';
            teamsDiv.innerHTML = `
  <div class="hteam">
    <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}">
    <span>${match.homeTeam.name}</span>
  </div>
  <p class="score"><strong>${gscore}</strong></p>
  <div class="ateam">
    <span>${match.awayTeam.name}</span>
    <img src="${match.awayTeam.crest}" alt="${match.awayTeam.name}">
  </div>
`;

            var detailsDiv = document.createElement('div');
            detailsDiv.classList.add('details');
            detailsDiv.innerHTML = `
                                   
                                    <p>Matchday: ${match.matchday}</p>
                                    <p>Status: ${match.status}</p>`;

            matchDiv.appendChild(teamsDiv);
            matchDiv.appendChild(detailsDiv);
            scoresContainer.appendChild(matchDiv);
            console.log('sucess')
            setInterval(getScores, 20000);
        });
    } else {
        scoresContainer.innerHTML = '<p>No matches available</p>';
    }
}


setInterval(getScores, 1000);



