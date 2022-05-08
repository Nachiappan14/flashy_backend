process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
const User = require("../models/users");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe("Users", () => {
    before((done) => {
      User.deleteOne({name: "test"}, (err) => {
        done();
      });
    });
  describe("/register user", () => {
    it("Add user", (done) => {
        let user = {name: "test", password: "testPassword"}
      chai
        .request(server)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          done();
        });
    });
  });
  describe("/register user", () => {
    it("Add user Fails", (done) => {
      let user = { name: "test", password: "testPassword" };
      chai
        .request(server)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          done();
        });
    });
  });
});
