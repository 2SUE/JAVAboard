import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { IBoardTypes } from '../../Interfaces';
import axios from 'axios';
import { log } from "console";

export const Item:React.FC<IBoardTypes> = ({id, title, reg_date, view_count, state}:IBoardTypes):JSX.Element => {
    const { uuid } = useParams();

    const viewCount = () => {
        axios.post(`/${uuid}/updViewCount`, {id});
    }

    return(
        <tr className={state? '': 'delete'}>
            <td>{id}</td> 
            <td className="left"><Link to={''+id} onClick={viewCount}>{title}</Link></td>
            <td className="none">{reg_date?.substring(0, 10)}</td> 
            <td className="none">{view_count}</td>
        </tr>
    );
}