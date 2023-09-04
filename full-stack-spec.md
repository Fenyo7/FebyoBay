# Full-stack Final Exam Homework Project specification

## Feature details

### As a user I can sign in to the application
  - Providing a username and password
  - Given any parameters missing, the user can't sign in and the application displays a message listing the missing parameters
  - Given the username is not existing, the user can't sign in and the application displays a message about it
  - Given the password is not matching the one stored with the username, the user can't sign in and the application displays message that the password is wrong
  - Given the username and password pair is correct, the user is redirected to the listing of the sellable items where he can see the available greenBay dollars for his account
### As a signed in user I can create a sellable item
  - Providing the name, description, photo url and price for the item
  - Given any parameters missing, the user can't create the item and the application a message what's missing
  - Given the price is not a positive whole number, the user can't create the item and the application a message about it
  - Given the photo url is not a valid url, the user can't create the item and the application a message about it
  - Given all is provided and in good format, the item is created and the application displays the whole created item
### As a signed in user I can list existing sellable items
  - With main information about the sellable item: name, photo url and price
  - Only the not yet sold items 
  - Given no parameters, the application displays all the sellable items that was created
### As a signed in user I can view a specific sellable item
  - With all information about the sellable item: name, description, photo url, price and seller's name
  - Given the id of an existing sellable item, the application displays all information about the item
  - Given the id of an existing not sellable item, the application displays all information including the buyer's name
  - Given the id of a not existing item, the application displays a message that the item is not found
### As a signed in user I can buy a sellable item
  - Only if the buyer user have enough greenBay dollars
  - The item becomes not sellable anymore
  - Given the id of a not existing item, the application displays a message that the item is not found
  - Given the id of an existing not sellable item, the application displays a message that the item can't be bought
  - Given the id of an existing sellable item and the user has more greenBay dollars than the price, the user buys the item that becomes not sellable and the application displays all the information about the item including the buyer's name
  - Given the id of an existing sellable item and the user has less greenBay dollars than the price, the application displays a message that there's not enough money on the user's account

## Technical specification

### Backend Web API

The application's backend should be a JSON based Web API, meaning all request and response bodies should contain JSON formatted strings.

### Frontend App

The application's frontend app should be a fully functional user interface for the application using a major frontend framework or library (Angular/React/...)

### Authentication

- The backend should send a token that the frontend receives on sign in and it should be a JWT containing the user's id and name
- All requests other than the sign in should be checked on the backend for the presence of the JWT token in the header, if not present the action should not happen and proper status and message should be responded
- This should happen in a middleware on the backend

### Database

- Any kind of database (MySQL, PostgreSQL, MongoDB ...) should be used to store the data of the application
- A migration tool should be used to create the database structure
- On startup the application should create a few users if there isn't any

### Architecture

#### Backend

- The backend should follow a typical layered architecture pattern
- The database should be configured through environment variables
- The application should be deployed (Heroku or anything else)

#### Frontend

- The fronted should separate the visible, usable components
- Proper framework related methods should be used for data exchange and storage with the backend in a separate layer
  - Services in Angular
  - Redux and thunk (or saga) in React

### Tests

- All backend endpoints should have integration tests
  - either with test database or mocked services
- All backend services should have unit tests with mocked repositories
- All frontend components should have snapshot tests

