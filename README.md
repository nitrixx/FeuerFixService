# Flerschemer Firefighter Learning Program - FeuerFix Service #

[![Build Status](https://travis-ci.com/Inventio93/FeuerFixService.svg?token=EzYfE5qpxed5ipLPkJXG&branch=master)](https://travis-ci.com/Inventio93/FeuerFixService)

## What is this repository for?

This is the RESTful API for FeuerFix.

## How do I get set up?

### Prerequisites
Before you get started, you need to make sure that you have write access to a relational database so that [Sequelize](https://github.com/sequelize/sequelize) can connect to it.

### Configuration
To configure Sequelize to connect to your database, edit the configuration file under *src/config/config.js*. In addition to that you have to provide a secret for the jwt signing. To do so, simply export an environment variable called *JWT_SECRET* with your desired secret. You can also choose a port the server will listen to by exporting a *PORT* variable.

### Installation
To install the dependencies, run
```bash
$ npm install
```

### Starting the server
To start the server, run
```bash
$ npm run dev
```
this will start the server in development mode. This loads your environment variables for development from *.env* file in the root directory of the project and automatically restart the server if a file changes.

## Who do I talk to?

* [Dennis Kaiser](mailto:denniskaiser1993@gmail.com)
* Marvin Kaiser
