import { Routes, Route, Navigate } from 'react-router-dom';
import { Access } from './components/access/Access';
import { Board } from './components/board/Board';
import './app.scss';

export const App = () => {
  return (
    <Routes>
      <Route path='/'>
        <Route path='' element={<Access />}/>
        <Route path=':uuid/*' element={<Board/>}/>
      </Route>

      {/* 404 에러 라우팅 */}
      <Route path='/*' element={<Navigate replace to='/'/>}/>
    </Routes>
  );
}