import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import {Route, Routes} from "react-router-dom";
import PostsByTag from "./pages/PostsByTag.tsx";
import {useAppDispatch} from "./redux/store.ts";
import {useEffect} from "react";
import {checkAuth} from "./redux/slices/auth-slice.ts";
import {ProfilePage} from "./pages/ProfilePage.tsx";
import EditProfile from "./pages/EditProfile.tsx";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(checkAuth());
        }
    }, []);

    return (
        <>
          <Header/>
          <Container maxWidth='lg'>
              <Routes>
                  <Route path='/' element={<Home/>}/>
                  <Route path='/posts/:id' element={<FullPost/>}/>
                  <Route path='/add-post' element={<AddPost/>}/>
                  <Route path='/posts/:id/edit' element={<AddPost/>}/>
                  <Route path='/tags/:tagId' element={<PostsByTag/>}/>
                  <Route path='/register' element={<Registration/>}/>
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/profile/:id' element={<ProfilePage/>}/>
                  <Route path='/profile/edit' element={<EditProfile/>}/>
              </Routes>
          </Container>
        </>
    )
}

export default App
