const form = document.getElementById("formulaire");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var nombre = document.getElementById("nombre").value;
  var categorie = document.getElementById("categorie").value;
  var difficulte = document.getElementById("difficulte").value;
  var type = document.getElementById("type").value || "multiple";

  var url =
    "https://opentdb.com/api.php?amount=" +
    nombre +
    "&category=" +
    categorie +
    "&difficulty=" +
    difficulte +
    "&type=" +
    type;

  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      localStorage.setItem("quizData", JSON.stringify(data.results));

      document.getElementById("contenuDeQuiz").classList.remove("cache");

      form.closest(".carte").classList.add("cache");
    })
    .catch(function (err) {
      alert("Erreur lors du chargement des questions : " + err);
    });
});
