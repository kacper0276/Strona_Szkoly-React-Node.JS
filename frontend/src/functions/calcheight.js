const calcHeight = () =>{
    if(window.innerHeight > 750){
        let menuHeight = document.querySelector('.menu').offsetHeight;
        let footerHeight = document.querySelector('.footer').offsetHeight;
        document.querySelector('.main-slider').style.minHeight = `calc(100vh - ${footerHeight + menuHeight}px`;
    }else{
        document.querySelector('.main-slider').style.minHeight = 650 + 'px';
    }
}
export default calcHeight;