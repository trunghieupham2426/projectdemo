# SETUP

Make sure to follow all these steps exactly

## Installation
To run this project , you need to install mysql:

https://dev.mysql.com/downloads/installer/

### Install the Dependencies
From the project folder , install dependencies
```bash
npm install
```
And then , you must create .env file base on .env.example file

### Databases seeding

```bash
npm run db:dev
```
### Run the test
Before run this project , you have to run TEST to make sure everything working. 


1. Seeding admin acccount
```bash
npm run db:pretest
```
2. Run test
```bash
npm run test
```
All tests should pass.
### Start the Server
```bash
npm start
```


