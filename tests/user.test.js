const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should sign up new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "John",
      email: "john@mail.com",
      password: "john123",
    })
    .expect(201);
  //Assert that database was changed correctly
  const user = await User.findById(response.body.user._id);
  // expect response not to be null
  expect(user).not.toBeNull();

  //Assertions about the response
  // expect(response.body.user.name).toBe('John')
  expect(response.body).toMatchObject({
    user: {
      name: "John",
      email: "john@mail.com",
    },
    token: user.tokens[0].token,
  });
  // expect user password not to be string
  expect(user.password).not.toBe("john123");
});

test("Should login user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  // expect new token is added
  expect(response.body.token).not.toBeNull;
  const user = await User.findById(userOneId);
  // expect new token is match to user second token
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "jane@mail.com",
      password: "jane123",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthorized user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  // expect user is deleted
  const user = await User.findById(userOneId);
  expect(user).toBeNull;
});

test("Should not delete unauthorized user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  const user = await User.findById(userOneId);
  // expect({}).toBe({}); // fails because javasdript  strict comparsion mode (===)
  expect(user.avatar).toEqual(expect.any(Buffer)); // expet to be Type: Buffer
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Reiokr" })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe("Reiokr");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "Tartu" })
    .expect(400);
});
