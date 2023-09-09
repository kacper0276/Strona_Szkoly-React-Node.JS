import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { url } from "../App";
import setTitle from "../functions/set-title";
import ReadMoreItem from "../components/readMoreItem";

const ReadMore = () =>{

    const {name, id} = useParams();
    const [item, setItem] = useState();

    useEffect(()=>{
        fetch(`${url}/aktualnosci/czytajwiecej/${name}/${id}`)
        .then(response => response.json())
        .then(response =>{
            setItem(<ReadMoreItem  title={response.article[0].title} date={response.article[0].date} img={response.article[0].img} desc={response.article[0].shortdes} longDesc={response.article[0].longdes} key={response.article[0].id} />);
            setTitle(response.title);
        })
    },[]);

    let nav = useNavigate();

    return(
        <div className="read-more-cnt">
            <div className="return-btn-cnt">
                <button className="return-btn" onClick={()=>nav(-1)}>
                    &#60;&#60; Powrót
                </button>
            </div>
            {
                item
            }
        </div>
    )
}
export default ReadMore;