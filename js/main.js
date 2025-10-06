const form = document.getElementById("formulaire");

form.addEventListener("submit", function (e) {
  e.preventDefault(); 

  
  const nombre = document.getElementById("nombre").value;
  const categorie = document.getElementById("categorie").value;
  const difficulte = document.getElementById("difficulte").value;
  const type = document.getElementById("type").value || "multiple";

  
  const url = `https://opentdb.com/api.php?amount=${nombre}&category=${categorie}&difficulty=${difficulte}&type=${type}`;

  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        alert("Aucune question trouvée avec ces paramètres !");
        return;
      }

      
      localStorage.setItem("quizData", JSON.stringify(data.results));
      localStorage.setItem("quizParams", JSON.stringify({ nombre, categorie, difficulte, type }));

      
      window.location.href = "quiz.html";
    })
    .catch(err => {
      alert("Erreur lors du chargement des questions : " + err);
    });
});