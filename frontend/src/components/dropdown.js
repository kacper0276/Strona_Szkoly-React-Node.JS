import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import unfoldMenu from "../functions/unfoldmenu";


const Dropdown = ({ tab }) =>{

    const [dropdown, setDropdown] = useState([]);

    useEffect(()=>{
        let temp = [];

        for(let i = 1; i<Object.keys(tab).length;i++){
            if(tab[i].linkType == 'outside'){
                temp.push(<a href={tab[i].path} target='_blank' key={tab[i].path}>{tab[i].nazwa}</a>);
            }else{
                temp.push(<Link to={tab[i].path} key={tab[i].path} onClick={unfoldMenu}>{tab[i].nazwa}</Link>);
            }      
        }

        setDropdown(temp);
    },[])

    return (
        <>
        <div className="drop-down-cnt">
            <input type={'checkbox'} className='trigger'/>
            <span className="drop-down-title">{tab[0].nazwa}</span>
            <div className="drop-down-content">
                {
                    dropdown.map((item)=>{
                        return item;
                    })
                }
            </div>
        </div>            
        </>
    )
}

export default Dropdown;