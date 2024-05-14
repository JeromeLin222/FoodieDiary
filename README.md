# Restaurant List
<img src="https://github.com/JeromeLin222/restaurant_list/assets/31838309/2fd1c98d-bd93-4b0b-a162-823d2efeacab" width="100%" height="auto">

## Introduction

This web application provides a restaurant list, created using Node.js and Express.js. It utilizes Express Handlebars as the template engine to render frontend pages.



## Features

- List all restaurants
- Search for restaurants by name
- Create new restaurants 
- View detailed information about each restaurant
- Update restaurant information
- Delete restaurant

## Getting Started

These instructions will help you to get a copy of the project and run it on your local machine for development and testing purposes. Simply follow the steps below to set up your local development environment.


### Prerequisites

- Node.js
- npm (Node Package Manager)
- MySQL server v8

### Installing

1. **Clone the repository**

```
git clone https://github.com/JeromeLin222/restaurant_list.git
```
2. **Move to the directory**
```
cd restaurant_list
```

3. **Install npm packages**
```
npm install
```
4. **Run migration and seeder to create database data**
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
5. **Launch the application**
```
npm run start
```
Once the application is running, open http://localhost:3000 in your browser to view the website.

