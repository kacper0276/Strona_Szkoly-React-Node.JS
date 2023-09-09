import calcHeight from "./functions/calcheight";
import './css/authors.css';
import { useEffect } from "react";
import setTitle  from "./functions/set-title.js";
import { useLocation } from "react-router-dom";
const Authors = () =>{

    if(localStorage.getItem('contrast')){
        const doc = document.querySelector('html');
        doc.classList.remove('contrast');
        localStorage.setItem('contrast',0);
    }

    useEffect(()=>{
        setTitle("Autorzy");
    },[]);

    useEffect(()=>{
        const cnt = document.querySelector('.main-auth-cnt');
        cnt.addEventListener('mousemove', (e)=>calcSkew(e));
        return ()=>{
            cnt.removeEventListener('mousemove', (e)=>calcSkew(e));
        };
    },[]);

    const calcSkew = (e) =>{
        const cnt = document.querySelector('.title-auth');
        const skewY = e.clientX - (window.innerWidth/2);
        const skewX = e.clientY - (window.innerHeight*0.01);
        cnt.style.transform = `rotateY(${skewY/10}deg) rotateX(${-skewX/10}deg)`; 
    }

    return(
        <div className="main-auth-cnt">
            {/* <video autoPlay muted loop playsInline>
                <source src="./bgvid7.mp4" type="video/mp4"/>
            </video> */}
            <div className="vid-div" dangerouslySetInnerHTML={{ __html: `
                <video
                muted="true"
                autoplay="true"
                playsinline="true"
                loop="true"
                />
                <source src="./bgvid7.webm" type=video/webm> 
                ` 
            }}
            />
            <div className="title-auth-cnt">
                <div className="title-auth">Autorzy</div>
            </div> 
            <div className="auth-cnt desc1">
                {/* <span>Jakub Michalak</span> */}
                <span className="auth-inf">Jakub Michalak</span>
                <svg>
                    <text x="50%" y="50">Koordynator projektu</text>
                </svg>

            </div>
            <div className="auth-cnt desc2">
                <span>Klaudiusz Przybylski</span>
                {/* <span className="auth-inf">Grafika</span> */}
                <svg>
                    <text x="50%" y="50">Grafika</text>
                </svg>
            </div>
            <div className="auth-cnt desc3">
                <span>Kacper Renkel</span>
                {/* <span className="auth-inf">JS, NodeJS, ExpressJS, SQL</span> */}
                <svg>
                    <text x="50%" y="50">JS, NodeJS, ExpressJS, SQL</text>
                </svg>
            </div>
            <div className="auth-cnt desc4">
                <span>Karol Dołasiński</span>
                {/* <span className="auth-inf">JS, HTML, CSS, ReactJS</span> */}
                <svg>
                    <text x="50%" y="50">JS, HTML, CSS, ReactJS</text>
                </svg>
            </div>
        </div>
    )
}

export default Authors;