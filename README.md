# paul-predictor web api

This is a back end for paul-predictor front end. You need to setup this application locally before starting front end application.

## Technologies
- Mongo DB
- Express
- Angular
- Node

## Clone the repo locally
Clone this repo locally and follow setup to start the backend server locally

## Setup
Perform following operations to setup the back end server locally

### 1. Download MongoDB shell
1. Download [MongoDB shell](https://www.mongodb.com/try/download/shell)
2. Unzip the contents to any directory (e.g. c:\mongodb)

### 2. Create local DB server
1. Create a folder for DB (e.g. C:\MongoDB\data\db)
2. Open shell/cmd and change directory to MongoDB
3. Type following commands to start DB server (change the db folder to match your path)
<pre>
mongod --port 27017 --dbpath C:\MongoDB\data\db
</pre>

### 3. Create sample DB
1. Open shell/cmd and change directory to MongoDB
2. Run following command to open connection to local server
<pre>
mongo
</pre>
3. Run following commands in order to create leagues and teams collections
<pre>
db.leagues.insert({
        "name" : "Test League",
        "shortName" : "Test League",
        "startDate" : Date(),
        "endDate" : Date(),
        "createdBy" : "adi007me",
        "createdDate" : Date(),
        "matches" : [
			{ 'team1_id': 'MI', 'team2_id': 'RCB', 'match_id': 'match1', 'datetime': ISODate('2021-04-09T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'CSK', 'team2_id': 'DC', 'match_id': 'match2', 'datetime': ISODate('2021-04-10T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'SRH', 'team2_id': 'KKR', 'match_id': 'match3', 'datetime': ISODate('2021-04-11T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RR', 'team2_id': 'KXIP', 'match_id': 'match4', 'datetime': ISODate('2021-04-12T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KKR', 'team2_id': 'MI', 'match_id': 'match5', 'datetime': ISODate('2021-04-13T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'SRH', 'team2_id': 'RCB', 'match_id': 'match6', 'datetime': ISODate('2021-04-14T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RR', 'team2_id': 'DC', 'match_id': 'match7', 'datetime': ISODate('2021-04-15T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KXIP', 'team2_id': 'CSK', 'match_id': 'match8', 'datetime': ISODate('2021-04-16T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'MI', 'team2_id': 'SRH', 'match_id': 'match9', 'datetime': ISODate('2021-04-17T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RCB', 'team2_id': 'KKR', 'match_id': 'match10', 'datetime': ISODate('2021-04-18T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'DC', 'team2_id': 'KXIP', 'match_id': 'match11', 'datetime': ISODate('2021-04-18T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'CSK', 'team2_id': 'RR', 'match_id': 'match12', 'datetime': ISODate('2021-04-19T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'DC', 'team2_id': 'MI', 'match_id': 'match13', 'datetime': ISODate('2021-04-20T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KXIP', 'team2_id': 'SRH', 'match_id': 'match14', 'datetime': ISODate('2021-04-21T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KKR', 'team2_id': 'CSK', 'match_id': 'match15', 'datetime': ISODate('2021-04-21T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RCB', 'team2_id': 'RR', 'match_id': 'match16', 'datetime': ISODate('2021-04-22T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KXIP', 'team2_id': 'MI', 'match_id': 'match17', 'datetime': ISODate('2021-04-23T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RR', 'team2_id': 'KKR', 'match_id': 'match18', 'datetime': ISODate('2021-04-24T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'CSK', 'team2_id': 'RCB', 'match_id': 'match19', 'datetime': ISODate('2021-04-25T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'SRH', 'team2_id': 'DC', 'match_id': 'match20', 'datetime': ISODate('2021-04-25T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KXIP', 'team2_id': 'KKR', 'match_id': 'match21', 'datetime': ISODate('2021-04-26T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'DC', 'team2_id': 'RCB', 'match_id': 'match22', 'datetime': ISODate('2021-04-27T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'CSK', 'team2_id': 'SRH', 'match_id': 'match23', 'datetime': ISODate('2021-04-28T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'MI', 'team2_id': 'RR', 'match_id': 'match24', 'datetime': ISODate('2021-04-29T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'DC', 'team2_id': 'KKR', 'match_id': 'match25', 'datetime': ISODate('2021-04-29T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KXIP', 'team2_id': 'RCB', 'match_id': 'match26', 'datetime': ISODate('2021-05-30T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'MI', 'team2_id': 'CSK', 'match_id': 'match27', 'datetime': ISODate('2021-05-01T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RR', 'team2_id': 'SRH', 'match_id': 'match28', 'datetime': ISODate('2021-05-02T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KXIP', 'team2_id': 'DC', 'match_id': 'match29', 'datetime': ISODate('2021-05-02T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KKR', 'team2_id': 'RCB', 'match_id': 'match30', 'datetime': ISODate('2021-05-03T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'SRH', 'team2_id': 'MI', 'match_id': 'match31', 'datetime': ISODate('2021-05-04T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RR', 'team2_id': 'CSK', 'match_id': 'match32', 'datetime': ISODate('2021-05-05T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RCB', 'team2_id': 'KXIP', 'match_id': 'match33', 'datetime': ISODate('2021-05-06T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'SRH', 'team2_id': 'CSK', 'match_id': 'match34', 'datetime': ISODate('2021-05-07T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KKR', 'team2_id': 'DC', 'match_id': 'match35', 'datetime': ISODate('2021-05-08T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RR', 'team2_id': 'MI', 'match_id': 'match36', 'datetime': ISODate('2021-05-08T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'CSK', 'team2_id': 'KXIP', 'match_id': 'match37', 'datetime': ISODate('2021-05-09T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RCB', 'team2_id': 'SRH', 'match_id': 'match38', 'datetime': ISODate('2021-05-09T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'MI', 'team2_id': 'KKR', 'match_id': 'match39', 'datetime': ISODate('2021-05-10T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'DC', 'team2_id': 'RR', 'match_id': 'match40', 'datetime': ISODate('2021-05-11T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'CSK', 'team2_id': 'KKR', 'match_id': 'match41', 'datetime': ISODate('2021-05-12T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'MI', 'team2_id': 'KXIP', 'match_id': 'match42', 'datetime': ISODate('2021-05-13T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'SRH', 'team2_id': 'RR', 'match_id': 'match43', 'datetime': ISODate('2021-05-13T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RCB', 'team2_id': 'DC', 'match_id': 'match44', 'datetime': ISODate('2021-05-14T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KKR', 'team2_id': 'KXIP', 'match_id': 'match45', 'datetime': ISODate('2021-05-15T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RR', 'team2_id': 'RCB', 'match_id': 'match46', 'datetime': ISODate('2021-05-16T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'CSK', 'team2_id': 'MI', 'match_id': 'match47', 'datetime': ISODate('2021-05-16T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'DC', 'team2_id': 'SRH', 'match_id': 'match48', 'datetime': ISODate('2021-05-17T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KKR', 'team2_id': 'RR', 'match_id': 'match49', 'datetime': ISODate('2021-05-18T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'SRH', 'team2_id': 'KXIP', 'match_id': 'match50', 'datetime': ISODate('2021-05-19T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RCB', 'team2_id': 'MI', 'match_id': 'match51', 'datetime': ISODate('2021-05-20T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KKR', 'team2_id': 'SRH', 'match_id': 'match52', 'datetime': ISODate('2021-05-21T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'DC', 'team2_id': 'CSK', 'match_id': 'match53', 'datetime': ISODate('2021-05-21T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'KXIP', 'team2_id': 'RR', 'match_id': 'match54', 'datetime': ISODate('2021-05-22T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'MI', 'team2_id': 'DC', 'match_id': 'match55', 'datetime': ISODate('2021-05-23T10:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'RCB', 'team2_id': 'CSK', 'match_id': 'match56', 'datetime': ISODate('2021-05-23T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'TBD', 'team2_id': 'TBD', 'match_id': 'match57', 'datetime': ISODate('2021-05-25T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'TBD', 'team2_id': 'TBD', 'match_id': 'match58', 'datetime': ISODate('2021-05-26T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'TBD', 'team2_id': 'TBD', 'match_id': 'match59', 'datetime': ISODate('2021-05-28T14:00Z'), 'result': '', 'points': 0 },
			{ 'team1_id': 'TBD', 'team2_id': 'TBD', 'match_id': 'match60', 'datetime': ISODate('2021-05-30T14:00Z'), 'result': '', 'points': 0 }
        ]
})
</pre>

<pre>
db.teams.insert([
  { "name" : "Chennai Super Kings", "shortName" : "CSK", "icon" : "csk.ico" },
  { "name" : "Delhi Capitals", "shortName" : "DC", "icon" : "dc.ico" },
  { "name" : "Kings XI Punjab", "shortName" : "KXIP", "icon" : "kxip.ico" },
  { "name" : "Kolkata Knight Riders", "shortName" : "KKR", "icon" : "kkr.ico" },
  { "name" : "Mumbai Indians", "shortName" : "MI", "icon" : "mi.ico" },
  { "name" : "Rajasthan Royals", "shortName" : "RR", "icon" : "rr.ico" },
  { "name" : "Royal Challengers Banglore", "shortName" : "RCB", "icon" : "rcb.ico" },
  { "name" : "Sunrisers Hyderabad", "shortName" : "SRH", "icon" : "sh.ico" }
])
</pre>

### 4. Start local backend server
1. Open shell/cmd
2. Go to folder where the source code is downloaded
3. Run npm i
<pre>
npm i
</pre>
4. Add .env file under your root folder and add following in .env file
<pre>
MONGO_URL=mongodb://127.0.0.1:27017
ADMINS=&lt;your_gmail@gmail.com&gt;
DB_NAME=test-paul-predictor
OAUTH_KEY=169706668013-mvf7ct27e5n709k27cdqd2ostnvoe1qm.apps.googleusercontent.com
</pre>
5. Run npm start
<pre>
npm start
</pre>