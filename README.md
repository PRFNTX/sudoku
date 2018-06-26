Run Project for Dev:
    1) $ npm install
    2) $ npm start

Build and run
    1) $ npm install
    2) $ npm run build
    3) $ npm run serve
    4) navigate to 'localhost:8080' in your browser

Add new Puzzles: 
    1) open /src/boards/boards.js
    2) add a new item to the 'boards' array:
        a) each item is an array
        b) each array contains 9 sub-arrays
        c) each sub-array contains 9 string elements either "[1-9]", or ""
