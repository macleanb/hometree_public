import constants from '../constants';


export const getAuthID = (auth) => {
    if (auth?.user?.id) {
        return auth.user.id;
    }

    return null;
}

export const getAuthEmail = (auth) => {
    if (auth?.user?.email) {
        return auth.user.email;
    }

    return null;
}


export const getAuthFirstName = (auth) => {
    if (auth?.user?.first_name) {
        return auth.user.first_name;
    }

    return null;
}


export const getAuthLastName = (auth) => {
    if (auth?.user?.last_name) {
        return auth.user.last_name;
    }

    return null;
}

/* Takes in permissionsRequired array and ensures
   each required permission is in the list of the user's
   permissions array.  Since user_permissions (ids) and group id data
   elements are passed from the backend, you could set up an API 
   on the backend to get those from the backend rather than sending
   the names separately. */
export const userIsAuthorized = (auth, permissionsRequired) => {
    if (auth?.permissions && permissionsRequired) {
        const userPermissions = auth.permissions;

        for (const p of permissionsRequired) {
            if (!userPermissions.includes(p)) {
                return false;
            }
        }

        return true; // return true if user has all permissions
    } else {
        return false;
    }
}


export const parseAndSetAuth = (auth, setAuth) => {
    if (auth?.permissions) {
        const parsedPermissions = JSON.parse(auth.permissions);
        auth.permissions = parsedPermissions;
        setAuth({
            status: constants.STATUS_AUTHENTICATED,
            user: auth.user,
            permissions: auth.permissions
        });
    } else if (auth?.user) {
        setAuth({
            status: constants.STATUS_AUTHENTICATED,
            user: auth.user
        });
    } else {
        setAuth({
            status: constants.STATUS_NOT_AUTHENTICATED
        });
    }
}
