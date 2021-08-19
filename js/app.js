
var app = {
  /** 
  * Code Fourni 
  * Lisez attentivement chaque méthode, pour ne pas réécrire de code déjà fourni ;-)
  * Rappel : n'hésitez pas à commenter ce code pour vous aider à le comprendre, les commentaires sont gratuits et vegan-friendly
  **/

  fetchComponents: function () {
    app.brField = document.getElementById('bankroll');
    app.lowCard = document.getElementById('card_low');
    app.highCard = document.getElementById('card_high');
    app.midCard = document.getElementById('question');
    app.potField = document.getElementById('pot');
    app.result = document.getElementById('result');
    app.pot = document.getElementById('potContainer');
  },

  showBankRoll: function () {
    app.brField.textContent = app.bankroll;
  },

  getRandomNumber: function (minValue, maxValue) {
    return Math.floor( Math.random() * (maxValue - minValue + 1) ) + minValue;
  },

  // Generate two random numbers between minValue and maxValue (included) and return the result as an object
  getTwoNumbers: function (minValue, maxValue) {
    let number1 = app.getRandomNumber(minValue, maxValue);
    let number2 = app.getRandomNumber(minValue, maxValue);
    // just a check to ensure numbers are differents
    while(number1 == number2) {
      number2 = app.getRandomNumber(minValue, maxValue);
    }
    // return result as an objet
    return {
      min: Math.min(number1, number2),
      max: Math.max(number1, number2)
    };
  },

  showResults: function (message) {
    app.result.style.display = 'block';
    document.getElementById('resultMessage').textContent = message;
    app.pot.style.display = 'none';
  },

  /** 
  * Fin du code fourni. 
  * Après, c'est à toi ! 
  **/

  bankroll: 100,

  cards: [2,3,4,5,6,7,8,9,10,'Valet','Dame','Roi','As'],

  newRound: function () {
    // En premier lieu, il faut tirer 2 nombres au hasard.
    // Allez, cadeau, on le fait pour toi 😉
    // NB : la fonction retourne un objet ;-)
    // NB2 : cet objet est stocké dans l'objet app, on peut donc y accéder partout
    app.values = app.getTwoNumbers(0, 12);

    // Décidément... encore une partie déjà codée
    // À moins que... jetons un oeil au code cette fonction
    app.updateCards();

    // Pour finir, il faut masquer l'élément résultat
    app.result.style.display = 'none';
    
    // CE QUI SUIT NE S'APPLIQUE QUE SI TU EN ES À L'ÉTAPE 5
    // Lors de la première partie, le pot est déjà affiché et vide
    // Mais quand la partie recommence, il faut réafficher le pot et vider la valeur saisie dans le champ pot
    // Sinon, il reste caché et on se retrouve avec une interface sans aucune action possible
    if (app.bankroll > 0) {
      app.potField.value = '';
      app.pot.style.display = 'block';
      // on remet aussi la carte du milieu à zero
      app.midCard.className = 'card';
    }
  },

  updateCards: function () {
    // Mouais, va falloir la retoucher un peu quand même, cette fonction

    // Pour l'instant, on modifie le contenu textuel, c'est plus simple
    // Le style, ça viendra plus tard : l'essentiel, c'est que ça fonctionne 👌

    // La vraie valeur à mettre ici, c'est la plus basse des 2 valeurs tirées juste avant
    app.lowCard.textContent = app.values.min;
    app.lowCard.className = `card val-${app.cards[app.values.min]}`;

    // Et ici, la plus haute
    app.highCard.textContent = app.values.max;
    app.highCard.className = `card val-${app.cards[app.values.max]}`;

    // Pour la carte du milieu, on va écrire "?" dedans (il faut attendre que le joueur mise pour tirer cette carte)
    app.midCard.textContent = "?";
  },

  handleInputSubmit: function (event) {
    // Cette fonction sera déclenchée par la soumission d'un formulaire. Enfin... quand tu l'auras branchée sur la soumission du formulaire 😈
    // Il faut donc commencer par empêcher le rechargement de la page (qui est le comportement par défaut de ce genre d'event).
    event.preventDefault();

    // Ensuite, récupère la valeur de l'input qui porte l'id "pot". C'est la mise du joueur. Je me demande si on l'a pas déjà quelque part, cet élément...
    let mise = parseInt(app.potField.value);
    
    // Il va falloir faire une série de vérification : 
    // - la valeur de la mise doit être un nombre entier
    // - la valeur de la mise doit être nulle ou positive.
    // - la mise ne peut pas être supérieur aux fonds du joueur (qu'on appelle souvent "bankroll")
    if (isNaN(mise)) {
      alert('Merci de renseigner un nombre!');
    } else if (mise < 0) {
      alert('La mise doit être positive !');
    } else if ( mise > app.bankroll) {
      alert('La mise ne peut pas être plus importante que la banque !');
    }

    // Dans chaque cas d'erreur, affiche une alerte avec un message cohérent.
    
    
    // Si tout va bien (et uniquement dans ce cas), il faut lancer la fonction qui termine le round (codée à l'étape 5)
    // As-tu remarqué la variable passée en argument à cette fonction ? Fais gaffe si tu as décidé de nommer la tienne différemment, il va falloir en renommer une des deux
    // app.endCurrentRound(potValue);
    else {
      app.endCurrentRound(mise);
    }
  },

  // étape 5 : fin du round
  endCurrentRound: (mise) => {
    // Générer aléatoirement l'indice de la 3ème carte.
    let midValue = app.getRandomNumber(0,12);

    // Comparer les cartes :
    //   Si la 3ème carte est supérieur à la carte basse ET inférieure à la carte haute, le joueur gagne.
    //   Sinon, le joueur perd.
    let playerWin = (midValue > app.values.min && midValue < app.values.max);

    // Dans tous les cas, il faut mettre à jour le bankroll (juste la variable, pas son affichage dans le DOM)
    if (playerWin) {
      app.bankroll += mise*2;
    } else {
      app.bankroll -= mise;
    }

    // Puis faire une mise à jour visuelle :
    // Afficher la valeur de la 3ème carte.
    app.midCard.className = 'card animatedCard';

    setTimeout( () => {
      app.midCard.className = `card val-${app.cards[midValue]}`;
      }, 250);    // Afficher un message "gagné" ou "perdu", tout en cachant le formulaire de mise (une fonction existe déjà pour cette tâche).

    if (playerWin) {
      app.showResults('Gagné !');
    } else {
      app.showResults('Perdu !');
    }

    // Mettre à jour la valeur du bankroll dans le DOM (pour ça aussi, une fonction existe déjà).
    app.showBankRoll();
  },

  // Cette fonction est fournie, mais il va probablement falloir la modifier...
  init: function () {
    // Pour faciliter l'accès aux éléments DOM les plus "interactifs"
    app.fetchComponents();

    // On affiche la valeur du bankroll
    app.showBankRoll();

    // On accroche la fonction "newRound" au bouton "newRound".
    document.getElementById('newRound').addEventListener('click', app.newRound);

    // étape 4: on branche le submit du formulaire
    app.pot.addEventListener('submit', app.handleInputSubmit );

    // Enfin, on lance le premier round !
    app.newRound();
  }

};


// Lorsque la page est totalement chargée, on lance la fonction app.init
document.addEventListener('DOMContentLoaded', app.init);