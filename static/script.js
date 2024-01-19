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
    // Parcourir tous les matchs
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

      // Formater le temps du match
      if (minute === 0) {
        minute = '00';
      }

      if (mScore === null || aScore === null) {
        gscore = hour + 'h' + minute;
      }

      if (match.status === 'POSTPONED') {
        gscore = 'Reporté';
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
        <p>Journée : ${match.matchday}</p>
        <p>Statut : ${match.status}</p>
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

// Appeler la fonction getScores toutes les 1000 millisecondes (1 seconde)
setInterval(getScores, 1000);




