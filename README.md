# Image Processing API

## steps to run the codebase

1. install dependecies listed in package.json
    ```bash
    npm install
    ```
2. build the codebase and serve
    ```bash
    npm run serve
    ```
    Note: preserve script will clean up and generate API server and UI build files in dist folder
3. the application will be available at http://localhost:3000/

## scripts

-   `npm run build`: to build the server
-   `npm run serve`: builds server and frontend ui and starts the server at PORT 3000.
-   `npm run test`: to build the api codebase and run jasmine specs
-   `npm run start`: to start the API server in development mode with nodemon
-   `npm run lint`: to lint the API codebase
-   `npm run prettify`: to prettify the codebase
-   `npm run cleanup`: to remove dist folder and any existing thumbnails
-   `npm run start:fe`: to start parcel cli to process UI code present in src/views
-   `npm run build:fe`: to generate processed output of UI code in dist/views

## endpoints

webapp url: localhost:3000/

### Frontend endpoints

-   [/upload](/upload)

    UI to upload image to full image assets folder

-   [/fullimages](/fullimages)

    UI to view full size image available

-   [/thumbnails](/thumbnails)

    UI to view processed thumbnail images

### API endpoints

-   [/api/images](/api/images)

    To get resized image from request query params.

    [/api/images?filename=encenadaport&height=100&width=100](/api/images?filename=encenadaport&height=100&width=100)

    To get list of fullsize images available.

    [/api/images](/api/images)

    To get single fullsize image.

    [/api/images?filename=encenadaport](/api/images?filename=encenadaport)

-   [/api/upload](/api/upload)

    [POST] To upload original fill size image from UI

-   [/api/thumbnails](/api/thumbnails)

    To get list of processed thumbnail image and url path
