const result = document.getElementById("resultDiv");

const submitBtn = document.getElementById("submitButton");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  typeInput = document.getElementById("typeInput");
  let category = typeInput.value;

  console.log(category,"category");

  localStorage.setItem("category", category);

  levelInput = document.getElementById("levelInput");
  let level = levelInput.value;
  getExercise(category, level);
  setTimeout(() => {
    window.location.href = "results.html";
  }, 1000);
});


function getExercise(category, level) {
  fetch(
    `https://api.api-ninjas.com/v1/exercises?type=${category}&difficulty=${level}`,
    {
      headers: { "x-api-key": "nSSlMh6H/1tGyPEKhn+DcA==U15yCA918ShBX6Yt" },
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const randomNum = Math.floor(Math.random() * data.length);
      const { name, equipment } = data[randomNum];
      console.log(name, equipment);
      // localStorage.clear();
      localStorage.setItem("name", name);
      localStorage.setItem("equipment", equipment);
    });

}