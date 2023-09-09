import calcHeight from "./functions/calcheight";
import './css/authors.css';

const Authors = () =>{

    if(localStorage.getItem('contrast')){
        const doc = document.querySelector('html');
        doc.classList.remove('contrast');
        localStorage.setItem('contrast',0);
    }

    return(
        <div className="main-authors-cnt">
            <div className="auth-cube-cnt">
                <div className="auth-cube from-top1">
                    <div className="auth-panel front"></div>
                    <div className="auth-panel top"><h1>AUTOR</h1></div>
                    <div className="auth-panel bottom"></div>
                </div>
                <div className="auth-cube from-bottom2">
                    <div className="auth-panel front"></div>
                    <div className="auth-panel top"></div>
                    <div className="auth-panel bottom"><h1>AUTOR</h1></div>
                </div>
                <div className="auth-cube from-bottom1">
                    <div className="auth-panel front"></div>
                    <div className="auth-panel top"></div>
                    <div className="auth-panel bottom"><h1>AUTOR</h1></div>
                </div>
                <div className="auth-cube from-top2">
                    <div className="auth-panel front"></div>
                    <div className="auth-panel top"><h1>AUTOR</h1></div>
                    <div className="auth-panel bottom"></div>
                </div>
            </div>
        </div>
    )
}

export default Authors;