/* global chrome */
const storageComunicator = {
    authToken: {
        set: (authTokens) => {
            // chrome.storage.local.set({authTokens: JSON.stringify(authTokens)});
            localStorage.setItem('authTokens', JSON.stringify(authTokens));
        },
        get: () => {
            // return new Promise((resolve, reject) => {
            //     chrome.storage.local.get('authTokens', (result) => {
            //         resolve(JSON.parse(result.authTokens));
            //     });
            // });
            return JSON.parse(localStorage.getItem('authTokens'));
        },
        delete: () => {
            // chrome.storage.local.remove('authTokens');
            localStorage.removeItem('authTokens');
        }
    },
    company: {
        set_info: (info) => {
            // chrome.storage.local.set({company: JSON.stringify(company)});
            localStorage.setItem('companyInfo', JSON.stringify(info));
        },
        get_info: () => {
            // return new Promise((resolve, reject) => {
            //     chrome.storage.local.get('company', (result) => {
            //         resolve(JSON.parse(result.company));
            //     });
            // });
            return JSON.parse(localStorage.getItem('companyInfo'));
        },
        set_departments: (departments) => {
            // chrome.storage.local.set({departments: JSON.stringify(departments)});
            localStorage.setItem('departments', JSON.stringify(departments));
        },
        get_departments: () => {
            // return new Promise((resolve, reject) => {
            //     chrome.storage.local.get('departments', (result) => {
            //         resolve(JSON.parse(result.departments));
            //     });
            // });
            
            
            return JSON.parse(localStorage.getItem('departments'));
        }

    }
}

export default storageComunicator;