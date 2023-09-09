const markActive = (id) =>{
    const element = document.querySelector(`#${id}`);
    const prev = document.querySelector('.active-page-btn');
    if(prev != null && element != null){
        prev.classList.remove('active-page-btn');
        element.classList.add('active-page-btn');
    }else if(prev == null && element != null){  
        element.classList.add('active-page-btn');
    }else if(prev != null && element == null && id == 'none'){
        prev.classList.remove('active-page-btn');
    }

}

export default markActive;