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
            <div className="wall-cnt">
                <div className="wall left-wall">
                    <video autoPlay loop muted>
                        <source src="/bgvid.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="wall right-wall">
                    <video autoPlay loop muted>
                        <source src="/bgvid.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="wall bottom-wall">
                    <video autoPlay loop muted>
                        <source src="/bgvid.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="wall top-wall">
                    <video autoPlay loop muted>
                        <source src="/bgvid.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
    )
}

export default Authors;