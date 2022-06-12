import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Item } from "../Item/Item";
import { Link } from 'react-router-dom';
import axios from 'axios'
import './list.scss';
import { IBoardTypes } from "../../Interfaces";

interface IPageProp {
    page: number;
    setPage: any;
}

export const List:React.FC<IPageProp> = ({page, setPage}:IPageProp):JSX.Element => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState<IBoardTypes[]>([]);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(1);

    useEffect(() => {
        axios.get(`/${uuid}/selList`, { params: {page} })
       .then(res => {         
            let resBoard: IBoardTypes[] = [];
            for (let i = 0; i < res.data[1].length ; i++) {
                resBoard[i] = {
                    id: res.data[1][i].id,
                    title: res.data[1][i].title,
                    reg_date: res.data[1][i].reg_date,
                    state: res.data[1][i].state,
                    view_count: res.data[1][i].view_count
                } 
            }  
            setList(resBoard);

            const totalCount:number = res.data[0];
            setTotal(totalCount);
            setLimit(Math.ceil(totalCount / 10));
        }); 
    }, [uuid, page]);    

    return (    
        <div className="noticeList">
            <div className="noticeList-head">
                <div>공지글 {total}개</div>
                <Link to={'write'} className="btn">글쓰기</Link>
            </div>

            <div className="noticeList-items">
                <table>
                    <thead>
                        <tr>
                            <td className="table-id">글번호</td>
                            <td>제목</td>
                            <td className="none">날짜</td>
                            <td className="none">조회수</td>
                        </tr>
                    </thead>

                    <tbody>
                        {list.map(item => {
                            return <Item 
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        content={item.content}
                                        reg_date={item.reg_date}
                                        view_count={item.view_count}
                                        state={item.state}
                                    />
                        })}
                    </tbody>

                    <tfoot>
                        <tr className="noticeList-items-page">
                            <td colSpan={4}>
                                {
                                    limit > 5
                                    ?   
                                    <>
                                        {
                                            page < 1
                                            ? <a>◂</a>
                                            : <Link to={'?page='+(page)} onClick={() => setPage(page)}>◂</Link>
                                        }

                                        {
                                            ([...Array(limit)].map((p, i) => {
                                                return (
                                                    <Link key={i} to={'?page='+(i+1)} onClick={() => setPage(i)} className={(page === i? 'noticeList-items-page-active': '')}>{i+1}</Link>
                                                )
                                            }))
                                        }

                                        {
                                            page > limit-2
                                            ? <a>▸</a>
                                            : <Link to={'?page='+(page+2)} onClick={() => setPage(page+1)}>▸</Link>
                                        }
                                    </>
                                    :
                                    ([...Array(limit)].map((p, i) => {
                                        return (
                                            <Link key={i} to={'?page='+(i+1)} onClick={() => setPage(i)} className={(page === i? 'noticeList-items-page-active': '')}>{i+1}</Link>
                                        )
                                    }))
                                }
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}