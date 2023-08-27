let dishes = [];
let cardList = document.getElementById('card-list');
let dishArea = document.getElementById('dish-area');
let favoriteItems = document.getElementById('favorites-meal')
function getFavoriteMeals() {
    const favoritesJSON = localStorage.getItem("favoriteMeals");
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

function saveFavoriteMeals(favorites) {
    localStorage.setItem("favoriteMeals", JSON.stringify(favorites));
}



document.getElementById('food-inp').addEventListener('change', (e) => {
    let food = e.target.value;
    getFoods(food);
});

function getFoods(food)  {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`)
    .then(res => res.json())
    .then(data => {
        dishes = [];
        data.meals.forEach(meal => dishes.push(meal));
        dishArea.innerHTML = '';
        displayDishes();
    })
    .catch(()=>{
        cardList.innerHTML = `<p class="lead text-center">Sorry !!! No recipes found. Try searching for soething else</p>`

    })
}

function displayDishes()  {
    let output = '';
    dishes.forEach(dish => {
        output += `
          <div class="col-xl-3 col-sm-6 col-lg-4">
            <div class="food-card" style="background: url('${dish.strMealThumb}');">
              <div class="food-card-details text-white" foodId="${dish.idMeal}">
                <h1 class="text-center">${dish.strMeal}</h1>
                <button class="btn btn-outline-danger btn-sm add-to-favorites">Add to Favorites</button>
              </div>
            </div>
          </div>
        `;
      });
      cardList.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-favorites")) {
          const id = e.target.parentElement.getAttribute("foodId");
          const favoriteMeals = getFavoriteMeals();
          const selectedDish = dishes.find(dish => dish.idMeal == id);
      
          if (selectedDish && !favoriteMeals.some(favorite => favorite.idMeal === id)) {
            favoriteMeals.push(selectedDish);
            saveFavoriteMeals(favoriteMeals);
            // You can also update the UI to indicate that the dish has been added to favorites
          }
        }
      });
    cardList.classList.remove('d-none');
    cardList.innerHTML = output;
    init();
}

function removeFavoriteMeal(id) {
    const favoriteMeals = getFavoriteMeals();
    const updatedFavorites = favoriteMeals.filter(favorite => favorite.idMeal !== id);
    saveFavoriteMeals(updatedFavorites);
  }

  dishArea.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-from-favorites")) {
      const id = e.target.parentElement.getAttribute("foodId");
      removeFavoriteMeal(id);
    }
});

function init() {
    let foodItem = document.querySelectorAll('.food-card-details');
    foodItem.forEach(item => {
        item.addEventListener('click', (e)=> {
            const id = item.getAttribute("foodId");
            displayRecipe(id);
        })
    })    
}
function initFavorites() {
    const favoriteButtons = document.querySelectorAll('.remove-from-favorites');
    favoriteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const id = button.parentElement.getAttribute('foodId');
        removeFavoriteMeal(id);
        displayFavorites();
      });
    });
  }
function displayRecipe(id)  {
    cardList.classList.add('d-none');
    const selectedDish = dishes.filter(dish => dish.idMeal == id);
    const dish = selectedDish[0];
    let ingredients = [];
    for(let i=1;i<=20;i++) {
        let ingredientName = `strIngredient${i}`;
        let quantity = `strMeasure${i}`;
        if(dish[ingredientName]) {
            const ingredient = {
                'ingredientname' : dish[ingredientName],
                'quantity' : dish[quantity]
            }
            ingredients.push(ingredient);
        }
    }
    let ingredientOuput = '';
    ingredients.forEach(ingredient => {
        ingredientOuput+=
        `
            <div class="ingredient lead">${ingredient.ingredientname}<span class="amount">${ingredient.quantity}</span> </div>
        `
    })
    
    let output = 
    `
        <div id="recipe-header" style="backGround : url(${dish.strMealThumb})">
        </div>
        <div class="row" id="recipe">
            <h1 class="display-2 text-center col-12 mb-5">${dish.strMeal}</h1>
            <hr class="mb-5">
            <div class="col-lg-4">
                <div class="ingredient-list">
                    ${ingredientOuput}
                </div>
            </div>
            <div class="col-lg-8 px-5">
                <div id="steps">
                    <h1 class="display-4">Instructions</h1>
                    <hr>
                    <p class="lead">${dish.strInstructions}</p>
                    <a href="${dish.strYoutube}" class="btn btn-outline btn-lg btn-outline-danger">Youtube link for the recipe</a>
                </div>
            </div>
        </div>  
    `
    dishArea.innerHTML = output;
}

function displayFavorites() {
    const favoriteMeals = getFavoriteMeals();
    let favoritesOutput = '<h1>Favorite Meals</h1>';
  
    if (favoriteMeals.length > 0) {
      favoriteMeals.forEach(favorite => {
        favoritesOutput += `
          <div class="col-xl-3 col-sm-6 col-lg-4">
            <div class="food-card" style="background: url('${favorite.strMealThumb}');">
              <div class="food-card-details text-white" foodId="${favorite.idMeal}">
                <h1 class="text-center">${favorite.strMeal}</h1>
                <button class="btn btn-outline-danger btn-sm remove-from-favorites">Remove from Favorites</button>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      favoritesOutput = '<p class="lead text-center">No favorite meals yet. Start adding some!</p>';
    }
  
    document.getElementById('favorites-list').innerHTML = favoritesOutput;
    initFavorites();
    return favoritesOutput
}

favoriteItems.addEventListener('click', (e) => {
    console.log(displayFavorites())
});