import React, {useReducer, useState, useCallback} from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action)=>{
  switch (action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing=>ing.id !== action.id);
      default:
        throw new Error('Should not get there!');
  }
}

function Ingredients() {
const [userIngredients, dispatch]=useReducer(ingredientReducer,[]);
// const [userIngredients,setUserIngredients] = useState([]);
const [isLoading,setIsLoading]=useState(false);
const [error,setError] = useState();

const filteredIngredientsHandler = useCallback(filteredIngredients =>{
dispatch({type: 'SET', ingredients: filteredIngredients})
  // setUserIngredients(filteredIngredients);
},[])


const addIngredientHandler = ingredient =>{
  setIsLoading(true);
  fetch('https://react-todo-8171c-default-rtdb.firebaseio.com/ingredients.json',{
    method: 'POST',
    body:JSON.stringify(ingredient),
    headers: {'Content-Type':'application/json'}
  }).then(response=>{
    setIsLoading(false);
    return response.json();
  }).then(responseData =>{
    dispatch({type:'ADD', ingredient:{id: responseData.name, ...ingredient}})
    // setUserIngredients(prevIngredients => [...prevIngredients,{id: responseData.name,...ingredient}]);    
  }
  )


}

const removeIngredientHandler = ingredientId =>{
  setIsLoading(true);
  fetch(`https://react-todo-8171c-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,{
    method: 'DELETE'
  }
  ).then(response=>{
    setIsLoading(false);
    dispatch({type: 'DELETE',id:ingredientId});
  // setUserIngredients(prevIngredients => prevIngredients.filter(userIngredient => userIngredient.id !== ingredientId));    
  }).catch(error=>{
    setError('Something went wrong!');
    setIsLoading(false);
  });
}

const clearError = ()=>{
  setError(null);
}

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
