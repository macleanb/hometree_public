# Welcome to HomeTree, by Brian MacLean -- a demo homeowner's association website.
## Project requirements can be found here:
https://github.com/Code-Platoon-Curriculum/curriculum/blob/main/optional_lessons/personal_project.md

To get started from the command line:

## Backend
0. Git pull the repo (as required)
1. Change directory to hometree/backend.
2. Create a virtual environment if needed.
   * python -m venv <venv_name>
3. Activate your virtual environment
   * source <venv_name>/bin/activate (e.g. 'default')
4. Install dependencies
   * pip install -r requirements.txt
5. Create/Configure the database ('hoa_db')
   * install PostgreSQL and create superuser
   * createdb hoa_db
   * python manage.py migrate
   * Load fixtures (in the correct order):
    * python3 manage.py loaddata users/fixtures/auth_group_data_modified.json
    * python3 manage.py loaddata address_api/fixtures/address_data.json
    * python3 manage.py loaddata announcement_api/fixtures/announcement_data.json
    * python3 manage.py loaddata hoa_api/fixtures/residence_data.json
    * python3 manage.py loaddata hoa_api/fixtures/hoauser_residence_data.json
    * python3 manage.py loaddata policy_api/fixtures/policy_data.json
    * python3 manage.py loaddata policy_api/fixtures/policy_option_data.json
    * python3 manage.py loaddata policy_api/fixtures/residence_policy_choice_data.json
6. Start the backend server
   * python manage.py runserver

## Frontend
7. Change directory to frontend.
8. Install dependencies
   * npm install
9. Configure BASE_URL in constants.js for test or production
10. Start the frontend server (http://localhost:3000)
   * npm start

## Third-party APIs
11. If the Google Map display doesn't show, remind the author (above) to activate the Google APIs (maps, static maps, address validation, etc.).

## Testing
12. In the command line, type:
npx cypress run

## Most important
13.  Have fun, and feel free to create your own user account with a profile picture!


Design:
The HOA app will use Google API to allow users to create accounts and log in using their Google credentials
It will have a User Settings site
    This will include a Monthly Payments site using Venmo API or some other finance API
    This will include a Policy Preferences site that lets users vote on policy questions
It will have a Neighborhood Chat site
It will have a Neighborhood Map site that marks all the addresses in the neighborhood
It will have a Billing site displaying how much the User owes and due dates
It will have a Neighborhood Preferences site that allows the user to select an issue and see how each house voted
Feature a custom user model on the backend with authentication, permissions to allow auth/permissions-based data
   access on the backend and auth/permissions-based routing/conditional nav displays/api calls on the front end
It will feature reusable, composite forms that support nexted CRUD (users, addresses, residences)

Color pallete:
The green I like: #427b01
Dell: #476930 (nav bar)  ( 95% lighter: #f1f7ee for bodybackgroundhover 98% lighter: #fafcf8 for bodybackground)
Salem: #159947 (a lighter green)
Ocean Green: #49B265
Chelsea Cucumber: #868049
Observatory: #00917C (a lighter green with blue)
Madang: #8DD99E
Green Smoke: #95AA63 (listtext alternative)
Green Mist: #B7BF96 (decent light brown/green listtext= 40% lightness version #757e4e)
Magic Mint: #A5F0C5 (not good)
Pale Leaf: #BFCAB4
Rice Flower: #DFF5CE (nav bar brand text)
Yuma: #C8888A (pinkish)
Tusk: #E4DEAE (nav bar link text)
Eden: #1F5F5B
Kashmir Blue: #525888
Lavender: #DEE2FC
Chardonnay: #FFC06E
Maverick: #BFA8BB
Pale Rose: #F1DDDF


TODO:
    demo basic homepage and header links
    demo ada login (can't vote yet)
    demo testadmin assign ada 104
    demo ada login (now can vote)

    Frontend:
      wrap backend API calls in useEffect (use 'active' variable)
      use httponly cookies (see Adam's video and demo code)
             
    Backend:
      prepend /api/v1/ to backend proj URLs, then update frontend base URL to include /api/v1/
      consolidate frontend constants urls to allow for easy replacement of URLs from localhost to AWS
      Add a neighborhood chat function
      sometimes getting weather results in 500 server error
    
    Deploy:
      

    in UserManagerNew, after a new user is added an add new user form isn't being displayed at the top if the window width is constrained (i.e. if the developer tools window is open).  Make the windows more flexible to different sizes (mobile)

    Future Features:
    - Put the script tag from https://developers.google.com/maps/documentation/javascript/reference/advanced-markers
       in public/index.html (at the bottom of the body). And see if you can enable hover/click functionality on the map icons
       in MapDisplay. See example here:
       https://github.com/googlemaps/extended-component-library/tree/main/examples/js_sample_app/src
       Otherwise wait until vis.gl provides the functionality, put pins on the community map for each 
      residence, when you hover over them, make them show the address

    - Update timezone correctly on backedn for creating/updating announcements.  Right now
      announcements are created with local Zulu time, which looks wierd on frontend (early)

    - Some users may leave an update form filled but uncommitted for a long time, while
      users elsewhere may have changed the data on the server in the meantime.  Before
      executing an update, compare the original (fetched) object data at the frontend
      against the current backend data.  If they are different, warn the user and confirm
      they want to execute the update.
    - Deal with exhaustive deps warnings:
      reference: https://stackoverflow.com/questions/60620248/avoiding-eslint-react-hooks-exhaustive-deps-warnings-with-useeffect-usestate


User Stories (Address):
- Admin User creates address by providing all fields, with an image
- Admin User creates address by providing all fields, without an image
- Admin User creates address by providing all fields, selects an image then changes their mind (removes image selection)
- Admin User tries to create address, but misses some fields and receives error feedback
- Admin User tries to create an address that already exists, display an error that the address already exists (a regular user wouldn't get the feedback, it would just forego creating the new address and return the data to the user registration form
- A basic user creates a user account with a mailing address.  The user later deletes the address.
  The user later tries to update their address.  The user tries to add another address through Postman.

- The primary way users interact with address objects is through the frontend UserManager, ProfileManager, and ResidenceManager views.

SEARCH FILTERS
    Test UserDisplay Filter from UserManager (all pass)
      - Setup: Griffin owns '123 Dep me', Sunny's mailing address is '555 Sunnyj'
      - Griffin should result with 'cola', 'dep' search terms
      - Remove 123 Dep me from Griffin's ownership, and search results should clear with 'dep' search term
      - Sunny should result with 'sunny', 'sunnyj' search terms
      - Update Sunny's mailing address to 555 Sunnyk, then search results should clear
      - Return Sunny's mailing address to 555 Sunnyj, then search results should repopulate

    Test UserDisplay Filter from ResidenceManager (all pass)
      - Setup: Griffin owns '123 Dep me', Sunny's mailing address is '555 Sunnyj'
      - Griffin should result with 'cola', 'dep' search terms
      - Remove 123 Dep me from Griffin's ownership, and search results should clear with 'dep' search term
      - Sunny should result with 'sunny', 'sunnyj' search terms
    
    Test ResidenceDisplay filter from ResidenceManager (all pass)
      - Setup: Griffin owns '123 Dep me', Sunny's mailing address is '555 Sunnyj'
      - 123 Dep me should result with 'cola', 'dep' search terms
      - Remove Griffin from '123 Dep me' ownership, and search results should clear with 'cola' search term
      - 10 zzkk should result with 'cola' search term (mailing address)

    Test ResidenceDisplay filter from UserManager (all pass)
      - Setup: Griffin owns '123 Dep me', Sunny's mailing address is '555 Sunnyj'
      - 123 Dep me should result with 'cola', 'dep' search terms
      - Remove Griffin from '123 Dep me' ownership, and search results should clear with 'cola' search term
      - 10 zzkk should result with 'cola' search term (mailing address)


