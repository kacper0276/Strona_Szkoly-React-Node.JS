const Cookies = () =>{

    const hideCookie = () =>{
        const a = document.querySelector('.cookie-cnt');
        a.style = 'display: none';
    }

    return (
        <div className="cookie-cnt">
            <div className="cookie-info">
                <img src="./images/cookie.png" alt='cookie' />
                <p>Strona korzysta z plików cookie w celu realizacji usług zgodnie z <a href="http://wszystkoociasteczkach.pl/polityka-cookies/">Polityką Cookies</a>. Możesz określić warunki przechowywania lub dostępu mechanizmu cookie w Twojej przeglądarce.</p>
                <button onClick={hideCookie}>OK</button>
            </div>
        </div>
    )
}

export default Cookies;