# 📝 Blog Platform

![image alt](https://github.com/munagalamose/Blogging-Platform/blob/d05d40721a9fee7af725224d56d3f0c93f1cb3ae/Screenshot%202025-07-02%20211346.png)

![image alt](https://github.com/munagalamose/Blogging-Platform/blob/8b42f618d12d66beaa87ef12c07dbfdc47fb3d91/Screenshot%202025-07-03%20062908.png)

![image alt](https://github.com/munagalamose/Blogging-Platform/blob/7966515a08bfbf7e72e4c717b3d19ed524c7c0f1/Screenshot%202025-07-03%20063147.png)






A full-stack blog platform built with Node.js, Express, and MongoDB that allows users to sign up, log in, and manage their blog posts. Features include blog post creation, editing, and deletion, categorization using tags, search functionality, and a responsive design.

## 🚀 Features

🧑 User Profile Page: View a list of a user's own posts.

🗓️ Timestamps: Show when the blog was created or last edited.

💬 Comments System: Users can comment on blog posts.

🖼️ Image Upload: Allow uploading a featured image per post.

🌐 Pagination: Load more posts as user scrolls or page numbers.

⚙️ Admin Panel: Manage users and posts (for moderators).

- 🔐 **User Authentication**  
  Secure login and signup using Passport.js and bcrypt for password hashing.

- 📝 **Blog Post Management**  
  Authenticated users can:
  - Create blog posts
  - Edit their posts
  - Delete their posts

- 🏷️ **Categorization / Tags**  
  Users can assign categories or tags to each post for better organization.

- 🔍 **Search Functionality**  
  Users can search for posts by title, tags, or content.

- 📱 **Responsive Design**  
  Accessible on desktop, tablet, and mobile using responsive CSS.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js, bcrypt
- **Templating Engine**: EJS
- **Frontend**: HTML, CSS, Bootstrap
- **Search & Filtering**: Querying with MongoDB and Mongoose

## 📁 Project Structure

blog-platform/
├── models/
│ ├── User.js
│ └── Post.js
├── routes/
│ ├── auth.js
│ └── posts.js
├── views/
│ ├── partials/
│ ├── auth/
│ └── posts/
├── public/
│ └── css/
├── .env
├── server.js
└── package.json

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB installed locally or use MongoDB Atlas

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/munagalamose/Blogging-Platform.git
   cd blog-platform

### npm install

MONGO_URI=mongodb://localhost:27017/blogPlatform
SESSION_SECRET=yourSecretKey

### npm start


### 🔐 Authentication Workflow
Signup: /auth/register

Login: /auth/login

Logout: /auth/logout

Uses sessions with express-session and Passport.js

### ✍️ Blog Post Management
Create: /posts/new

Edit: /posts/edit/:id

Delete: /posts/delete/:id

Posts visible on homepage and by category

### 🔎 Search & Filter
Search bar on homepage to search by:

Post title

Content keywords

Tags

### 📸 Screenshots
(Add screenshots of UI here if available)

### 📚 Useful Resources
Node.js API Docs

Express Tutorial

MongoDB Guide

Passport Auth Simplified

### 🧑‍💻 Author
munagala mose

### 📝 License
This project is open-source and available under the MIT License.


Let me know if you'd like this in a downloadable `.md` file, a GitHub README format, or need help writing the actual code behind this project.

