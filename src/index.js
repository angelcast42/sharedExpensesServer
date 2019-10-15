
import express from 'express';
const cors = require('cors')

const app = express();

import mongoose from 'mongoose';
mongoose.connect('mongodb://friadmin:theworldisfri2019@ds151180.mlab.com:51180/groupsdb')
  .then(() => console.log('connected to db'))
  .catch(err => console.log(err));
import eventsModel from './models/events';
import groupsModel from './models/groups';

import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './schema';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// settings
app.set('port', process.env.PORT ||3000);
app.use("*",cors())
app.use('/graphql',cors(), express.json(), graphqlExpress({
  schema,
  context: {
    eventsModel,groupsModel
  }
})
)


// start the server
app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});