import request from "supertest";
import app from "../server.js";
import User from "../models/User.model.js";
import { minAge } from "../utils/constants.js";

let userId;
let cookie;
let adminCookie;

describe("Wrong routes", () => {
  it("should return 404 if the route is not found", async () => {
    const res = await request(app).post("/api/user/notfound");
    expect(res.status).toBe(404);
  });
});

describe("User creates an account", () => {
  it("shouldn't sign up a new user without a username", async () => {
    const res = await request(app).post("/api/user/signup").send({
      email: "unit@test.com",
      password: "uN1t3st!",
      lastname: "test",
      firstname: "unit",
      gender: "other",
      age: "18",
    });
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty("message", "Validation failed:");
    expect(res.body.data[0]).toHaveProperty(
      "msg",
      "Username can only contain alphanumeric characters",
    );
  });

  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/user/signup").send({
      username: "unittest",
      email: "unit@test.com",
      password: "uN1t3st!",
      lastname: "test",
      firstname: "unit",
      gender: "other",
      age: "18",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Registration successful");
  });

  it("should not sign up a new user with an existing username", async () => {
    const res = await request(app).post("/api/user/signup").send({
      username: "unittest",
      email: "unit@test.com",
      password: "uN1t3st!",
      lastname: "test",
      firstname: "unit",
      gender: "other",
      age: "18",
    });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty(
      "message",
      "A user with the given username is already registered",
    );
  });
});

describe("User logs in", () => {
  it("should sign in a user", async () => {
    const res = await request(app).post("/api/user/signin").send({
      username: "unittest",
      password: "uN1t3st!",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Authentication successful!");
    cookie = res.headers["set-cookie"];
  });

  it("should not sign in a user with wrong credentials", async () => {
    const res = await request(app).post("/api/user/signin").send({
      username: "unittest",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "Password or username is incorrect",
    );
  });

  it("should sign in an admin", async () => {
    const res = await request(app).post("/api/user/signin").send({
      username: "AdminUnitTest",
      password: "uN1t3st!",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Authentication successful!");
    adminCookie = res.headers["set-cookie"];
  });

  afterAll(async () => {
    const user = await User.findOne({ username: "unittest" });
    if (user) {
      userId = user._id;
    }
  });
});

describe("Enforce security rules", () => {
  it("should return return 200 if password is correct", async () => {
    const res = await request(app)
      .post("/api/user/check-password")
      .send({
        password: "uN1t3st!",
      })
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Correct Password");
  });

  it("should return return 401 if password is wrong", async () => {
    const res = await request(app)
      .post("/api/user/check-password")
      .send({
        password: "wrongpassword",
      })
      .set("Cookie", cookie);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Wrong Password");
  });
});

describe("Actions for normal user", () => {
  it("should return user newly created", async () => {
    const res = await request(app)
      .get(`/api/user/${userId}`)
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User found");
    expect(res.body.data).toHaveProperty("username", "unittest");
  });

  it("shouldn't return all users since user is not admin", async () => {
    const res = await request(app)
      .get("/api/user/allUsers")
      .set("Cookie", cookie);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      "message",
      "You are not allowed to perform this action",
    );
  });

  it("should change password", async () => {
    const res = await request(app)
      .put("/api/user/change-password")
      .send({
        oldPassword: "uN1t3st!",
        password: "UniTe5t?",
        repeatPassword: "UniTe5t?",
      })
      .set("Cookie", cookie);
    expect(res.status).toBe(204);
  });

  it("shouldn't update user if at least one condition is not met", async () => {
    const res = await request(app)
      .put(`/api/user/update/${userId}`)
      .send({
        age: "12",
      })
      .set("Cookie", cookie);
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty("message", "Validation failed:");
    expect(res.body.data[0]).toHaveProperty(
      "msg",
      `Age must be greater or equal to ${minAge} years`,
    );
  });

  it("should update user", async () => {
    const res = await request(app)
      .put(`/api/user/update/${userId}`)
      .send({ age: "40" })
      .set("Cookie", cookie);
    expect(res.status).toBe(204);
  });

  it("shouldn't change role of another user since user is not admin", async () => {
    const res = await request(app)
      .put("/api/user/change-role")
      .send({ userId, role: "admin" })
      .set("Cookie", cookie);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      "message",
      "You are not allowed to perform this action",
    );
  });

  it("should sign out user", async () => {
    const res = await request(app)
      .get("/api/user/signout")
      .set("Cookie", cookie);
    expect(res.status).toBe(205);
  });
});

describe("Actions for admin", () => {
  it("should return all users since user is admin", async () => {
    const res = await request(app)
      .get("/api/user/allUsers")
      .set("Cookie", adminCookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Users found");
  });

  it("should change role of another user since user is admin", async () => {
    const res = await request(app)
      .put("/api/user/change-role")
      .send({ userId, role: "admin" })
      .set("Cookie", adminCookie);
    expect(res.status).toBe(204);
  });

  it("should remove user", async () => {
    const res = await request(app)
      .delete(`/api/user/remove/${userId}`)
      .set("Cookie", adminCookie);
    expect(res.status).toBe(204);
  });

  it("should sign out user", async () => {
    const res = await request(app)
      .get("/api/user/signout")
      .set("Cookie", adminCookie);
    expect(res.status).toBe(205);
  });
});
