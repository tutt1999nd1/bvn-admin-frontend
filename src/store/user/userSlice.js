import {createSlice} from '@reduxjs/toolkit';
import login from "../../api/auth/login";
import {clearToken} from "../../constants/common";
import dayjs from "dayjs";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accessToken: '',
        email: 'thanhtu199969@gmail.com',
        username: '',
        roles: [],
        isSignIn: false,
        isLoginFail: false,
        isLoading: false,
        refres: false,
        language: 'en',
        showMenu: true,
        userInfo: {
            "id": 0,
            "username": "",
            "jobTitle": "",
            "phoneNumber": "",
            "email": "",
            "fullName": "",
        },
        documentSearch: {
            time: {
                start: (new dayjs).startOf('year'),
                end: (new dayjs).endOf('year'),
            },
            sortField: null,
            sortDirection: null,
            organizationId: null,
            organizationExpanded: {0: true},
            repositoryId: null,
            repositoryExpanded: {0: true},
            defaultSearch: {
                name: "",
                symbol: "",
                description: "",
                documentNumber: "",
                signer: "",
                totalCopies: "",
                typeDocumentId: null,
                urgencyId: null,
                formDocumentId: null,
                branchId: null,
                securityId: null,
                organizationId: null,
                organizationName:""
            }
        }, userSearch: {
            currentPage:0,
            limitOfPage:10,
            searchUsername:"",
            searchFullName:""
        },
        carSearch: {
            time: {
                start: (new dayjs).startOf('year'),
                end: (new dayjs).endOf('year'),
            },
            sortField: null,
            sortDirection: null,
            organizationId: null,
            organizationExpanded: {0: true},
            repositoryId: null,
            repositoryExpanded: {0: true},
            defaultSearch: {
                "id": "",
                "name": "",
                "numberOfEngines": "",
                "modelYear": "",
                "color": "",
                "licensePlate": "",
                "fuelConsumption": "",
                "fuelStandard": "",
                "chassisNumber": "",
                "engineNumber": "",
                "address": "",
                "description": "",
                "status": null,
                brandId: null,
                typeId: null,
                organizationId: null,
            }
        },
        expenseSearch: {
            time: {
                start: (new dayjs).startOf('year'),
                end: (new dayjs).endOf('year'),
            },
            sortField: null,
            sortDirection: null,
            organizationId: null,
            organizationExpanded: {0: true},
            repositoryId: null,
            repositoryExpanded: {0: true},
            defaultSearch: {
                "id": "",
                "name": "",
                "description": "",
                createdBy: "",
                typeExpenseId: "",
                typeExpenseName: "",
                carId: "",
                carName: "",
                organizationId: null,
            }
        },
        transferSearch: {
            time: {
                start: (new dayjs).startOf('month'),
                end: (new dayjs).endOf('month'),
            },
            sortField: null,
            sortDirection: null,

            defaultSearch: {
                name: "",
                description: "",
                reason: "",
                code: "",
                status: "",
                transferTo: "",
                transferBy: "",
                type:"transferTo"
            }
        }
        ,

        advanceSearch: {
            name: "",
            time: {
                start: (new dayjs).startOf('month'),
                end: (new dayjs).endOf('month'),
            },
            groupId: null,
            groupExpanded: {0: true},
            organizationId: null,
            organizationExpanded: {0: true},
            sortField: null,
            sortDirection: null
        },

    },
    reducers: {
        updateProjectRedux: (state, action) => {
            state.project.id = action.payload.id;
            state.project.name = action.payload.name;
            state.project.urlImg = action.payload.urlImg;
        },
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        updateLanguage: (state, action) => {
            state.language = action.payload;
        },
        updateLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        logout: (state, action) => {
            state.accessToken = '';
            state.isSignIn = false;
            clearToken();
            state.roles = []
        },
        updateToken: (state, action) => {
            state.accessToken = action.payload;
        },
        updateRole: (state, action) => {
            state.roles = action.payload;
            state.isSignIn = true;
        },
        updateIsSignIn: (state, action) => {
            state.isSignIn = action.payload
        },
        updateUsername: (state, action) => {
            state.username = action.payload
        },
        updateEmail: (state, action) => {
            state.email = action.payload
        },
        updateShowMenu: (state, action) => {
            state.showMenu = action.payload
        },
        updateRefresh: (state) => {
            state.refresh = !state.refresh
        },
        changeSettingColumnSlice: (state, action) => {
            state.expenseSearch.columnTableExpense = action.payload
        },
        updateDossierSearch: (state, action) => {
            if (action.payload.type == "time") {
                state.dossierSearch.time = action.payload.data;
            } else if (action.payload.type == "sortField") {
                state.dossierSearch.sortField = action.payload.data;
            } else if (action.payload.type == "sortDirection") {
                state.dossierSearch.sortDirection = action.payload.data;
            } else if (action.payload.type == "organization") {
                state.dossierSearch.organizationId = action.payload.data;
            } else if (action.payload.type == "organizationExpanded") {
                state.dossierSearch.organizationExpanded = action.payload.data;
            } else if (action.payload.type == "repositoryExpanded") {
                state.dossierSearch.repositoryExpanded = action.payload.data;
            }
            else if (action.payload.type == "repository") {
                state.dossierSearch.repositoryId = action.payload.data;
            }
        },
        updateDocumentSearch: (state, action) => {
            if (action.payload.type == "time") {
                state.documentSearch.time = action.payload.data;
            } else if (action.payload.type == "sortField") {
                state.documentSearch.sortField = action.payload.data;
            } else if (action.payload.type == "sortDirection") {
                state.documentSearch.sortDirection = action.payload.data;
            } else if (action.payload.type == "organization") {
                state.documentSearch.organizationId = action.payload.data;
            } else if (action.payload.type == "organizationExpanded") {
                state.documentSearch.organizationExpanded = action.payload.data;
            } else if (action.payload.type == "repositoryExpanded") {
                state.documentSearch.repositoryExpanded = action.payload.data;
            }
            else if (action.payload.type == "repository") {
                state.documentSearch.repositoryId = action.payload.data;
            }
        },
        updateCarSearch: (state, action) => {
            if (action.payload.type == "time") {
                state.carSearch.time = action.payload.data;
            } else if (action.payload.type == "sortField") {
                state.carSearch.sortField = action.payload.data;
            } else if (action.payload.type == "sortDirection") {
                state.carSearch.sortDirection = action.payload.data;
            } else if (action.payload.type == "organization") {
                state.carSearch.organizationId = action.payload.data;
            } else if (action.payload.type == "organizationExpanded") {
                state.carSearch.organizationExpanded = action.payload.data;
            } else if (action.payload.type == "repositoryExpanded") {
                state.carSearch.repositoryExpanded = action.payload.data;
            }
            else if (action.payload.type == "repository") {
                state.carSearch.repositoryId = action.payload.data;
            }
        },
        updateExpenseSearch: (state, action) => {
            if (action.payload.type == "time") {
                state.expenseSearch.time = action.payload.data;
            } else if (action.payload.type == "sortField") {
                state.expenseSearch.sortField = action.payload.data;
            } else if (action.payload.type == "sortDirection") {
                state.expenseSearch.sortDirection = action.payload.data;
            } else if (action.payload.type == "organization") {
                state.expenseSearch.organizationId = action.payload.data;
            } else if (action.payload.type == "organizationExpanded") {
                state.expenseSearch.organizationExpanded = action.payload.data;
            } else if (action.payload.type == "repositoryExpanded") {
                state.expenseSearch.repositoryExpanded = action.payload.data;
            }
            else if (action.payload.type == "repository") {
                state.expenseSearch.repositoryId = action.payload.data;
            }
        },
        updateTransferSearch: (state, action) => {
            if (action.payload.type == "time") {
                state.transferSearch.time = action.payload.data;
            } else if (action.payload.type == "sortField") {
                state.transferSearch.sortField = action.payload.data;
            } else if (action.payload.type == "sortDirection") {
                state.transferSearch.sortDirection = action.payload.data;
            }
        },
        updateUserSearch: (state, action) => {
            if (action.payload.type == "currentPage") {
                state.userSearch.currentPage = action.payload.data;
            } else if (action.payload.type == "limitOfPage") {
                state.userSearch.limitOfPage = action.payload.data;
            }
            else if (action.payload.type == "searchUsername") {
                state.userSearch.searchUsername = action.payload.data;
            }
            else if (action.payload.type == "searchFullName") {
                state.userSearch.searchFullName = action.payload.data;
            }
        },
        updateDefaultSearch: (state, action) => {
            state.expenseSearch.defaultSearch = action.payload;
        },
        updateDefaultSearchDossier: (state, action) => {
            state.dossierSearch.defaultSearch = action.payload;
        },
        updateDefaultSearchDocument: (state, action) => {
            state.documentSearch.defaultSearch = action.payload;
        },
        updateDefaultSearchCar: (state, action) => {
            state.carSearch.defaultSearch = action.payload;
        },
        updateDefaultSearchExpense: (state, action) => {
            state.expenseSearch.defaultSearch = action.payload;
        },
        updateDefaultSearchTransfer: (state, action) => {
            state.transferSearch.defaultSearch = action.payload;
        },
        updateAdvanceSearch: (state, action) => {
            if (action.payload.type == "time") {
                state.advanceSearch.time = action.payload.data;
            } else if (action.payload.type == "organization") {
                state.advanceSearch.organizationId = action.payload.data;
            } else if (action.payload.type == "organizationExpanded") {
                state.advanceSearch.organizationExpanded = action.payload.data;
            } else if (action.payload.type == "name") {
                console.log("Redux", action.payload.data)
                state.advanceSearch.name = action.payload.data;
            } else if (action.payload.type == "group") {
                state.advanceSearch.groupId = action.payload.data;
            } else if (action.payload.type == "time") {
                state.advanceSearch.time = action.payload.data;
            } else if (action.payload.type == "sortField") {
                state.advanceSearch.sortField = action.payload.data;
            } else if (action.payload.type == "sortDirection") {
                state.advanceSearch.sortDirection = action.payload.data;
            }
        }
    },
    extraReducers: {
        [login.fulfilled]: (state, action) => {
            state.accessToken = action.payload.data.accessToken
            localStorage.setItem('accessToken', action.payload.data.accessToken)
            localStorage.setItem('accessTokenExp', action.payload.data.accessTokenExp)
            localStorage.setItem('refreshToken', action.payload.data.refreshToken)
            localStorage.setItem('refreshTokenExp', action.payload.data.refreshTokenExp)
            state.isLoading = false;
            state.isLoginFail = false;
        },
        [login.rejected]: (state, action) => {
            state.isLoading = false;
            state.isLoginFail = true;
        },
        [login.pending]: (state, action) => {
            state.isLoading = true
            // state.current = action.payload || {};
        },
    }
})
export default userSlice.reducer;
export const {
    updateRefresh,
    updateShowMenu,
    updateToken,
    updateProjectRedux,
    updateLanguage,
    logout,
    updateLoading,
    updateRole,
    updateUsername,
    updateUserInfo,
    updateDefaultSearchDocument,
    updateDefaultSearchCar,
    updateCarSearch,
    updateDefaultSearchExpense,
    updateExpenseSearch,
    updateDocumentSearch,
    updateUserSearch
} = userSlice.actions;
