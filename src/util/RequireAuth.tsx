import { useLocation, Navigate, Outlet } from "react-router-dom";
import { RootState, useAppSelector } from "@/store";

const RequireAuth = (allowedRoles:any) => {
    const {isLoggedIn} = useAppSelector((store:RootState) => store.session);
    const location = useLocation();
		
    return (
        isLoggedIn
            ? <Outlet />
            : <Navigate to="/notAuth" state={{ from: location }} replace />
    );

    // return (
    //     auth?.roles?.find(role => allowedRoles?.includes(role))
    //         ? <Outlet />
    //         : auth?.user
    //             ? <Navigate to="/unauthorized" state={{ from: location }} replace />
    //             : <Navigate to="/login" state={{ from: location }} replace />
    // );
}

export default RequireAuth;