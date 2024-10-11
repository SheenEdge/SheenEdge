import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDet, logout } from '../redux/slice/userSlice';

export const setUser = async () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const response = await fetch("http://localhost:5800/api/user/current", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(setUserDet({ name: data.name, _id: data._id, email: data.email }));
        console.log('User Found:', user);
    } 
};

export const signout = async (dispatch) => {
    const response = await fetch("http://localhost:5800/api/user/logout", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        dispatch(logout());
        console.log("Logged out")
    } else {
        console.error('Error fetching user data');
    }
};


export const isLoggedIn = () =>{
    const user = useSelector((state: RootState) => state.user);
    if(!user){
        return false;
    }
    return true;
}