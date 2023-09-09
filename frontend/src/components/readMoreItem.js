import parse from "html-react-parser";
import monthTransform from "../functions/month";

const ReadMoreItem = (props) =>{
    return(
        <div className="content-cnt">
            <div className='news-title-cnt'>
                <h3>{props.title}</h3>
                <div className='news-date-cnt'>
                    <span className="date-elm">{new Date(props.date).getDate()}</span>
                    <span className="date-elm">{monthTransform(new Date(props.date).getMonth())}</span>
                    <span className="date-elm">{new Date(props.date).getFullYear()}</span>
                </div>
            </div>
            <div className='news-item-content'>
                <div className='news-image'>
                    {
                        props.img == 'noimg.svg' ? <img src={`/images/${props.img}`} className='no-img-news'/> : <img src={`/news/${props.img}`}/>
                    }
                </div>
                <div className='news-item-text'>
                    {/* {parse(props.desc)} */}
                    {parse(props.longDesc)}
                </div>
            </div>
        </div>
    )
}
export default ReadMoreItem;