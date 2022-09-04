const fsPromises = require("fs/promises");
const express = require("express");
const cors = require("cors");
const { wiki } = require("./wiki");

// HERE change the path :
const USER_LIST = "/Users/solene/Desktop/iznes-back/src/db/user.json";
const TASK_LIST = "/Users/solene/Desktop/iznes-back/src/db/task.json";

const IP_LOOPBACK = "localhost";
const PORT = 3333;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/wiki", wiki);

const getUser = async (req, res, next) => {
  try {
    const userListJson = await fsPromises.readFile(USER_LIST, "utf-8");
    res.send(userListJson);
  } catch (e) {
    res.status(401).send("Cannot get users");
  }
};

const addUser = async (req, res, next) => {
  try {
    const userListJson = await fsPromises.readFile(USER_LIST, "utf-8");
    const userList = JSON.parse(userListJson);
    const newUser = {
      id: Number(req.params.id),
      name: req.body.name,
      email: req.body.email,
    };
    userList.push(newUser);

    const newUserList = JSON.stringify(userList);
    await fsPromises.writeFile(USER_LIST, newUserList);
    next();
  } catch (e) {
    res.status(401).send("Cannot add user");
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userListJson = await fsPromises.readFile(USER_LIST, "utf-8");
    const userList = JSON.parse(userListJson);

    const newUserList = JSON.stringify(
      userList.filter((el) => el.id !== Number(req.params.id))
    );
    await fsPromises.writeFile(USER_LIST, newUserList);

    next();
  } catch (e) {
    res.status(401).send("Cannot delete user");
  }
};

const getTask = async (req, res, next) => {
  try {
    const taskListJson = await fsPromises.readFile(TASK_LIST, "utf-8");
    res.send(taskListJson);
  } catch (e) {
    res.status(401).send("Cannot get tasks");
  }
};

const addTask = async (req, res, next) => {
  try {
    const taskListJson = await fsPromises.readFile(TASK_LIST, "utf-8");
    const taskList = JSON.parse(taskListJson);
    const newTask = {
      id: Number(req.params.id),
      user_id: Number(req.body.user_id),
      title: req.body.title,
      description: req.body.description,
      creation_date: req.body.creation_date,
      status: req.body.status,
    };
    taskList.push(newTask);

    const newTaskList = JSON.stringify(taskList);
    await fsPromises.writeFile(TASK_LIST, newTaskList);
    next();
  } catch (e) {
    res.status(401).send("Cannot add task");
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskListJson = await fsPromises.readFile(TASK_LIST, "utf-8");
    const taskList = JSON.parse(taskListJson);

    const newTaskList = JSON.stringify(
      taskList.filter((el) => el.id !== Number(req.params.id))
    );
    await fsPromises.writeFile(TASK_LIST, newTaskList);

    next();
  } catch (e) {
    res.status(401).send("Cannot delete task");
  }
};

app.use("/user", getUser);
app.use("/addUser/:id", addUser);
app.use("/deleteUser/:id", deleteUser);

app.use("/task", getTask);
app.use("/addTask/:id", addTask);
app.use("/deleteTask/:id", deleteTask);

app.get("/user", (req, res) => {});
app.post("/addUser/:id", (req, res) => {});
app.delete("/deleteUser/:id", (req, res) => {});

app.get("/task", (req, res) => {});
app.post("/addTask/:id", (req, res) => {});
app.delete("/deleteTask/:id", (req, res) => {});

// start the server
app.listen(PORT, IP_LOOPBACK, () => {
  console.log(`Iznes app listening at http://${IP_LOOPBACK}:${PORT}`);
});
