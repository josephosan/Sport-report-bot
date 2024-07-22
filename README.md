# Sport Report Bot

## Overview
The Sport Report Bot is a Telegram bot designed to help users stay on track with their daily workout routines. It includes features for marking workouts as complete, sending daily reminders, providing motivational quotes, and allowing privileged users (admins) to send global messages, get reports, and more.
You can find the bot with @sport_report_bot.

## Features
- **Completion Detection**: The bot marks your daily workout as completed when it receives any of the accepted keywords.
- **Daily Reminder**: Sends a friendly reminder every day at 17:00 to help users stay on track.
- **Daily Quote**: Provides a motivational quote each day or on command.
- **Admin Features**: Privileged users can send global messages, get user reports, and more.

## Configuration
The bot requires a `.env` file for configuration. The following environment variables need to be set:

- `API_TOKEN`: Your Telegram bot API token.
- `DB_USER`: The database user.
- `DB_PASSWORD`: The database password.
- `PRIVILEGED_USERNAMES`: Comma-separated list of privileged usernames.

Example `.env` file:

API_TOKEN=your_telegram_api_token
DB_USER=your_db_user
DB_PASSWORD=your_db_password
PRIVILEGED_USERNAMES=user1,user2,user3

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/sport-report-bot.git
   ```

2. Go to folder
   ```bash
   cd sport-report-bot
   ```

3. Install dependencies
   ```bash
    npm install
    ```
4. Compile with tsc
   ```bash
    tsc index.ts
   ```

4. Run with node
  ```bash
  node index.js
  ```


## Usage
### Commands
	•	/start: Registers the user and sends a welcome message.
	•	/help: Displays the help message with available commands and features.

 ###  Keywords
	•	Completion Detection: Sends any of the following phrases to mark your workout as complete:
	•	“DONE”, “COMPLETE”, “I’VE DONE MY WORKOUT”, “TODAY IS DONE”, and other variations.
	•	Daily Quote: Send QUOTE ME: to get a motivational quote.

 ## Admin Commands

 Privileged users (admins) have additional commands:
 	•	Global Message: Send GLOBAL MESSAGE: your_message to notify all users.
	•	Get Report: Send REPORT: username to get a specific user’s report or REPORT: to get all users’ reports.
	•	Get All Users: Send GET ALL USERS: to get a list of all users.
	•	Get Privileged Usernames: Send GET ADMINS: to get the list of privileged usernames.
	•	Get Users Messages: Send MESSAGES: username to get messages from a specific user.
	•	Message to User: Send MESSAGE TO: username: your_message to send a message to a specific user.













   
