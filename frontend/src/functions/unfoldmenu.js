const unfoldMenu = () =>{
    // console.log('UNFOLD0');
    // isOpen = !isOpen;
    // setTimeout(200);
    if(window.innerWidth <= 1100){

        const menu = document.querySelector('.mobile_menu');
        const btn = document.querySelector('.mobile-toggle-btn');
        const doc = document.querySelector('html');
        const docBody = document.querySelector('body');
        const root = document.querySelector('#root');

        // console.log(isOpen);
        if(sessionStorage.getItem('isOpen')=='false'){ 
            menu.classList.remove('disabled-menu');
            btn.classList.add('active-btn');
            doc.style.overflow = 'hidden';
            docBody.style.overflow = 'hidden';
            sessionStorage.setItem('isOpen','true');

            // console.log('UNFOLD1');
        }else if(sessionStorage.getItem('isOpen')=='true'){
            menu.classList.add('disabled-menu');
            btn.classList.remove('active-btn');
            doc.style.overflowY = 'auto';
            docBody.style.overflowY = 'auto';
            sessionStorage.setItem('isOpen','false');
            // console.log('UNFOLD2');
        }
    }
}

export default unfoldMenu;