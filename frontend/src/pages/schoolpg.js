import { useParams } from "react-router-dom";
import { useEffect, useState, useLayoutEffect } from "react";
import { useLocation } from 'react-router-dom'
//Blocks
import SchBlock from "../components/schblock";
//URL
import { url } from "../App";
import markActive from "../functions/markactive.js"
import setTitle from "../functions/set-title";

const SchTemplate = () =>{
  let {name} = useParams();

  useLayoutEffect(()=>{
    markActive(name);
  },[name]);

  const [blocks,setBlocks] = useState([]);

  useEffect(()=>{
    fetch(`${url}/szkoly/${name}`)
        .then(response => response.json())
        .then(response =>{
          let tempBlocks = [];
          response.dataBuilding.forEach((tile) => {
            tempBlocks.push(<SchBlock key={tile.id} title={tile.name} src={tile.img} link={tile.link} type={tile.type}/>);
          });
          setBlocks(tempBlocks);
          let title1 = response.title.slice(1);
          setTitle(response.title[0].toUpperCase()+title1);
    });
  },[name]);

  return(
      <> 
        <div className="school-page-cnt">
          {blocks.map((block)=>{
            return block;
          })}
        </div>
      </>
    )
  }
  
export default SchTemplate;