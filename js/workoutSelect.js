const submitBtn = document.getElementById("submitButton");

function displayRadioValue() {
  let category = "";
  let level = "";

  const categoryHTML = document.querySelector("input[name=type]:checked");
  const levelHTML = document.querySelector("input[name=level]:checked");

  category = categoryHTML?.value;
  level = levelHTML?.value;
  if(!category && !level) {
    alert('Please Make a Selction')
  } else {
  localStorage.setItem("category", categoryHTML.value);
  localStorage.setItem("level", levelHTML.value);
  getExercise(category, level);
  setTimeout(() => {
    window.location.href = "results.html";
  }, 1000);
  console.log(category, level)
  }
}

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
      console.log(data)
      const randomNum = Math.floor(Math.random() * data.length);
      const { name, equipment, instructions } = data[randomNum];
      // localStorage.clear();
      localStorage.setItem("name", name);
      localStorage.setItem("equipment", equipment);
      localStorage.setItem("instructions", instructions);

    });
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  displayRadioValue();
});
