import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
var trashEmpty = true;

env.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {

  const date = new Date();

  const result = await db.query("SELECT entry FROM toDoList ORDER BY entry_order ASC");

  const deletedData = await db.query("SELECT * FROM deleted_items");
  const deletedItems = deletedData.rows;
  //console.log(deletedItems);

  trashEmpty = true; //changes to false if any item in the forEach loop is not cleared
  await deletedItems.forEach((item) => { //deletes any items in the trash that is more than 2 weeks old
    const itemDate = new Date(item.date);
    if (daysBetween(date, itemDate) > 14) {
      const clear = db.query("DELETE FROM deleted_items WHERE id=($1)", [item.id]);
    } else {
      trashEmpty = false;
    }
  });

  const items = result.rows.map((item) => {
    return item.entry;
  });
  console.log(items);
  console.log(trashEmpty);
  res.render("index.ejs", { itemList: items, noTrash: trashEmpty});
});

app.post("/submit", async (req, res) => {
  const item_entry = req.body["item-entry"];
  console.log(item_entry);
  const result = await db.query("INSERT INTO toDoList (entry) VALUES ($1)", [item_entry]);
  res.redirect("/");
});

app.post("/clicked", async (req, res) => {
  const finishedItem = req.body.item;
  const date = new Date();
  const dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  
  //console.log(date);
  //console.log(dateString);

  //console.log(finishedItem);
  const storeTrash = await db.query("INSERT INTO deleted_items (entry, date) VALUES ($1, $2)", [finishedItem, dateString]);
  const result = await db.query("DELETE FROM todolist WHERE entry=($1)", [finishedItem]);
  trashEmpty = false;
  res.redirect("/");
});

app.post("/restore", async (req, res) => {
  const result = await db.query("SELECT entry FROM deleted_items");
  const trash = result.rows.map((item) => {
    return item.entry;
  });
  
  if (trash.length > 0) {
    //console.log(trash);
    const toDelete = trash[trash.length - 1];
    //console.log(toDelete);
    const restoreTrash = await db.query("INSERT INTO toDoList (entry) VALUES ($1)", [toDelete]);
    const eliminate = await db.query("DELETE FROM deleted_items WHERE entry=($1)", [toDelete]);
  }

  if (trash.length === 1) {
    trashEmpty = true;
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const prev_item = req.body["prev_item"];
  const new_item = req.body["edit-input"];
  console.log("Previous item: " + prev_item);
  console.log("New item: " + new_item);
  const result = await db.query("UPDATE toDoList SET entry = ($1) WHERE entry = ($2)", [new_item, prev_item]);
  res.redirect("/");
});

app.post('/update-order', async (req, res) => {
  const updatedOrder = req.body.order;
  /*console.log("UPDATED ORDER");
  updatedOrder.forEach(item => {
    console.log("Item:", item);
  });*/
  const result = await db.query("SELECT id FROM todolist ORDER BY id ASC");
  const idList = result.rows;

  const updatePromises = updatedOrder.map(async item => {
    const id = idList[item.id - 1].id;
    const entry = item.entry;
    console.log("ENTRY: " + entry);
    console.log("ID: " + id + "ENTRY: " + "      ORDER:  " + item.order);
    await db.query(`UPDATE todolist SET entry_order = $1 WHERE entry = $2`, [item.order, item.entry]);
  });

  // Wait for all update operations to complete
  await Promise.all(updatePromises);

  // Send a successful response
  res.json({ success: true, message: "Order updated successfully" });
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//----------------------------
function daysBetween(date1, date2) {
  const dayValue = 1000 * 60 * 60 * 24;
  const date1_ms = date1.getTime();
  const date2_ms = date2.getTime();
  //console.log(date1_ms);
  //console.log(date2_ms);
  const difference_ms = Math.abs(date2_ms - date1_ms);
  //console.log(difference_ms/dayValue);
  return Math.round(difference_ms/dayValue);
}