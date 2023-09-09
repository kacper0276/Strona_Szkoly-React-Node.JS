import {useEffect, useState, useLayoutEffect} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
    Autoplay,Pagination,Navigation
  } from 'swiper';
import { url } from "../App";
import calcHeight from "../functions/calcheight";
import { Link } from "react-router-dom"; 
SwiperCore.use([Autoplay,Pagination,Navigation]);

const Footer = () => {

    const [sponsorAmount,setSponsorAmount] = useState(Math.floor(window.innerWidth/(window.innerWidth>400 ? 130 : 100)));

    const calcSponsor = () =>{
        let slideWidth;
        if(window.innerWidth>400)
            slideWidth=130;
        else 
            slideWidth=100;
        setSponsorAmount(Math.floor(window.innerWidth/slideWidth));
    }
    
    useEffect(()=>{
        window.addEventListener('resize',calcSponsor);
        return ()=>{
            window.removeEventListener('resize',calcSponsor);
        };
    });

    const [sponsor,setSponsor] = useState([]);

    useEffect(()=>{
        fetch(`${url}`)
        .then(response => response.json())
        .then(response=>{
            let temp = [];
            response.data.footer.map((partner)=>{
                temp.push(partner); 
            });
            temp = temp.concat(temp);
            setSponsor(temp);
        })
    },[]);

    return (
        <footer className="footer" onLoad={calcHeight}>
            <Swiper spaceBetween={30} slidesPerView={sponsorAmount} centeredSlides={false} autoplay={{
                "delay": 2500,
                "disableOnInteraction": false
                }}  
                loop={true}
                grabCursor={true}
                speed={1500}
                className="mySwiper">
                    {
                        sponsor.map((picture)=>{
                            return <SwiperSlide><a href={picture.link} target='_blank'><img src={`/partners/${picture.path}`} alt={picture.alt}/></a></SwiperSlide>
                        })                        
                    }
            </Swiper>
            <div className="footer-btn-cnt">
                <Link to={'/admin'} className='footer-login-btn'>Zaloguj</Link>
                <Link to={'/content/map'} className='footer-map-btn'>Mapa strony</Link>
                <Link to={'/authors'} className='footer-authors'>Autorzy</Link>
            </div>

        </footer>
    )
}

export default Footer;