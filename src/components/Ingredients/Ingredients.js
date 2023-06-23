import React, {useState, useEffect} from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

function Ingredients() {

const [userIngredients,setUserIngredients] = useState([]);

useEffect(()=>{
  fetch('https://react-todo-8171c-default-rtdb.firebaseio.com/ingredients.json')
  .then(response => response.json())
  .then(responseData=>{
    const loadedIngredients = [];
    for(const key in responseData){
      loadedIngredients.push({
        id: key,
        title: responseData[key].title,
        amount: responseData[key].amount
      });
    };
    setUserIngredients(loadedIngredients);
  })
},[]);

const addIngredientHandler = ingredient =>{
  fetch('https://react-todo-8171c-default-rtdb.firebaseio.com/ingredients.json',{
    method: 'POST',
    body:JSON.stringify(ingredient),
    headers: {'Content-Type':'application/json'}
  }).then(response=>{
    return response.json();
  }).then(responseData =>{
    setUserIngredients(prevIngredients => [...prevIngredients,{id: responseData.name,...ingredient}]);    
  }
  )


}

const removeIngredientHandler = ingredientId =>{

  setUserIngredients(prevIngredients => prevIngredients.filter(userIngredient => userIngredient.id !== ingredientId));
}

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
