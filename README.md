# Project 2 - Tic Tac Toe
Preview Application: [https://tictactoe490.herokuapp.com/](https://tictactoe490.herokuapp.com/)
## Clone the repo
CLI Command: `git clone https://github.com/NJIT-CS490-SP21/project2-mg657`
<br /> If you cd into the repository you'll see all the files

## Install Requirements (if not already installed)
1. `npm install`
2. `pip install Flask`
3. `pip install -r requirements.txt`
## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
1. Install Heroku CLI: `npm install -g heroku` 
2. Create a free account on Heroku [https://signup.heroku.com/login](https://signup.heroku.com/login)
3. Log in to Heroku: `heroku login -i`
4. Create a Heroku app: `heroku create --buildpack heroku/python`
5. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
6. Add a database: `heroku addons:create heroku-postgresql:hobby-dev`
7. Check your env variables to find the value of `DATABASE_URL`: `heroku config`
8. Copy paste that value (looks like 'postgress://...')
9. Create a .env file and set our `DATABASE_URL` variable: `touch .env && echo "DATABASE_URL='copy-paste-database-url-here'" > .env`
10. Push to Heroku: `git push heroku milestone_2:main`
## What are at least 3 technical issues you encountered with your project? How did you fix them?
1. I had issues displaying in my table correctly in my Leaderboard.js, as I had two lists with users and scores being sent to my Leaderboard component. However, since I wanted the data to display vertically, there had to be a new row for every user with a corresponding score. At first I looked at potentially making a new component to handle creating all the rows, however, that was a very inefficient way of displaying the data. I then looked into other different ways to display the data and thought of creating two tables next to each other for each list and using CSS to make it look nicer. To resolve this, after much searching online I came up with the solution of adding an index to my map function and getting the score at that index from my list. While I didn’t use this method exactly, it helped with how I could implement this using functional ReactJS. [https://stackoverflow.com/questions/37728951/how-to-css-displaynone-within-conditional-with-react-jsx](https://stackoverflow.com/questions/37728951/how-to-css-displaynone-within-conditional-with-react-jsx)
2. I also had trouble correctly updating my score in the database. At first, it was because it would change the score when there was a draw, along with if there was a win/lose situation. This was a simple logic error, however, as I had placed my socket.emit in the wrong set of curly braces. I also had an error when I was assigning the winner and loser in my app.py, I had `winner =models.Leaderboard.query.filter_by(username=data['gameStat']['Winner']).first()`, however, after some searching, I found out that was not the correct way to filter in my database and changed my code to have`winner = db.session.query(models.Leaderboard).filter_by(username=data['gameStat']['Winner']).first()`. Sessions establishes a connection with the database and provides the most updated information and allows for the values to be updated, whereas the version of the code I originally had would not allow for an update to the database.
3. The other biggest technical difficulty I had was with placing the function where I emitted the winning username and losing username to the socket listener, so the score could be updated on the backend. I first put it in my board function where I displayed the winner, however, this caused an infinite app re-render loop. After many print statements and console.logs, I realized it would continuously emit and enter another function with an emit and so on and so forth. I eventually made a seperate function in my board component that would only be called when the board was changed (ex: the user clicked on a square). 
## What are known problems (still existing), if any, with your project? 
1. If a user leaves mid game, the players are not updated automatically. If I had more time, I would add a logout button, which, when clicked would automatically take the first spectator and make them player X or O, depending on who leaves. 
2. If a user joins after the game has started, the players are not updated correctly and essentially logs out the players already playing.
## What would you do to improve your project in the future?
1. To improve my project in the future, I would have the ability to leave a game, in which case one of the spectators could continue playing the game and the person would become a spectator. I would also have the ability for a user to log out and no longer see any of the game play. The last feature I wanted to possibly incorporate is the ability for players to play and pause a playlist of songs from Spotify. This would elevate the user experience, give the users more interactivity and provide a more exciting and entertaining user experience. Another aspect I could improve was animation on the winning squares using CSS and give the user the option to play against a computer.
