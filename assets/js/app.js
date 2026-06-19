let base_url= 'https://jsonplaceholder.typicode.com';
let user_url = `${base_url}/users`; 



const spinner  = document.getElementById('spinner');
const nameControl = document.getElementById('name');
const usernameControl = document.getElementById('username');
const emailControl= document.getElementById('email');
const contactControl= document.getElementById('contact');
const userContainer= document.getElementById('userContainer');
const userForm= document.getElementById('userForm');

const addUser= document.getElementById('addUser');
const updateUser= document.getElementById('updateUser');

let userArr=[];

function snackbar(msg,icon){ 
           swal.fire({ 
              title:msg,
              icon:icon, 
              timer:3000
           })
      }


function fetchUser(){ 
             console.log('FetchUser');
             
        //  spinner.classList.remove('d-none');
     let xhr= new XMLHttpRequest(); 
         xhr.open('GET', user_url);
        
        //  xhr.setRequestHeader('content-type','application/json');
        //  xhr.setRequestHeader('Auth','Get token from');
         
        
         xhr.send(null);

         xhr.onload = function(){ 
            if(xhr.status>=200 && xhr.status<=299){ 
                 userArr = JSON.parse(xhr.response);
                       
                 console.log(xhr.status);
                            
                 console.log(userArr);
                 
                 createCards(userArr) ;
                 
                 spinner.classList.add('d-none');
        
                 //  snackbar('Failed to Call Api...!', 'error');
                 
            }else{ 
                 spinner.classList.add('d-none');
               
                snackbar('Failed to Call Api...!', 'error');
            }
         } 


         xhr.onerror = function(){ 
            snackbar('Network error','error');
         }
} 

fetchUser() ;




function createCards(arr){
      let res =" "; 
   arr.forEach(ele=>{ 
           res +=`<div class="col-md-4 mb-4" id=${ele.id}>
                   <div class="card userCard">
                    <div class="card-header">
                        <h5>Name:<span>${ele.name}</span></h5>
                    </div>
                    <div class="card-body">
                       <img src="./image/user.png" alt="">
                       <h5>User Name:<span>${ele.username}</span></h5>
                       <h5>Email:<span>${ele.email}</span></h5>
                       <h5>Contact:<span>${ele.phone}</span></h5>
                       
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-light">Edit </button>
                        <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete </button>

                     </div>
                   </div>
                </div>`
   }); 
   userContainer.innerHTML= res ;
        
} 



function onSubmit(eve){ 
     eve.preventDefault();


    let newObj = {
         name:nameControl.value ,
         username:usernameControl.value ,
         email:emailControl.value ,
         contact:contactControl.value 
       }

     userArr.push(newObj);
    
     spinner.classList.remove('d-none')
       
    let xhr= new XMLHttpRequest() ;

       xhr.open('POST', user_url); 

       xhr.setRequestHeader('content-type','application/json');
       xhr.setRequestHeader('Auth','Get token from');
        
       xhr.send(JSON.stringify(newObj));
       xhr.onload = function(){ 
          if(xhr.status>=200 && xhr.status<=299){ 
             let res=  JSON.parse(xhr.response);
              
             let div= document.createElement('div');
                 div.id= res.id;
                 div.className="col-md-4 mb-5" 
                 div.innerHTML = `<div class="card userCard">
                                    <div class="card-header">
                                        <h5>Name:<span>${newObj.name}</span></h5>
                                    </div>
                                    <div class="card-body">
                                    <img src="./image/user.png" alt="">
                                    <h5>User Name:<span>${newObj.username}</span></h5>
                                    <h5>Email:<span>${newObj.email}</span></h5>
                                    <h5>Contact:<span>${newObj.contact}</span></h5>
                                    
                                    </div>

                                    <div class="card-footer d-flex justify-content-between">
                                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-light">Edit </button>
                                        <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete </button>

                                    </div>
                                </div>`
                
               userContainer.prepend(div); 
               spinner.classList.add('d-none')
               userForm.reset();
               snackbar('User added successfully...!','success')
                 
            }else{
               spinner.classList.add('d-none')
               snackbar('User submit failed...!','error')

            }
       }
}

function onRemove(ele){ 
       let removeId= ele.closest('.col-md-4').id ;
       let removeUrl= `${base_url}/users/${removeId}`;


        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed) { 

                let xhr = new XMLHttpRequest(); 
                    xhr.open('DELETE',removeUrl);
                   xhr.send(null); 
         
                   xhr.onload = function(){ 
                      if(xhr.status>=200 && xhr.status<=299){ 
                            ele.closest('.col-md-4').remove();    
                             snackbar('user deleted successfully...!','success'); 
                        }
                  
                   }
               }
            });





}

function onEdit(ele){ 
            let editId= ele.closest('.col-md-4').id;
               localStorage.setItem('EditId', editId);
            
            let editUrl = `${base_url}/users/${editId}`;
             spinner.classList.remove('d-none');
          let xhr = new XMLHttpRequest(); 
              xhr.open('GET',editUrl); 
             
              xhr.setRequestHeader('content-type','application/json');
              xhr.setRequestHeader('Auth','Get token from');
        

              xhr.send(null);
              
              xhr.onload = function(){ 
                 if(xhr.status>=200 && xhr.status<=299){ 
                    let editObj = JSON.parse(xhr.response);
                
                      nameControl.value =  editObj.name ;
                      usernameControl.value =  editObj.username ;
                      emailControl.value =  editObj.email ;
                      contactControl.value =  editObj.phone;
                      
                     addUser.classList.add('d-none');
                     updateUser.classList.remove('d-none');
                  
                     window.scrollTo({top:0,behavior:'smooth'});
                     spinner.classList.add('d-none');
                    // snackbar('','success');                          
                     
                    }else{ 
                      spinner.classList.add('d-none');
                       snackbar('failed to Edit user','error');                          
                 }
              }

}








function onUpdate(){ 
      let updateId= localStorage.getItem('EditId');
      let updateUrl = `${base_url}/users/${updateId}`;

      let updateObj = { 
                 name:nameControl.value , 
                 username:usernameControl.value ,
                 email:emailControl.value ,
                 contact:contactControl.value 

      }
        spinner.classList.remove('d-none');

      let xhr = new XMLHttpRequest();
          xhr.open('PATCH', updateUrl);
          xhr.send(JSON.stringify(updateObj));

        xhr.onload= function(){ 
            if(xhr.status>=200 && xhr.status<=299){ 
                let col= document.getElementById(updateId);
                    col.innerHTML =`<div class="card userCard">
                                    <div class="card-header">
                                        <h5>Name:<span>${updateObj.name}</span></h5>
                                    </div>
                                    <div class="card-body">
                                    <img src="./image/user.png" alt="">
                                    <h5>User Name:<span>${updateObj.username}</span></h5>
                                    <h5>Email:<span>${updateObj.email}</span></h5>
                                    <h5>Contact:<span>${updateObj.contact}</span></h5>
                                    
                                    </div>

                                    <div class="card-footer d-flex justify-content-between">
                                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-light">Edit </button>
                                        <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete </button>

                                    </div>
                                </div>`   


                    addUser.classList.remove('d-none');
                    updateUser.classList.add('d-none');
                    
                    userForm.reset();
                    spinner.classList.add('d-none');
              
                    col.scrollIntoView({behavior:'smooth',block:'center'});
                    let card = document.querySelector('.userCard')  
                    col.style.border=`2px solid blueviolet`;
                       setTimeout(()=>{ 
                    //   let col= document.querySelector('.card');
                        col.style.border='';
                             
                       },4000)

                    snackbar('User updated successfully..!','success')

            }else{
                spinner.classList.add('d-none');
                snackbar('Failed to update user','error')
            }
        }  
}











userForm.addEventListener('submit', onSubmit);
updateUser.addEventListener('click', onUpdate);