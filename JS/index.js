//&========|> HTML Elements
let SearchInput = document.querySelector("#searchInput");
let dataContainer = document.querySelector("#dataContainer");
let subButton;
let nameInput;
let mailInput;
let phoneInput;
let ageInput;
let passInput;
let repassInput;

// ^========|>Functions
// !Loader functions
$(".lds-hourglass").fadeOut(300, function () {
  $("#loading").remove();
  $("body").css({ overflow: "auto" });
});

// !close and open sidebar functions
let boxWidth = $(".nav-tab").innerWidth();
function OpenNav() {
  $(".side-nav").animate({ left: 0 }, 500, function () {
    $(".side-nav-header .close").removeClass("d-none");
    $(".side-nav-header .open").addClass("d-none");
  });
  $(".links ul li").slideToggle(700);
}
function CloseNav() {
  $(".side-nav").animate({ left: -boxWidth }, 500, function () {
    $(".side-nav-header .close").addClass("d-none");
    $(".side-nav-header .open").removeClass("d-none");
  });
  $(".links ul li").slideToggle(700);
}
CloseNav();
$(".side-nav-header>i").on("click", function () {
  if ($(".side-nav").css("left") == "0px") {
    CloseNav();
  } else {
    OpenNav();
  }
});
// !API get meals default main page function
GetMealsByName("");
// !API get meals by search function

function ShowSearch() {
  SearchInput.innerHTML = `    <div class="row">
      <div class="col-md-6">
        <input type="text" onkeyDown="GetMealsByName(this.value)" placeholder="Search By Name" class="form-control my-4 bg-transparent text-white">
      </div>
            <div class="col-md-6">
        <input type="text" maxlength="1" onkeyDown="GetMealsByFirstLetter(this.value)" placeholder="Search By First Letter" class="form-control my-4 bg-transparent text-white">
      </div>
    </div>`;
  CloseNav();
}
async function GetMealsByName(meal) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`
  );
  let SearchData = await response.json();
  dataContainer.innerHTML = "";
  DisplaySearchData(SearchData.meals);
}

function DisplaySearchData(arr) {
  for (i = 0; i < arr.length; i++) {
    dataContainer.innerHTML += `      
        <div class="col-md-4 col-lg-3">
          <div onclick="GetMealDetails(${arr[i].idMeal})" class="card position-relative my-2">
            <div class="img">
              <img src="${arr[i].strMealThumb}" class="w-100" alt="">
            </div>
            <div class="hover-card text-center d-flex flex-column justify-content-center">
              <h3>${arr[i].strMeal}</h3>
            </div>
          </div>
        </div>
      `;
  }
}

// !API get meals by searchfisrt letter function
async function GetMealsByFirstLetter(FirstLetterMeal) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${FirstLetterMeal}`
  );
  let FLSearchData = await response.json();
  console.log(FLSearchData.meals);
  dataContainer.innerHTML = "";
  DisplaySearchData(FLSearchData.meals);
}

function DisplaySearchData(arr) {
  for (i = 0; i < arr.length; i++) {
    dataContainer.innerHTML += `      
        <div class="col-md-4 col-lg-3">
          <div class="card position-relative my-2" onclick="GetMealDetails(${arr[i].idMeal})">
            <div class="img">
              <img src="${arr[i].strMealThumb}" class="w-100" alt="">
            </div>
            <div class="hover-card text-center d-flex flex-column justify-content-center">
              <h3>${arr[i].strMeal}</h3>
            </div>
          </div>
        </div>
      `;
  }
}
// !API get meals details  function
async function GetMealDetails(mealID) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  let MealDetails = await response.json();
  console.log(MealDetails.meals[0]);
  dataContainer.innerHTML = "";
  DisplayMealDetails(MealDetails.meals[0]);
}
function DisplayMealDetails(arr) {
  let AllTags = arr.strTags ? arr.strTags.split(",") : [];
  let strTag = ``;
  for (i = 0; i < AllTags.length; i++) {
    strTag += `<span class="badge alert alert-danger m-2 p-2 fs-6 fw-medium">${AllTags[i]}</span>`;
  }
  // let allrecp = arr.strIngr ?  arr.strIngr = null : arr.strIngr.classList.add("d-none")
  let strIngr = "";
  for (i = 1; i <= 20; i++) {
     if(arr[`strIngredient${i}`]){
            strIngr+=`
            <span class="badge alert alert-info m-2 p-2 fs-6 fw-medium">${arr[`strMeasure${i}`]} ${arr[`strIngredient${i}`]}</span>
            `
        }
    // strIngr += `<span class=" badge alert alert-info m-2 p-2 fs-6 fw-medium">${
    //   arr[`strMeasure${i}`]
    // } ${arr[`strIngredient${i}`]}</span>`;
  }

  dataContainer.innerHTML = `        
<div class="col-md-4">
          <div class="img-container">
            <img src="${arr.strMealThumb}" alt="" class="bg-white w-100">
          </div>
          <h2>${arr.strMeal}</h2>
        </div>
        <div class="col-md-8">
          <h3>Instructions</h3>
          <p>${arr.strInstructions}</p>
          <h2 class="fw-bold">Area :<span class="fw-light">${arr.strArea}</span></h2>
          <h2 class="fw-bold">Category :<span class="fw-light">${arr.strCategory}</span></h2>
          <h3 class="mt-2">Recipes : </h3>
        ${strIngr}
          <h3 class="mt-2">Tags :</h3>
          ${strTag} <br></br>
          
          <button class="btn btn-success"><a href="${arr.strSource}" target="_blank">Source</a></button>
          <button class="btn btn-danger"><a href="${arr.strYoutube}" target="_blank">YouTube</a></button>

        </div>`;
}
// !API get meals category function
async function GetMealsCat() {
  SearchInput.innerHTML = "";
  dataContainer.innerHTML = "";
  $("#loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let catData = await response.json();
  console.log(catData.categories);

  displayCategories(catData.categories);
  $("#loading").fadeOut(300);

  CloseNav();
}

function displayCategories(arr) {
  for (i = 0; i < arr.length; i++) {
    
    dataContainer.innerHTML += `      
        <div class="col-md-4 col-lg-3">
          <div class="card position-relative my-2" onclick="FilterByCat('${
            arr[i].strCategory
          }')">
            <div class="img">
              <img src="${arr[i].strCategoryThumb}" class="w-100" alt="">
            </div>
            <div class="hover-card text-center d-flex flex-column justify-content-center">
              <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
            </div>
          </div>
        </div>
      `;
  }
}
// !API get meals category filtered function

async function FilterByCat(category) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let FilterData = await response.json();
  console.log(FilterData.meals);
  dataContainer.innerHTML = "";
  DisplayFilterData(FilterData.meals);
}

function DisplayFilterData(arr) {
  for (i = 0; i < arr.length; i++) {
    dataContainer.innerHTML += `      
        <div class="col-md-4 col-lg-3">
          <div  class="card position-relative my-2 " onclick="GetMealDetails('${arr[i].idMeal}')">
            <div class="img">
              <img src="${arr[i].strMealThumb}" class="w-100" alt="">
            </div>
            <div class="hover-card text-center d-flex flex-column justify-content-center">
              <h3>${arr[i].strMeal}</h3>
            </div>
          </div>
        </div>
      `;
  }
}
// !API get meals countries  function
async function GetMealsArea() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let AreaData = await response.json();
  console.log(AreaData.meals);
  dataContainer.innerHTML = "";
  SearchInput.innerHTML = "";
  displayArea(AreaData.meals);
  CloseNav();
}
function displayArea(arr) {
  for (i = 0; i < arr.length; i++) {
    dataContainer.innerHTML += `
    <div class="col-md-4 col-lg-3">
  <div class="area text-center" onclick="FilterByArea('${arr[i].strArea}')">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
    <h3>${arr[i].strArea}</h3>
  </div>
</div>`;
  }
}
// !API get meals area filtered function

async function FilterByArea(Area) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area}`
  );
  let FilterArea = await response.json();
  console.log(FilterArea.meals);
  dataContainer.innerHTML = "";
  DisplayFilterArea(FilterArea.meals);
}
function DisplayFilterArea(arr) {
  for (i = 0; i < arr.length; i++) {
    dataContainer.innerHTML += `      
        <div class="col-md-4 col-lg-3">
          <div  class="card position-relative my-2 " onclick="GetMealDetails('${arr[i].idMeal}')">
            <div class="img">
              <img src="${arr[i].strMealThumb}" class="w-100" alt="">
            </div>
            <div class="hover-card text-center d-flex flex-column justify-content-center">
              <h3>${arr[i].strMeal}</h3>
            </div>
          </div>
        </div>
      `;
  }
}
// !API get meals Ingredients  function
async function GetMealsIngr() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let IngrData = await response.json();
  console.log(IngrData.meals);
  dataContainer.innerHTML = "";
  SearchInput.innerHTML = "";
  displayIngr(IngrData.meals);
  CloseNav();
}
function displayIngr(arr) {
  for (i = 1; i <= 20; i++) {
    dataContainer.innerHTML += `
    <div class="col-md-4 col-lg-3">
  <div class="Ingredients-card text-center" onclick="FilterByIngr('${
    arr[i].strIngredient
  }')">
      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
    <h3>${arr[i].strIngredient}</h3>
     <p>${arr[i].strDescription.split(" ").slice(0, 15).join(" ")}</p>
  </div>
</div>`;
  }
}
// !API get meals Ingredients filtered  function

async function FilterByIngr(Ingredients) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredients}`
  );
  let FilterIngr = await response.json();
  console.log(FilterIngr.meals);
  dataContainer.innerHTML = "";
  SearchInput.innerHTML = "";
  DisplayFilterIngr(FilterIngr.meals);
}
function DisplayFilterIngr(arr) {
  for (i = 0; i < arr.length; i++) {
    dataContainer.innerHTML += `      
        <div class="col-md-4 col-lg-3">
          <div  class="card position-relative my-2 " onclick="GetMealDetails('${arr[i].idMeal}')">
            <div class="img">
              <img src="${arr[i].strMealThumb}" class="w-100" alt="">
            </div>
            <div class="hover-card text-center d-flex flex-column justify-content-center">
              <h3>${arr[i].strMeal}</h3>
            </div>
          </div>
        </div>
      `;
  }
}
// !REGEX
//~========|> App regex Variables
const nameRegex = /^[a-zA-Z]+(?:[\s]+[a-zA-Z]{3,10})*$/;
const emailRegex = /^[\w - \.]+@([\w-]+\.)+[\w-]{2,4}$/;
// /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const egyphoneRegex = /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/;
const ageRegex = /^([0-9]|[1-9][0-9]|100)$/;
// const repassRegex = passRegex

// !REGEX function
function contactUs() {
    dataContainer.innerHTML = "";
  SearchInput.innerHTML = "";
  dataContainer.innerHTML = `        
  <div class="contact d-flex min-vh-100 justify-content-center align-items-center">
          <div class="container w-75 text-center">
            <div class="row gy-0">
              <div class="col-md-6">
                <input id="nameInput" type="text" placeholder="Enter Your Name"
                  class="form-control my-3 bg-white text-black" onkeyup="validate(nameRegex, nameInput)" onkeydown="Submit()"   >
                  <div class="alert  alert-danger w-100 mt-2 d-none">
                 Special characters and numbers not allowed</div>
              </div>
              <div class="col-md-6">
                <input id="mailInput" type="email" placeholder="Enter Your Email"
                  class="form-control my-3 bg-white text-black" onkeyup="validate(emailRegex, mailInput)" onkeydown="Submit()" >
                  <div class="alert  alert-danger w-100 mt-2 d-none">
                 Email not valid *exemple@yyy.zzz</div>
              </div>
              <div class="col-md-6">
                <input id="phoneInput" type="text" placeholder="Enter Your Phone"
                  class="form-control my-3 bg-white text-black"  onkeyup="validate(egyphoneRegex, phoneInput)" onkeydown="Submit()" >
                        <div class="alert  alert-danger w-100 mt-2 d-none">
                 Enter valid Phone Number</div>
              </div>
              <div class="col-md-6">
                <input id="ageInput" type="number" placeholder="Enter Your Age"
                  class="form-control my-3 bg-white text-black" onkeyup="validate(ageRegex, ageInput)" onkeydown="Submit()" > 
                        <div class="alert  alert-danger w-100 mt-2 d-none" >
                 Enter valid age</div>
              </div>
              <div class="col-md-6">
                <input id="passInput" type="password" placeholder="Enter Your Password"
                  class="form-control my-3 bg-white text-black " onkeyup="validate(passRegex, passInput)" onkeydown="Submit()" >
                        <div class="alert  alert-danger w-100 mt-2 d-none" >
          Enter valid password *Minimum eight characters, at least one letter , one number and one special character:*
                </div>
              </div>
              <div class="col-md-6">
                <input id="repassInput" type="password" placeholder="Repassword"
                  class="form-control my-3 bg-white text-black"  onkeydown="Submit()" onkeyup="Repass()" >
                        <div class="alert  alert-danger w-100 mt-2 d-none" >
                 Enter valid repassword</div>
              </div>
              <button class="btn btn-outline-danger w-auto mx-auto disabled"  id="submitBtn" >Submit</button>
            </div>
          </div>
        </div>`;
  nameInput = document.querySelector("#nameInput");
  mailInput = document.querySelector("#mailInput");
  phoneInput = document.querySelector("#phoneInput");
  ageInput = document.querySelector("#ageInput");
  passInput = document.querySelector("#passInput");
  repassInput = document.querySelector("#repassInput");
  subButton = document.querySelector("#submitBtn");
  CloseNav();
}

function validate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.nextElementSibling.classList.add("d-none");
    return true;
  } 
  element.classList.add("is-invalid");
  element.classList.remove("is-valid");
  element.nextElementSibling.classList.remove("d-none");
  return false;
}

function Repass() {
  if(repassInput.value === passInput.value ) {
        repassInput.classList.add("is-valid");
    repassInput.classList.remove("is-invalid");
    repassInput.nextElementSibling.classList.add("d-none");
return true;
  } 
  repassInput.classList.add("is-invalid");
  repassInput.classList.remove("is-valid");
  repassInput.nextElementSibling.classList.remove("d-none");
return false;  
  }

function Submit() {
  if (
    validate(nameRegex, nameInput) &&
    validate(emailRegex, mailInput) &&
    validate(egyphoneRegex, phoneInput) &&
    validate(ageRegex, ageInput) &&
    validate(passRegex, passInput) &&
   Repass()
  ) {
    
    subButton.classList.remove("disabled");
  } else {
    subButton.classList.add("disabled");
  }
  // clearInputs();
}

// function clearInputs() {
//   element.value = "";
//   element.classList.remove("is-valid", "is-invalid");
//   element.nextElementSibling.classList.add("d-none");
// }
