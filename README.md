<h1>Visa Tracker with Laravel and Telegram</h1>

### Overview

User will login into the site via telegram authentication, then register at max 5 website to keep tracking, 
the server will periodically check these site availability, 
if one of them is open, then broadcast it to all users that did register to track it 


### how to run in Local
 
1- in web.php, 
  make the middleware where we need TelegramAuthentication, turn it to ['auth'], but note it will be using Breeze authentication

### How to setup telegram bot

0. https://socialiteproviders.com/Telegram/#configuration, and https://socialiteproviders.com/usage/#_5-usage
1. go to @botFather
2. create new bot, preferably with same username as platform domain name
3. /setDomain, and use ngrok for the project (if local), or just the domain name
4. edit the env
5. the response of the telegram authentication are in https://core.telegram.org/widgets/login
6. (optionally) add a logo to this bot
7. do not use localhost, it should be https

### Broadcast

1. with Laravel Reverb
2. with Telegram Notifications
3. https://medium.com/@datascale/how-to-use-laravel-reverb-with-sanctum-websockets-for-api-spa-e1391f9843be


### Log Viewer

https://log-viewer.opcodes.io/docs/3.x/install

