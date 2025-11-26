# MongoDB Storage Information

## Where Your Tasks Are Stored

### Database Name
**`todoapp`**

This is specified in the MongoDB connection string:
```
mongodb://localhost:27017/todoapp
                                    ^^^^^^^
                                    Database name
```

### Collection Name
**`todos`**

This is where individual todo items (documents) are stored.

## Important: Collections Are Created Automatically

**MongoDB collections are created lazily** - this means:
- The collection **doesn't exist** until you insert the **first document**
- If you see "no collections" in MongoDB Compass or other tools, it means **no todos have been created yet**

## How to See Your Collections

### Option 1: Create a Todo First
1. Start your backend: `npm run start:dev`
2. Start your frontend: `npm run dev`
3. Go to `http://localhost:3000` (or whatever port your frontend is on)
4. Create a todo using the form
5. Now check MongoDB - you should see the `todos` collection!

### Option 2: Using MongoDB Compass
1. Connect to: `mongodb://localhost:27017`
2. Select the database: **`todoapp`**
3. Look for the collection: **`todos`**
4. If you don't see it, try creating a todo from the app first

### Option 3: Using MongoDB Shell (mongosh)
```bash
# Connect to MongoDB
mongosh

# Switch to the todoapp database
use todoapp

# Show collections (will be empty until first todo is created)
show collections

# If collection exists, view documents
db.todos.find()

# Count documents
db.todos.countDocuments()
```

## Data Structure

Each todo document in the `todos` collection looks like this:

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Buy groceries",
  "description": "Milk and eggs",
  "completed": false,
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

## Troubleshooting

**Q: I don't see the `todos` collection in MongoDB Compass**
- **A:** Create at least one todo from the frontend first. Collections are created automatically when the first document is inserted.

**Q: I see the database `todoapp` but no collections**
- **A:** This is normal! The collection will appear after you create your first todo.

**Q: How do I check if my backend is connected to MongoDB?**
- **A:** Look at the backend console. When it starts successfully, it should show connection messages. If there's a connection error, you'll see it in the console.

**Q: Where can I verify the connection string?**
- **A:** Check `backend/src/app.module.ts` or your `backend/.env` file for `MONGODB_URI`

## Connection Details Summary

- **Host:** localhost
- **Port:** 27017 (MongoDB default)
- **Database:** todoapp
- **Collection:** todos
- **Full Connection String:** `mongodb://localhost:27017/todoapp`

