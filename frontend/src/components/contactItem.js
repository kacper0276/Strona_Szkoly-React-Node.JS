import { useState,useEffect } from "react";

const ContactItem = (props) =>{

    const [icon,setIcon] = useState();

    useEffect(
        ()=>{
            if(props.src){
                setIcon(<img src={props.src} alt='ikona'/>)
            }
        },[]
    );

    return(
        <a rel="noopener" href={props.link} className="contact_item">
            {icon}
            <span>{props.content}</span>
            {props.children}
        </a>
    )
}

export default ContactItem;