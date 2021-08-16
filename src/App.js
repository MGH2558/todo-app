import React,{useState,useRef,useEffect} from 'react';
import './App.css';
import uuid from 'react-uuid';

function App() {

  const [editedTodo,setEditedTodo]= useState('');
  const [todo,setTodo]= useState('');
  const [list,setList]= useState(()=>{

    const storedlist = localStorage.getItem('list');

    if(storedlist){
      return JSON.parse(storedlist);
    }else{
      return [{id:'',task:'',editable:false}]
    }

  });


  const inputItemRef = useRef();
  const inputEditRef = useRef();

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  },[list])

  const handleChange = ()=>{
      setTodo(inputItemRef.current.value);
  }

  const handleEditTodo = ()=>{
    setEditedTodo(inputEditRef.current.value)
  }

  const handleToggleEdit = (id)=>{

    const newList = list.map(todo=>{
      if(todo.id===id){

        const newItem = {
          ...todo,
          editable:!todo.editable
        };

        return newItem;
      }
      return todo;
    })
    setList(newList);

    
  }

  const handleAddItem = (event)=>{
    event.preventDefault();
  
    const existTask = list.find(listItem=>listItem.task===todo)

    if(todo!==''){

      if(!existTask){
        setList([
        ...list,
        {
          id: uuid(),
          task : todo,
          editable:false
        }
        ])
      }else{
         window.alert('the task is duplicate')
      }

    }else{
      window.alert('enter the task')
    }

    setTodo('');
    
}

  const handleRemoveItem = (id)=>{

    const filteredList = list.filter(listItem=>listItem.id!==id);
    setList(filteredList);
  }

  const handleSaveChange = (id)=>{

    const newList= list.map(item=>{
      if(item.id===id){

        if(editedTodo!==''){

          const newitem = {
            ...item,
            task:editedTodo,
            editable:false
          };
          return newitem;

        }

        window.alert('enter the task')

      }
      return item;
    });
    setList(newList)
    setEditedTodo('')
  }


  return (
    <div className="App">
      <h2>MY TODO APP :</h2>
      <div>
        <form onSubmit={handleAddItem}>
          <input ref={inputItemRef} type='text' onChange={handleChange} value={todo}/>
          <input type='submit' value='ADD'/>
        </form>
      </div>
      <div>
        <ul>
          {
            
            list.map((listItem)=>(
              
              listItem.task!=='' ?

              <li key={listItem.id}>
                
                <label htmlFor="edit-task">{listItem.task}</label>

                <button  onClick={()=>handleToggleEdit(listItem.id)} >edit</button>
                <button onClick={()=>handleRemoveItem(listItem.id)}>remove</button>

                {
                  listItem.editable? 
                  <div>
                        <input 
                          ref={inputEditRef} 
                          id="edit-task" 
                          type="text" 
                          onChange={handleEditTodo} 
                          disabled={!listItem.editable} 
                          value={editedTodo}/>
                          <button  onClick={()=>handleSaveChange(listItem.id)} >save change</button>
                  </div>
                  :null                  
                }

              </li> 

              :null
            ))
            
          }
        </ul>
      </div>
        
    </div>
  );
}

export default App;
