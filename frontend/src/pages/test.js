import { useParams } from "react-router-dom";

const Test = () =>{
    let {name} = useParams();

    return(
      <> 
        <h1>Test</h1>
        <h2>{name}</h2>
      </>
    )
  }
  
export default Test;