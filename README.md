# Project 2 - Tic Tac Toe
Preview Application: [https://boiling-waters-90168.herokuapp.com/](https://boiling-waters-90168.herokuapp.com/)
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
6. Push to Heroku: `git push heroku milestone_1:main`
## What are at least 3 technical issues you encountered with your project? How did you fix them?
1. In my Board.js when I was trying to update and set the players, I initially tried using a list, but quickly realized in the future determining who was Player X, Player O, and a spectator would prove to be difficult. I then decided on using a dictionary. However, I then struggled with updating it using socket and sending it to the client side. After further research, I learned that it was because I was sending back the variable (not the copy) which wasn’t updated yet, as it hadn’t re-rendered. By this I mean if I wanted to add a player, I made a copy of the existing dictionary and determined what they to place them with, but was sending the old version to the backend. To resolve this, I sent the copy to the backend.
2. I was having issues with restricting people who were able to click. For example, spectators should not be able to click, player X should only be able to click on their turn, and if the box has already been clicked, a player should not be able to change the value. To resolve this, I utilized console.log to see what state each of my variables were in. I also created a separate function to determine if the user was logged in and if they could click the board, since if they weren’t logged in, the players dictionary shouldn’t be updated. Seperating everything into separate functions helped with readability and debugging my code throughout the process. 
3. I was also having problems with infinite re-rendering. Originally, I had a function where I set the state to being logged in based on various different conditions and checked it when I tried to click on the board, however, because I was calling the function, which continuted to set the state and then re-rendered everytime, it fell in an infinite loop. To resolve this, I did some searching and found this useful article [https://medium.com/@andrewmyint/infinite-loop-inside-useeffect-react-hooks-6748de62871](https://medium.com/@andrewmyint/infinite-loop-inside-useeffect-react-hooks-6748de62871), which helped break down the problem and fix my code so that it didn’t keep rendering over and over again. 
## What are known problems (still existing), if any, with your project? 
1. If a user leaves mid game, the players are not updated automatically.
2. If a user joins after the game has started, the players are not updated correctly.
## What would you do to improve your project in the future?
1. To improve my project in the future, I would incorporate a database to store the users, so I can have a leaderboard of the people with the most wins. I would also have the ability to leave a game, in which case one of the spectators could continue playing the game and the person would become a spectator. I would also have the ability for a user to log out and no longer see any of the game play. The last feature I wanted to possibly incorporate is the ability for players to play and pause a playlist of songs from Spotify. This would elevate the user experience, give the users more interactivity and provide a more exciting and entertaining user experience.