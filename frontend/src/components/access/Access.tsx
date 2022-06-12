import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './access.scss';

export const Access:React.FC = ():JSX.Element => {
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const onChange = useCallback((e):void => {
        const { value } = e.target;
        setPassword(value);
    }, []);

    const onKeyDown = useCallback((e):void => {
        if(e.key === 'Enter') {      
            axios.post('/access', {password})
            .then(res => {         
                if (res.data) {
                    window.sessionStorage.setItem('uuid', res.data);
                    navigate(res.data);
                } else {
                    alert('패스워드가 틀렸습니다.');
                }
            });
        } 
    }, [password, navigate]);

    return (
        <div className="access">
            <img className="access-icon" src={`${process.env.PUBLIC_URL}/warning.png`} alt="경고 이미지" />
            <div>패스워드를 입력해 주세요.</div>
            <span>C:\2SUE\board&gt;</span>
            <input type="password" onChange={onChange} onKeyDown={onKeyDown} autoFocus />
        </div>
    );
}