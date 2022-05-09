process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
const User = require("../models/users");
const Decks = require("../models/decks");
const Cards = require("../models/cards");
const Quiz = require("../models/quiz");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();
let token, deck, card;

chai.use(chaiHttp);
//Our parent block
describe("Users", () => {
  before((done) => {
    User.deleteOne({ name: "test" }, (err) => {
      done();
    });
  });

  describe("/register user", () => {
    it("Add user", (done) => {
      let user = { name: "test", password: "testPassword" }
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
  describe("invalid login", () => {
    it("Login user", (done) => {
      let user = { name: "test", password: "wrongPassword" };
      chai.request(server)
        .post("/users/auth")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          done();
        });
    });
  });

  describe("valid login", () => {
    it("Login user", (done) => {
      let user = { name: "test", password: "testPassword" };
      chai.request(server)
        .post("/users/auth")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          token = res.body.token;
          done();
        });
    });
  });

  describe("get user", () => {
    it("Login user", (done) => {
      chai.request(server)
        .get("/users/auth")
        .set("x-auth-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("modify", () => {
    it("Change password", (done) => {
      let user = { password: "newPassword" };
      chai.request(server)
        .post("/users/modify")
        .send(user)
        .set("x-auth-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});

describe("Decks", () => {
  before((done) => {
    Decks.deleteOne({ name: "test_deck" }, (err) => {
      done();
    });
  });

  describe("add deck", () => {
    it("Add deck", (done) => {
      let deck = { name: "test_deck" }
      chai
        .request(server)
        .post("/decks/addDeck")
        .send(deck)
        .set("x-auth-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("msg");
          done();
        });
    });
  });

  describe("edit deck", () => {
    it("Edit deck", async (done) => {
      deck = await Decks.findOne({ name: "test_deck" })
      let d = { deckId: deck._id, tags: ["hello"] }
      chai
        .request(server)
        .post("/decks/editDeck")
        .send(d)
        .set("x-auth-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });


});

describe("Cards", () => {
  before((done) => {
    Cards.deleteOne({ deckId: deck._id }, (err) => {
      done();
    });
  });

  describe("add card", () => {
    it("Add card", (done) => {
      let card = { deckId: deck._id, content: "hello mate", question: "how are you?", answer: "fine" }
      chai
        .request(server)
        .post("/cards/addCard")
        .send(card)
        .set("x-auth-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("msg");
          done();
        });
    });
  });

  describe("edit card", () => {
    it("Edit card", async (done) => {
      card = await Cards.findOne({ deckId: deck._id })
      let c = { cardId: card._id, content: "Changed content" }
      chai
        .request(server)
        .post("/cards/editCard")
        .send(c)
        .set("x-auth-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("msg");
          done();
        });
    });
  });
});

describe("Quiz", () => {
  before((done) => {
    Quiz.deleteOne({ deckId: deck._id }, (err) => {
      done();
    });
  });

  // describe("add quiz", () => {
  //   it("Add quiz", (done) => {
  //     let quiz = { deckId: deck._id, score: 1, responses: [{ card: deck.cards[0], answer: "welcome", correct: true }] }
  //     console.log(deck)
  //     chai
  //       .request(server)
  //       .post("/quiz/addQuiz")
  //       .send(quiz)
  //       .set("x-auth-token", token)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a("object");
  //         res.body.should.have.property("msg");
  //         done();
  //       });
  //   });
  // });

  // describe("get quiz", () => {
  //   it("Get quiz", (done) => {
  //     chai
  //       .request(server)
  //       .get("/quiz/getQuiz")
  //       .set("x-auth-token", token)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a("array");
  //         done();
  //       });
  //   });
  // });
});

describe("Delete all test inputs", () => {
  describe("delete card", () => {
    it("Delete card", (done) => {
      let c = {
        cardId: card._id
      }
      chai
        .request(server)
        .post("/cards/deleteCard")
        .send(c)
        .set("x-auth-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("msg");
          done();
        });
    });
  });

  describe("delete deck", () => {
    it("Delete deck", (done) => {
      let d = { deckId: deck._id }
      chai
        .request(server)
        .post("/decks/deleteDeck")
        .send(d)
        .set("x-auth-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("msg");
          done();
        });
    });
  });
});
