import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation, Routes, Route } from "react-router-dom"
import { Detail } from "./detail/detail";
import { List } from "./list/List";
import { Write } from './write/Write';
import './board.scss';

export const Board:React.FC = ():JSX.Element => {
    const { uuid } = useParams();   
    const uid =  window.sessionStorage.getItem('uuid');
    const navigate = useNavigate();
    const { search } = useLocation();
    const nowPage = search === ''? 0: parseInt(search.split('=')[1])-1;
    const [page, setPage] = useState<number>(nowPage);

    useEffect(() => {  
        if (uuid !== uid) navigate('/');
        setPage(nowPage);        
    }, [search, uuid, uid, navigate, setPage, nowPage]);
    
    return(
        <div className="notice">
            <div className="notice-header">
                <Link to={'/'+uuid}>
                    <span>게시판</span>
                </Link>
            </div>
            <div className="notice-area">
                <Routes>
                    <Route path='' element={<List page={nowPage} setPage={setPage}/>}/>
                    <Route path=':id' element={<Detail/>}/>
                    <Route path='write' element={<Write/>}/>
                    <Route path=':id/mod' element={<Write/>}/>
                </Routes>
            </div>
        </div>
    );
}