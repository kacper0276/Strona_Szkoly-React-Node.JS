import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SchBlock = (props) =>{

    // const [link, setLink] = useState();

    // const { name } = useParams();

    // useEffect(()=>{
    //   if(props.type == 'kafel'){
    //     setLink(<Link to={props.link}></Link>);
    //   }else if(props.type == 'download'){
    //     setLink(<a href={props.link} download></a>);
    //   }else if(props.type == 'poziom1'){
    //     setLink(<a href={props.link} target='_blank'></a>);
    //   }
    // },[name]);


    let link;
    
    if(props.type == 'inside'){
      link = <Link to={props.link}></Link>;
    }else if(props.type == 'download'){
      link = <a href={props.link} download></a>;
    }else if(props.type == 'outside'){
      link = <a href={props.link} target='_blank'></a>;
    }

    return(
        <div className="sch-block">
          {/* <Link to={props.link}></Link>  */}
          {link}
          <div className="sch-block-content">
            <img src={`/images/${props.src}`}/>
            <p>{props.title}</p>
          </div>
        </div>
    )
}

export default SchBlock;