   const $ = sel => document.querySelector(sel);

    function decoderTexte(html) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.documentElement.textContent;
    }

    function melanger(tab) {
      for (let i=tab.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [tab[i],tab[j]]=[tab[j],tab[i]];
      }
      return tab;
    }

    //  Variables globales
    let questions = [];
    let numeroQuestion = 0;
    let points = 0;
    let timer = null;
    let tempsParQuestion = 20;
    let tempsRestant = 0;

    const totalQuestions = $('#totalQuestions');
    const numQuestion = $('#numQuestion');
    const texteQuestion = $('#texteQuestion');
    const zoneReponses = $('#zoneReponses');
    const tempsEl = $('#tempsRestant');
    const scoreEl = $('#scoreActuel');
    const zoneFin = $('#zoneFin');
    const titreFinal = $('#titreFinal');
    const texteFinal = $('#texteFinal');
    const detailsFinal = $('#detailsFinal');

    //  Initialisation
    async function demarrerQuiz() {
      //  Récupération depuis le formulaire
      const donnees = localStorage.getItem('quizData');
      if(donnees) {
        questions = JSON.parse(donnees);
      } else {
        // Fallback si aucune donne
        const reponse = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
        const data = await reponse.json();
        questions = data.results;
      }

      if(!questions.length){
        texteQuestion.textContent=" Aucune question trouvée. Retour au formulaire.";
        return;
      }

      totalQuestions.textContent=questions.length;
      numeroQuestion=0;
      points=0;
      afficherQuestion();
    }

    // Afficher question
    function afficherQuestion() {
      clearInterval(timer);
      zoneFin.style.display='none';

      const questionActuelle=questions[numeroQuestion];

      numQuestion.textContent=numeroQuestion+1;


      texteQuestion.innerHTML=decoderTexte(questionActuelle.question);

      const reponses = melanger([...questionActuelle.incorrect_answers, questionActuelle.correct_answer]);

      zoneReponses.innerHTML = reponses.map(r => `<button class="btn-reponse" data-rep="${encodeURIComponent(r)}">${decoderTexte(r)}</button>`).join('');

      document.querySelectorAll('.btn-reponse').forEach(b => b.addEventListener('click', verifierReponse));

      // Timer
      tempsRestant=tempsParQuestion;
      tempsEl.textContent=tempsRestant;
      timer=setInterval(()=>{
        tempsRestant--;
        tempsEl.textContent=tempsRestant;
        if(tempsRestant<=0){
          clearInterval(timer);
          passerQuestion();
        }
      },1000);
    }

    // Vérifier réponse
    function verifierReponse(e){
      clearInterval(timer);
      const bouton = e.currentTarget;
      const reponseChoisie = decodeURIComponent(bouton.dataset.rep);
      const bonneReponse = questions[numeroQuestion].correct_answer;

      document.querySelectorAll('.btn-reponse').forEach(b=>b.disabled=true);

      if(reponseChoisie===bonneReponse){
        points++;
        bouton.classList.add('bonne');
      } else {
        bouton.classList.add('mauvaise');
        const bon = [...document.querySelectorAll('.btn-reponse')].find(b=>decodeURIComponent(b.dataset.rep)===bonneReponse);
        bon.classList.add('bonne');
      }

      mettreAJourScore();
      setTimeout(passerQuestion,900);
    }

    //  Passer à la question suivante
    function passerQuestion(){
      numeroQuestion++;
      if(numeroQuestion>=questions.length){
        afficherResultats();
      } else {
        afficherQuestion();
      }
    }

    //  Afficher résultats finaux
    function afficherResultats(){
      clearInterval(timer);
      titreFinal.textContent=` Tu as obtenu ${points} / ${questions.length}`;

      texteFinal.textContent=`Soit ${Math.round((points/questions.length)*100)}% de réussite.`;

      detailsFinal.innerHTML = questions.map((q,i)=>`
        <div style="margin-bottom:8px;">
          <strong>Q${i+1} :</strong> ${decoderTexte(q.question)}<br>
           Bonne réponse : <strong>${decoderTexte(q.correct_answer)}</strong>
        </div>
      `).join('');

      zoneFin.style.display='block';
      scoreEl.textContent=`Score final : ${points}`;
    }

    function mettreAJourScore(){ scoreEl.textContent=`Score : ${points}`; }

    // Boutons
    $('#btnRetour').addEventListener('click',()=>window.location.href='index.html');
    $('#btnRejouer').addEventListener('click',()=>{
      points=0;
      numeroQuestion=0;
      mettreAJourScore();
      afficherQuestion();
    });
    $('#btnPasser').addEventListener('click',()=>passerQuestion());

    //  Démarrage
    demarrerQuiz();