# My Portfolio Project
My portfolio project (title undecided) is a web app that allows users to upload their own photographs and writing to their personal page.

## Audience
Anyone who would like to create their own cultivated page of content without the likes, followers, and pressure that social media brings. Content can include images, aesthetic colors, paragraphs, or even links to things they like. This web page could be used as a personal page or even a portfolio of projects.
​
## Experience
A user opens the web app and they see a welcome page where they can create their own account. They can then navigate to their own personal page where they can upload images or create text snippets which can be posted.

# Technical

## Models
- Users
- Posts
​
## Views
- Home 
- Log In
- New User
- Personal Page
- New Post 
 ​
## Routes
Home
- GET `/`

Personal Page
- GET `/users/:user-id`

New Post 
- GET `/users/:user-id/new`
- POST `/users/:user-id/:post-id`

Users
- GET `/login`
- POST `/login`
- GET `/logout`
- POST `/users/new`

## Other
- Mongo Database
- Express
- Bootstrap
​
# Milestones
## Week 4 - Usable Build
- Setup Database
- Connect CSS and Bootstrap
- Optimize routes for:
     - New Users
     - New Posts
     - User Page
- Add login/logout function
- Display posts on personal account (*will need help with this*)

## Week 5 - Finish Features
- Finish unfinished features
- Create landing page
- Order the personal page (newest posts on top)
- Format pages with CSS and Bootstrap
​
## Week 6 - Polish
- Finish formatting pages
- Try to break it and find bugs
- Connect to domain and server

## If there's time
- Create a feed with content from other users (Follow function?)
- Add a search feature
- Create pages for each individual post
