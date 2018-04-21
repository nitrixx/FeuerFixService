# Flerschemer Firefighter Learning Program - FeuerFix Service #

[![Build Status](https://travis-ci.com/Inventio93/FeuerFixService.svg?token=EzYfE5qpxed5ipLPkJXG&branch=master)](https://travis-ci.com/Inventio93/FeuerFixService)

## What is this repository for?

This is the RESTful API for FeuerFix.

## How do I get set up?
Before you get started you need to make sure that you have write access to a relational Database so that [Sequelize](https://github.com/sequelize/sequelize) can connect to it. To configure sequelize to connect to your database, edit the configuration file under *src/config/config.js*. After that install the dependencies by running
```bash
$ npm install
```
then run
```bash
$ sequelize db:migrate
```
to apply the database scheme to the database. Once the migration is done you can launch the server by running
```bash
$ npm run dev
```
this will start the server. If a file changes, the server automatically restarts.


## Configuration
As mentioned above, you need to configure [Sequelize](https://github.com/sequelize/sequelize) to connect to your database. In addition you will need to provide a secret for the jwt signing. To do so, simply export an environment variable called *JWT_SECRET* with your desired secret. You can also choose a port to listen to by exporting a *PORT* variable.

## Who do I talk to?

* [Dennis Kaiser](mailto:denniskaiser1993@gmail.com)
* Marvin Kaiser
