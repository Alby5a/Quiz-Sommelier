// Variabili globali
let domande = [];
let domandeFiltrate = [];
let currentQuestionIndex = 0;
let score = 0;


document.getElementById('quiz-random').addEventListener('click', selezionaQuizRandom);
 
// Carica il file JSON con le domande
async function caricaDomande() {
  try {
    const response = await fetch('domande.json');
    domande = await response.json();
    console.log("Domande caricate:", domande);
    mostraCategorie();
  } catch (error) {
    console.error('Errore nel caricamento del file JSON:', error);
  }
}

// Mostra le categorie nella sezione "selezione-categoria"
function mostraCategorie() {
  
  const listaCategorie = document.getElementById('lista-categorie');
  // Estrae le categorie uniche dal JSON
  const categorie = [...new Set(domande.map(item => item.categoria))];
  console.log("Categorie trovate:", categorie);
  // Crea un pulsante per ogni categoria
  categorie.forEach(categoria => {
    const btn = document.createElement('button');
    btn.textContent = categoria;
    btn.addEventListener('click', () => selezionaCategoria(categoria));
    listaCategorie.appendChild(btn);
    
  });
}

// Funzione per mischiare un array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Gestisce la selezione di una categoria con 10 domande random
function selezionaCategoria(categoria) {
  // Filtra le domande per la categoria scelta
  let domandeCategoria = domande.filter(item => item.categoria === categoria);
  document.getElementById('abort-quiz').style.display = 'block';
  // Mischia le domande in modo casuale
  domandeCategoria = shuffleArray(domandeCategoria);
  
  // Prendi solo le prime 10 domande (se ce ne sono almeno 10)
  domandeFiltrate = domandeCategoria.slice(0, 10);
  
  console.log("Domande filtrate per", categoria, ":", domandeFiltrate);
  
  // Resetta l'indice della domanda corrente e il punteggio
  currentQuestionIndex = 0;
  score = 0;
  
  // Nasconde la selezione delle categorie e mostra il quiz
  document.getElementById('selezione-categoria').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';
  
  // Avvia il quiz mostrando la prima domanda
  mostraDomanda();
}

// Visualizza la domanda corrente e le sue opzioni
function mostraDomanda() {
  // Se non ci sono più domande, mostra i risultati
  if (currentQuestionIndex >= domandeFiltrate.length) {
    mostraRisultati();
    return;
  }
// Aggiorna il contatore:
  // Mostra la domanda attuale (indice + 1) e quante ne restano (totale - attuale - 1)
  document.getElementById('counter').textContent = 
    `Domanda ${currentQuestionIndex + 1} di ${domandeFiltrate.length} (restano ${domandeFiltrate.length - currentQuestionIndex - 1})`;
  // Nasconde il pulsante "Domanda successiva"
  document.getElementById('prossima-domanda').style.display = 'none';

  const domandaAttuale = domandeFiltrate[currentQuestionIndex];
  // Usa il campo "question" per il testo della domanda
  document.getElementById('testo-domanda').textContent = domandaAttuale.question;
  
  // Pulisce le opzioni precedenti
  const opzioniContainer = document.getElementById('opzioni');
  opzioniContainer.innerHTML = '';

  // Crea un pulsante per ogni opzione (usa il campo "options")
  domandaAttuale.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => verificaRisposta(index, btn));
    opzioniContainer.appendChild(btn);
  });
}

// Verifica la risposta selezionata dall'utente
function verificaRisposta(rispostaSelezionata, bottoneCliccato) {
  const domandaAttuale = domandeFiltrate[currentQuestionIndex];
  // Ottiene il testo dell'opzione selezionata
  const selectedOption = domandaAttuale.options[rispostaSelezionata];

  // Disabilita tutti i pulsanti delle opzioni
  const buttons = document.querySelectorAll('#opzioni button');
  buttons.forEach(btn => btn.disabled = true);

  // Confronta il testo della risposta selezionata con la risposta corretta (campo "answer")
  if (selectedOption === domandaAttuale.answer) {
    bottoneCliccato.style.backgroundColor = 'green';
    score++;
  } else {
    bottoneCliccato.style.backgroundColor = 'red';
    // Evidenzia il pulsante con la risposta corretta
    buttons.forEach(btn => {
      if (btn.textContent === domandaAttuale.answer) {
        btn.style.backgroundColor = 'green';
      }
    });
  }
  // Mostra il pulsante per passare alla domanda successiva
  document.getElementById('prossima-domanda').style.display = 'block';
}

// Gestisce il passaggio alla domanda successiva
document.getElementById('prossima-domanda').addEventListener('click', () => {
  currentQuestionIndex++;
  mostraDomanda();
});

// Funzione per selezionare 10 domande random da tutte le domande
function selezionaQuizRandom() {
    // Copia l'array completo (così da non modificare l'array originale)
    let tutteLeDomande = [...domande];
    
    // Mischia le domande
    tutteLeDomande = shuffleArray(tutteLeDomande);
    
    // Prendi solo le prime 10 domande
    domandeFiltrate = tutteLeDomande.slice(0, 10);
    
    console.log("Domande random selezionate:", domandeFiltrate);
    
    // Resetta l'indice della domanda corrente e il punteggio
    currentQuestionIndex = 0;
    score = 0;
    
    // Nasconde la selezione delle categorie e mostra il quiz
    document.getElementById('selezione-categoria').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    
    // Avvia il quiz mostrando la prima domanda
    mostraDomanda();
  }
  

// Mostra la schermata dei risultati
function mostraRisultati() {
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('risultati').style.display = 'block';
  document.getElementById('punteggio').textContent = 
    `Hai totalizzato ${score} su ${domandeFiltrate.length} risposte corrette!`;
}

// Permette di ripetere il quiz tornando alla selezione della categoria
document.getElementById('ripeti-quiz').addEventListener('click', () => {
  document.getElementById('risultati').style.display = 'none';
  document.getElementById('selezione-categoria').style.display = 'block';
});

// Avvia il caricamento delle domande quando la pagina è pronta
window.addEventListener('DOMContentLoaded', caricaDomande);

// Gestisce l'interruzione del test e il ritorno alla schermata iniziale
document.getElementById('abort-quiz').addEventListener('click', () => {
  // Nasconde la sezione del quiz e dei risultati
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('risultati').style.display = 'none';
  // Mostra la schermata di selezione della categoria
  document.getElementById('selezione-categoria').style.display = 'block';
  // Nascondi il pulsante "Interrompi Test"
  document.getElementById('abort-quiz').style.display = 'none';
  
 
});

