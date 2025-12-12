import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation, useSearchParams} from 'react-router-dom';
import Main from "../pages/Main";

import Forbidden from "../pages/errors/forbidden";
import NotFound from "../pages/errors/notFound";
import ErrorServer from "../pages/errors/errorServer";
import PrivateRoutes from "./PrivateRotes";
import Login from "../pages/authentication/login/Login";
import {useSelector} from "react-redux";
import Oauth2Success from "../pages/authentication/oauth2/OAuth2Success";
import UserPage from "../pages/user/UserPage";
import UserEdit from "../pages/user/UserEdit";
import RolePage from "../pages/role/RolePage";
import RoleEdit from "../pages/role/RoleEdit";
import PermissionPage from "../pages/role/PermissionPage";
import LoginHistoryPage from "../pages/login-history/LoginHistoryPage";
import OrganizationPage from "../pages/organization/OrganizationPage";
import RepositoryPage from "../pages/repository/RepositoryPage";

import EmailPage from "../pages/email/EmailPage";
import PermissionEdit from "../pages/role/permission/PermissionEdit";
import Permission from "../pages/role/permission";
import CategoryPage from "../pages/category/CategoryPage";
import CategoryEdit from "../pages/category/CategoryEdit";
import SchedulePage from "../pages/schedule";
import ScheduleEdit from "../pages/schedule/ScheduleEdit";
import DashboardPage from "../pages/dashboard/DashboardPage";


export default function RenderRoute() {
    const currentUser = useSelector(state => state.currentUser)
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (currentUser.isSignIn != null && currentUser.isSignIn !== "" && currentUser.isSignIn !== undefined) {
            isAuthenticated();
        }
    }, [currentUser])
    const isAuthenticated = () => {
        // Kiểm tra xem JWT đã được lưu trong localStorage hay không
        const isSignIn = currentUser.isSignIn;
        if (isSignIn == true) {
            return true;
        } else return false
    };
    return (
        <Routes>
            <Route
                path="/oauth2/success"
                element={<Oauth2Success></Oauth2Success>}
            />
            <Route
                path="/login"
                element={isAuthenticated() ? <Navigate to={searchParams.get("redirect") || "/"}/> : <Login/>}
            />
            <Route path="/" element={isAuthenticated() ? <Main/> :
                <Navigate to={`login?redirect=${location.pathname + location.search}`}/>}>

                <Route path="dashboard" element={
                    <PrivateRoutes role={'dashboard_view'}>
                        <DashboardPage/>
                    </PrivateRoutes>
                }/>
                <Route path="" element={
                    <PrivateRoutes role={'view_dashboard'}>
                        <UserPage/>
                    </PrivateRoutes>
                }/>

                <Route path="user" element={
                    <PrivateRoutes role={'view_user'}>
                        <UserPage/>
                    </PrivateRoutes>
                }/>
                <Route path="repository" element={
                    <PrivateRoutes role={'view_repository'}>
                        <RepositoryPage/>
                    </PrivateRoutes>
                }/>
                <Route path="user/create" element={
                    <PrivateRoutes role={'create_user'}>
                        <UserEdit isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="user/update" element={
                    <PrivateRoutes role={'edit_user'}>
                        <UserEdit isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="role" element={
                    <PrivateRoutes role={'view_role'}>
                        <RolePage/>
                    </PrivateRoutes>
                }/>
                <Route path="role/create" element={
                    <PrivateRoutes role={'create_role'}>
                        <RoleEdit isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="role/update" element={
                    <PrivateRoutes role={'edit_role'}>
                        <RoleEdit isUpdate={true}/>
                    </PrivateRoutes>
                }/>


                <Route path="role/permission" element={
                    <PrivateRoutes role={'view_role'}>
                        <PermissionPage/>
                    </PrivateRoutes>
                }/>
                <Route path="/login-history" element={
                    <PrivateRoutes role={'view_login'}>
                        <LoginHistoryPage/>
                    </PrivateRoutes>
                }/>
                <Route path="/email" element={
                    <PrivateRoutes role={'manage_email'}>
                        <EmailPage/>
                    </PrivateRoutes>
                }/>
                <Route path="/organization" element={
                    <PrivateRoutes role={'view_organization'}>
                        <OrganizationPage/>
                    </PrivateRoutes>
                }/>

                <Route path="permission" element={
                    <PrivateRoutes role={'edit_role'}>
                        <Permission/>
                    </PrivateRoutes>
                }/>
                <Route path="permission/create" element={
                    <PrivateRoutes role={'edit_role'}>
                        <PermissionEdit isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="permission/update" element={
                    <PrivateRoutes role={'edit_role'}>
                        <PermissionEdit isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="/document-group" element={
                    <PrivateRoutes role={'view_category'}>
                        <CategoryPage type="DocumentGroup"/>
                    </PrivateRoutes>
                }/>
                <Route path="/document-group/create" element={
                    <PrivateRoutes role={'create_category'}>
                        <CategoryEdit type="DocumentGroup" isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="/document-group/update" element={
                    <PrivateRoutes role={'edit_category'}>
                        <CategoryEdit type="DocumentGroup" isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="/document-type" element={
                    <PrivateRoutes role={'view_category'}>
                        <CategoryPage type="DocumentType"/>
                    </PrivateRoutes>
                }/>
                <Route path="/document-type/create" element={
                    <PrivateRoutes role={'create_category'}>
                        <CategoryEdit type="DocumentType" isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="/document-type/update" element={
                    <PrivateRoutes role={'edit_category'}>
                        <CategoryEdit type="DocumentType" isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="/schedule-status" element={
                    <PrivateRoutes role={'view_category'}>
                        <CategoryPage type="ScheduleStatus"/>
                    </PrivateRoutes>
                }/>
                <Route path="/schedule-status/create" element={
                    <PrivateRoutes role={'create_category'}>
                        <CategoryEdit type="ScheduleStatus" isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="/schedule-status/update" element={
                    <PrivateRoutes role={'edit_category'}>
                        <CategoryEdit type="ScheduleStatus" isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="/referral-source" element={
                    <PrivateRoutes role={'view_category'}>
                        <CategoryPage type="ReferralSource"/>
                    </PrivateRoutes>
                }/>
                <Route path="/referral-source/create" element={
                    <PrivateRoutes role={'create_category'}>
                        <CategoryEdit type="ReferralSource" isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="/referral-source/update" element={
                    <PrivateRoutes role={'edit_category'}>
                        <CategoryEdit type="ReferralSource" isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="/schedule" element={
                    <PrivateRoutes role={'manage_schedule_view'}>
                        <SchedulePage/>
                    </PrivateRoutes>
                }/>
                <Route path="/schedule/create" element={
                    <PrivateRoutes role={'manage_schedule_create'}>
                        <ScheduleEdit isUpdate={false}/>
                    </PrivateRoutes>
                }/>
                <Route path="/schedule/update" element={
                    <PrivateRoutes role={'manage_schedule_update'}>
                        <ScheduleEdit isUpdate={true}/>
                    </PrivateRoutes>
                }/>
                <Route path="errors/forbidden" element={<Forbidden/>}/>
                <Route path="errors/notfound" element={<NotFound/>}/>
                <Route path="errors/error-server" element={<ErrorServer/>}/>
                <Route path="*" element={<Navigate to={'/dashboard'}/>}/>
            </Route>
        </Routes>
    )
}