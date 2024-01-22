// Variable pour stocker le dernier temps de récupération des scores
let lastFetchTime = 100000;

// Variable pour le compteur
let i = 1;

// Fonction pour récupérer les scores
function getScores() {
  // Récupérer le temps actuel
  const now = Date.now();

  // Vérifier si moins de 10 secondes se sont écoulées depuis la dernière récupération
  if (now - lastFetchTime < 10000) {
    // Si oui, ne rien faire
    return;
  }

  // Appeler l'API pour obtenir les scores
  axios.get('/get_scores')
    .then(function(response) {
      // Afficher les scores récupérés
      console.log(response.data);
      displayScores(response.data);


      // Mettre à jour le dernier temps de récupération
      lastFetchTime = now;
    })
    .catch(function(error) {
      // Gérer les erreurs de récupération des scores
      console.log('Erreur lors de la récupération des scores :', error);
    });
}

// Fonction pour afficher les scores
function displayScores(scores) {

  // Récupérer le conteneur des scores dans le DOM
  let scoresContainer = document.getElementById('scores-container');

  // Effacer le contenu précédent du conteneur
  scoresContainer.innerHTML = '';

  // Vérifier si des matchs sont disponibles
if (scores.matches && scores.matches.length > 0) {
    // Trier les matchs par ordre chronologique et en priorisant les matchs en cours et en pause,
    // avec le match ID comme critère de tri secondaire
    scores.matches.sort((a, b) => {
      // Define status order (live, paused, others)
      const statusOrder = { 'IN_PLAY': 3, 'PAUSED': 3, 'FINISHED': 2, 'SCHEDULED': 1, 'POSTPONED': 1, 'CANCELED': 1 };

      // d'abord, on compare les statuts
      const statusComparison = statusOrder[b.status] - statusOrder[a.status];

      // si le statut est différent, alors c'est le plus haut statut qui lemporte
      if (statusComparison !== 0) {
        return statusComparison;
      }

      // Si le statut est le même, c'est la date qui l'emporte
      const dateComparison = new Date(a.utcDate) - new Date(b.utcDate);

      // si la date est différente
      if (dateComparison !== 0) {
        return dateComparison;
      }

      // l'id l'emporte
      return a.id - b.id;
    });

    scores.matches.forEach(function(match) {
      // Créer un élément div pour le match
      let matchDiv = document.createElement('div');
      matchDiv.classList.add('match');

      // Créer un élément div pour les équipes
      let teamsDiv = document.createElement('div');
      teamsDiv.classList.add('teams');

      // Récupérer les scores et détails du match
      let mScore = match.score.fullTime.home;
      let aScore = match.score.fullTime.away;
      let gscore = mScore + ' - ' + aScore;
      let utcDate = match.utcDate;

      const matchTime = new Date(utcDate);
      let hour = matchTime.getHours();
      let minute = matchTime.getMinutes();
      let lastUpdatedUtcDate = match.lastUpdated;
      const lastUpdated = new Date(lastUpdatedUtcDate);
      let lastUpdatedMinute = lastUpdated.getMinutes();


      // Formater le temps du match
      if (minute === 0) {
        minute = '00';
      }




      if (match.status === 'IN_PLAY') {
  teamsDiv.classList.add('livematch');
  gscore = `<strong>${gscore}</strong><br> <span class="minute">En direct </span>`;
}else if (match.status ==='PAUSED'){gscore = `<strong>${gscore}</strong><br> <span class="minute">Mi-temps </span>`;teamsDiv.classList.add('livematch');} else if (match.status === 'POSTPONED') {
        gscore = 'Reporté';
      } else if (mScore === null || aScore === null) {
  // Si le score est null, afficher l'heure du match
  gscore = `<strong>${hour}h${minute}</strong>`;
}


      // Remplir le contenu des équipes
      teamsDiv.innerHTML = `
        <div class="hteam">
          <div>
            <img src="${match.homeTeam.crest}">
            <span>${match.homeTeam.name}</span>
          </div>
        </div>
        <p class="score" id="score"><strong>${gscore}</strong></p>
        <div class="ateam">
          <div>
            <span>${match.awayTeam.name}</span>
            <img src="${match.awayTeam.crest}">
          </div>
        </div>
      `;

      // Créer un élément div pour les détails du match
      let detailsDiv = document.createElement('div');
      detailsDiv.classList.add('details');
      detailsDiv.innerHTML = `
        <p>${match.competition.name}</p>
        <p>Journée ${match.matchday}</p>

      `;

      // Ajouter les éléments au conteneur du match
      matchDiv.appendChild(teamsDiv);
      matchDiv.appendChild(detailsDiv);

      // Ajouter le match au conteneur des scores
      scoresContainer.appendChild(matchDiv);
    });
  } else {
    // Afficher un message si aucun match n'est disponible
    scoresContainer.innerHTML = '<p>Aucun match disponible</p>';
  }
}

// Appeler la fonction getScores toutes les 4000 millisecondes (4 seconde)
setInterval(getScores, 4000);




