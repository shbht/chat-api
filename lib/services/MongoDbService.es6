"use strict";

import {MongoClient} from "mongodb";
import Q from "q";

export class MongoDbService {

  constructor(config) {
    if (!config || !config.mongoDb.connectionString) {
      throw new Error("MongoDB connection string not available");
    }

    this.connectionString_ = config.mongoDb.connectionString;

    this.dbConnection_ = this.connectToDB();
  }

  /**
   * Create connection to the mongodb database.
   * @private
   * @returns {Q.Promise} A promise which resolves the connection to the mongodb client.
   */
  connectToDB() {
    this.dbConnection_ = Q.ninvoke(MongoClient, "connect", this.connectionString_);
    return this.dbConnection_;
  }

  /**
   * function for creating the mongodb object.
   * @returns {object} mongodb object after creating the connection.
   */
  getMongoDBObject() {

    return this.dbConnection_
      .catch(() => {
        return this.connectToDB();
      })
      .then(dbConn => {
        return dbConn;
      });
  }

  /**
   *@param {object} query read query
   *@returns {object} returns promise for read query
   */
  readQuery(query) {

    return {
      "fields": query.fields || {},
      "limit": query.limit || 0,
      "skip": query.skip || 0,
      "sort": query.sort || {}
    };
  }

  /**
   *@param {string} collection collection to be used for query
   *@param {object} query query object which contains body(filter query), fields, limit, skip, sort fields
   *@returns {Q.Promise} returns promise for read query
   */
  read({collection, query}) {

    let options = [];

    options.push(query.body);
    options.push(this.readQuery(query));

    return this.getMongoDBObject()
      .then(db => {
        return Q.npost(
          db.collection(collection), "find", options
        )
          .then(cursor => {
            return Q.ninvoke(cursor, "toArray"
            )
              .then(results => {
                return results;
              });
          });
      });
  }

  /**
   *
   * @param {string} collection name.
   * @param {object} object to be inserted into the collections
   * @returns {Q.Promise} returns promise for insertion
   */

  insert({collection, document}) {
    return this.getMongoDBObject()
      .then(db => {
        return Q.ninvoke(db.collection(collection), "insert", document);
      });
  }
}
