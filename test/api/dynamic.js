
var assert = require("assert");
var th = require("../testhelper").TestHelper;
var Db = require("../../server/tools/db").Db;

describe('Dynamic API', () => {

    typename = "dynamictype";
    clientname = "0";
    getelementname = "name1";
    postelement = {
        name: "newname",
        fieldone: "f1c",
        fieldtwo: true,
        fieldthree: 4711.0815,
        fieldfour: new Date('2015-12-17T03:24:00.000Z').getTime()
    };
    putelementname = "putname";
    putelement = {
        fieldone: "f1d",
        fieldtwo: false,
        fieldthree: 34.67,
        fieldfour: new Date('2017-12-17T03:24:00.000Z').getTime()
    };
    deleteelementname = "deletename";
    deleteelement = {
        fieldone: "f1e",
        fieldtwo: true,
        fieldthree: 56.78,
        fieldfour: new Date('2018-12-17T03:24:00.000Z').getTime()
    };

    describe('GET/', () => {
        th.apiTests.get(typename, clientname);
    });

    describe('GET/:name', () => {
        th.apiTests.getName(typename, clientname, getelementname);
    });

    describe('POST/', () => {
        th.apiTests.post(typename, clientname, postelement);
    });

    describe('PUT/:name', () => {
        th.apiTests.put(typename, clientname, putelementname, putelement);
    });

    describe('DELETE/:name', () => {
        th.apiTests.delete(typename, clientname, deleteelementname, deleteelement);
    });

    describe('GET/forIds', () => {

    //     function createTestClients() {
    //         var testObjects = ['testClient1', 'testClient2', 'testClient3'].map(function(name) {
    //             return {
    //                 name: name
    //             }
    //         });
    //         return Promise.resolve(testObjects);
    //     }

    //     // th.apiTests.getForIds.defaultNegative(co.apis.clients, co.permissions.ADMINISTRATION_CLIENT, co.collections.clients.name, createTestClients);
    //     // th.apiTests.getForIds.defaultPositive(co.apis.clients, co.collections.clients.name, createTestClients);

    });

});