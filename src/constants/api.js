// export const API_DOMAIN = 'http://localhost:8443/';
// export const DOMAIN = 'http://localhost:3000/';
export const DOMAIN = 'https://bvn-admin.aceoffice.vn/';
export const API_DOMAIN = 'https://bvn-admin.aceoffice.vn/api/';
const API_MAP = {
    LOGIN: API_DOMAIN + 'auth/login',
    REFRESH_TOKEN: API_DOMAIN + 'auth/refresh-token',
    GET_USER_INFO: API_DOMAIN + 'user/get-user-info',
    OAUTH2_MICROSOFT: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" +
        "?client_id=873e9530-8931-4ca7-98a1-a7c7415dae76" +
        "&response_type=token" +
        "&scope=openid profile email User.Read.All" +
        "&redirect_uri=" + API_DOMAIN + "callback/oauth2/microsoft"+
        "&prompt=login"+"" +
        "&state=12345",
    GET_LIST_USER: API_DOMAIN +"user/search",
    CHANGE_ACTIVE_USER:API_DOMAIN+"user/change-active",
    CHANGE_ACTIVE_ADVANCE:API_DOMAIN+"advance/change-active",
    GET_LIST_ROLE:API_DOMAIN+"role/search",
    CREATE_USER:API_DOMAIN+"user/create",
    UPDATE_USER:API_DOMAIN+"user/update",
    CREATE_ROLE:API_DOMAIN+"role/create",
    UPDATE_ROLE:API_DOMAIN+"role/update",
    DELETE_ROLE:API_DOMAIN+"role/delete",
    DELETE_USER:API_DOMAIN+"user/delete",
    CHANGE_USER:API_DOMAIN+"user/change-password",
    GET_LIST_PERMISSIONS:API_DOMAIN+"role/permission/get-all",
    GET_ROLE_PERMISSION:API_DOMAIN+"role/permission",
    SET_PERMISSION:API_DOMAIN+"role/set-permission",
    GET_LOGIN_HISTORY:API_DOMAIN+"login-history/search",
    LOGOUT_BY_ADMIN:API_DOMAIN+"login-history/logout-by-admin",
    GET_ORGANIZATION:API_DOMAIN+"organization/get-all",
    GET_ORGANIZATION_BY_USER:API_DOMAIN+"organization/get-by-user",
    GET_CONFIG_EMAIL:API_DOMAIN+"email/get-config-email",
    UPDATE_CONFIG_EMAIL:API_DOMAIN+"email/update",
    CHECK_CONFIG_EMAIL:API_DOMAIN+"email/check-config",

    CREATE_ORGANIZATION:API_DOMAIN+"organization/create",
    UPDATE_ORGANIZATION:API_DOMAIN+"organization/update",
    DELETE_ORGANIZATION:API_DOMAIN+"organization/delete",
    GET_EXPENSE_ORGANIZATION:API_DOMAIN+"organization/get-expense",
    GET_NOTIFICATION:API_DOMAIN+"notification/get",
    READ_NOTIFICATION:API_DOMAIN+"notification/read",
    GET_REPOSITORY_BY_ORGANIZATION:API_DOMAIN+"repository/get-by-organization",
    GET_REPOSITORY_BY_USER:API_DOMAIN+"repository/get-by-user",
    GET_REPOSITORY_BY_USER_PUBLIC:API_DOMAIN+"public/repository/get-repository-boss",
    GET_DETAIL_REPOSITORY:API_DOMAIN+"repository/get-detail",
    CREATE_REPOSITORY:API_DOMAIN+"repository/create",
    UPDATE_REPOSITORY:API_DOMAIN+"repository/update",
    DELETE_REPOSITORY:API_DOMAIN+"repository/delete",
    GET_CATEGORY:API_DOMAIN+"category/search",
    CREATE_CATEGORY:API_DOMAIN+"category/create",
    UPDATE_CATEGORY:API_DOMAIN+"category/update",
    DELETE_CATEGORY:API_DOMAIN+"category/delete",

    GET_CONFIG_TABLE:API_DOMAIN+"table-config/get",
    UPDATE_CONFIG_TABLE:API_DOMAIN+"table-config/update",
    DEFAULT_CONFIG_TABLE:API_DOMAIN+"table-config/create-default",

    SEARCH_PERMISSION:API_DOMAIN+"permission/search",
    CREATE_PERMISSION:API_DOMAIN+"permission/create",
    UPDATE_PERMISSION:API_DOMAIN+"permission/update",
    DELETE_PERMISSION:API_DOMAIN+"permission/delete",

    SCHEDULE_SEARCH:API_DOMAIN+"schedule/search",
    SCHEDULE_GET_DETAIL:API_DOMAIN+"schedule/detail",
    SCHEDULE_CREATE:API_DOMAIN+"schedule/create",
    SCHEDULE_UPDATE:API_DOMAIN+"schedule/update",
    SCHEDULE_DELETE:API_DOMAIN+"schedule/delete",
    SCHEDULE_EXPORT:API_DOMAIN+"schedule/export",

}
export default API_MAP;
