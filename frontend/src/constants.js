const constants = { 
                    ANNOUNCEMENT_TITLE_FIELD_NAME: 'ANNOUNCEMENT_TITLE_FIELD',
                    ANNOUNCEMENT_BODYTEXT_FIELD_NAME: 'ANNOUNCEMENT_BODYTEXT_FIELD',
                    AUTH_EMAIL_FIELD_NAME: 'AUTH_EMAIL_FIELD',
                    PASSWORD_FIELD_NAME: 'PASSWORD_FIELD',
                    FIRST_NAME_FIELD_NAME: 'FIRST_NAME_FIELD',
                    LAST_NAME_FIELD_NAME: 'LAST_NAME_FIELD',
                    STREET_FIELD_NAME: 'STREET_FIELD',
                    STREET2_FIELD_NAME: 'STREET2_FIELD',
                    CITY_FIELD_NAME: 'CITY_FIELD',
                    ADDR_STATE_FIELD_NAME: 'ADDR_STATE_FIELD',
                    ZIPCODE_FIELD_NAME: 'ZIPCODE_FIELD',
                    IMAGE_FIELD_NAME: 'IMAGE_FIELD',
                    JOINED_DATE_FIELD_NAME: 'JOINED_DATE_FIELD',
                    OWNERINPUT_FIELD_NAME: 'OWNERINPUT_FIELD',
                    RESIDENCEINPUT_FIELD_NAME: 'RESIDENCEINPUT_FIELD',
                    FIELD_NAME_OPTION_INPUT: 'OPTIONINPUT_FIELD',
                    FIELD_NAME_POLICY_STATEMENT: 'POLICY_STATEMENT_FIELD',
                    FIELD_NAME_POLICY_QUESTION: 'POLICY_QUESTION_FIELD',
                    FIELD_NAME_POLICY_DESCRIPTION: 'POLICY_DESCRIPTION_FIELD',
                    FIELD_NAME_POLICY_EFFECTIVE_DATE: 'POLICY_EFFECTIVE_DATE_FIELD',
                    
                    /* For test */
                    //BASE_URL: 'http://localhost:8000/api/v1',

                    /* For production & deployment */
                    BASE_URL: 'http://ec2-3-134-95-76.us-east-2.compute.amazonaws.com/api/v1', // for AWS server

                    LOGIN_URL:                        '/users/login',
                    LOGOUT_URL:                       '/users/logout',
                    REGISTER_URL:                     '/users/register',
                    AUTHENTICATED_USER_URL:           '/users/authenticateduser',
                    USERS_URL:                        '/users/',
                    ADDRESSES_URL:                    '/addresses/',
                    ANNOUNCEMENTS_URL:                '/announcements/',
                    URL_WEATHER:                      '/weather/',
                    POLICIES_URL:                     '/policies/',
                    RESIDENCES_URL:                   '/residences/',
                    ALL_USERS_FOR_ALL_RESIDENCES_URL: '/residences/users/',
                    ALL_RESIDENCES_FOR_ALL_USERS_URL: '/users/residences/',
                    URL_VALIDATE_ADDRESS:             '/validateaddress/',
                    URL_MAP:                          '/map/',

                    FORM_TYPE_USER: 'USER_FORM_TYPE',
                    FORM_TYPE_ADDRESS: 'ADDRESS_FORM_TYPE',
                    FORM_TYPE_ADDRESS_FOR_USER: 'ADDRESS_FORM_TYPE_FOR_USER',
                    FORM_TYPE_ANNOUNCEMENT: 'ANNOUNCEMENT_FORM_TYPE',
                    FORM_TYPE_POLICY: 'POLICY_FORM_TYPE',
                    FORM_TYPE_RESIDENCE: 'RESIDENCE_FORM_TYPE',
                    FORM_TYPE_RESIDENCES_FOR_USER: 'RESIDENCES_FOR_USER',

                    MAP_CENTERPOINT: {
                                        address: "centerpoint",
                                        lat: 38.5575,
                                        lng: -89.905
                                     },
                    MAP_ID: "7f37d99c0c89a31c",

                    MODE_ADDRESS_ADD: 'ADDRESS_ADD_MODE',
                    MODE_ADDRESS_FORM: 'ADDRESS_FORM_MODE', // remove
                    MODE_ADDRESS_UPDATE_DELETE: 'ADDRESS_UPDATE_DELETE_MODE',
                    MODE_ADDRESS_UPDATE: 'ADDRESS_UPDATE_MODE',
                    MODE_ANNOUNCEMENT_ADD: 'ANNOUNCEMENT_ADD_MODE',
                    MODE_ANNOUNCEMENT_UPDATE_DELETE: 'ANNOUNCEMENT_UPDATE_DELETE_MODE',
                    MODE_ASSIGN_OWNERS: 'ASSIGN_OWNERS_MODE',
                    MODE_ASSIGN_RESIDENCES: 'ASSIGN_RESIDENCES_MODE',
                    MODE_POLICY_ADD: 'POLICY_ADD_MODE',
                    MODE_POLICY_UPDATE_DELETE: 'POLICY_UPDATE_DELETE_MODE',
                    MODE_PROMPT_ADD_MAILING_ADDRESS_TO_USER: 'PROMPT_ADD_MAILING_ADDRESS_TO_USER_MODE',
                    MODE_PROMPT_ADD_RESIDENCES_TO_USER: 'PROMPT_ADD_RESIDENCES_TO_USER_MODE',
                    MODE_RESIDENCE_ADD: 'RESIDENCE_ADD_MODE',
                    MODE_RESIDENCE_UPDATE_DELETE: 'RESIDENCE_UPDATE_DELETE_MODE',
                    MODE_USER_ADD: 'USER_ADD_MODE',
                    MODE_USER_FORM: 'USER_FORM_MODE', // remove
                    MODE_USER_PROFILE: 'USER_PROFILE_MODE',
                    MODE_USER_SELF_REGISTER: 'USER_SELF_REGISTER_MODE',
                    MODE_USER_UPDATE_DELETE: 'USER_UPDATE_DELETE_MODE',

                    SIZE_LARGE: 'LARGE_SIZE',

                    STATUS_AWAITING_DATA: 'AWAITING_DATA_STATUS',
                    STATUS_NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
                    STATUS_AUTHENTICATED: 'AUTHENTICATED',

                    /* Address Permissions */
                    PERMISSIONS_CAN_VIEW_ALL_ADDRESSES: ['Can view ALL addresses'],
                    PERMISSIONS_CAN_CREATE_ALL_ADDRESSES: ['Can create ALL addresses'],
                    PERMISSIONS_CAN_UPDATE_ALL_ADDRESSES: ['Can update ALL addresses'],
                    PERMISSIONS_CAN_DELETE_ALL_ADDRESSES: ['Can delete ALL addresses'],
                    PERMISSIONS_CAN_VIEW_ADDRESS: ['Can view address'],
                    PERMISSIONS_CAN_ADD_ADDRESS: ['Can add address'],
                    PERMISSIONS_CAN_UPDATE_ADDRESS: ['Can change address'],
                    PERMISSIONS_CAN_DELETE_ADDRESS: ['Can delete address'],

                    /* Announcement Permissions */
                    PERMISSIONS_CAN_VIEW_ANNOUNCEMENT: ['Can view announcement'],
                    PERMISSIONS_CAN_ADD_ANNOUNCEMENT: ['Can add announcement'],
                    PERMISSIONS_CAN_UPDATE_ANNOUNCEMENT: ['Can change announcement'],
                    PERMISSIONS_CAN_DELETE_ANNOUNCEMENT: ['Can delete announcement'],

                    /* Policy Permissions */
                    PERMISSIONS_CAN_VIEW_POLICY: ['Can view policy'],
                    PERMISSIONS_CAN_ADD_POLICY: ['Can add policy'],
                    PERMISSIONS_CAN_UPDATE_POLICY: ['Can change policy'],
                    PERMISSIONS_CAN_DELETE_POLICY: ['Can delete policy'],

                    /* User Permissions */
                    //PERMISSIONS_CAN_VIEW_ALL_USERS: ['View All Users'],
                    PERMISSIONS_CAN_VIEW_ALL_USERS: ['Can view ALL hoausers'],
                    PERMISSIONS_CAN_UPDATE_ALL_USERS: ['Can update ALL hoausers'],
                    PERMISSIONS_CAN_DELETE_ALL_USERS: ['Can delete ALL hoausers'],
                    PERMISSIONS_CAN_VIEW_USER: ['Can view hoa user'],
                    PERMISSIONS_CAN_UPDATE_USER: ['Can change hoa user'],
                    PERMISSIONS_CAN_DELETE_USER: ['Can delete hoa user'],
                    PERMISSIONS_CAN_ASSIGN_ALL_PERMISSIONS: ['Can assign ALL permissions'],
                    USER_PERMISSIONS: ['Can view user'], // TODO: remove this?
                    PERMISSIONS_CAN_ADD_USER: ['Can add hoa user'],

                    /* Residence Permissions */
                    PERMISSIONS_CAN_CREATE_ALL_RESIDENCES: ['Can create ALL residences'],
                    PERMISSIONS_CAN_VIEW_ALL_RESIDENCES: ['Can view ALL residences'],
                    PERMISSIONS_CAN_UPDATE_ALL_RESIDENCES: ['Can update ALL residences'],
                    PERMISSIONS_CAN_DELETE_ALL_RESIDENCES: ['Can delete ALL residences'],
                    PERMISSIONS_CAN_VIEW_RESIDENCE: ['Can view residence'],
                    PERMISSIONS_CAN_UPDATE_RESIDENCE: ['Can change residence'],

                    /* User Residence Permissions */
                    PERMISSIONS_CAN_VIEW_ALL_USER_RESIDENCES: ['Can view ALL hoauser_residences'],
                    PERMISSIONS_CAN_CREATE_ALL_USER_RESIDENCES: ['Can create ALL hoauser_residences'],
                    PERMISSIONS_CAN_DELETE_ALL_USER_RESIDENCES: ['Can delete ALL hoauser_residences'],
};

// Composite permissions that rely on existing ones:
constants['ADMIN_PERMISSIONS'] = constants.PERMISSIONS_CAN_VIEW_ALL_USERS.concat(
                                 constants.PERMISSIONS_CAN_DELETE_ALL_USERS).concat(
                                 constants.PERMISSIONS_CAN_VIEW_ALL_ADDRESSES).concat(
                                 constants.PERMISSIONS_CAN_CREATE_ALL_ADDRESSES).concat(
                                 constants.PERMISSIONS_CAN_UPDATE_ALL_ADDRESSES).concat(
                                 constants.PERMISSIONS_CAN_DELETE_ALL_ADDRESSES).concat(
                                 constants.PERMISSIONS_CAN_CREATE_ALL_RESIDENCES).concat(
                                 constants.PERMISSIONS_CAN_UPDATE_ALL_RESIDENCES).concat(
                                 constants.PERMISSIONS_CAN_DELETE_ALL_RESIDENCES).concat(
                                 constants.PERMISSIONS_CAN_ADD_ANNOUNCEMENT).concat(
                                 constants.PERMISSIONS_CAN_UPDATE_ANNOUNCEMENT).concat(
                                 constants.PERMISSIONS_CAN_DELETE_ANNOUNCEMENT).concat(
                                 constants.PERMISSIONS_CAN_ADD_POLICY).concat(
                                 constants.PERMISSIONS_CAN_UPDATE_POLICY).concat(
                                 constants.PERMISSIONS_CAN_DELETE_POLICY);

constants['BASIC_USER_PERMISSIONS'] = constants.PERMISSIONS_CAN_VIEW_USER.concat(
                                 constants.PERMISSIONS_CAN_UPDATE_USER).concat(
                                 constants.PERMISSIONS_CAN_VIEW_ADDRESS).concat(
                                 constants.PERMISSIONS_CAN_ADD_ADDRESS).concat(
                                 constants.PERMISSIONS_CAN_UPDATE_ADDRESS);

export default constants;



