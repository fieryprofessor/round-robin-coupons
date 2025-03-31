
# Coupon Distributor - Backend

This is the backend of the Round-Robin Coupon Distribution System, built using Node.js and Express.js. It handles coupon distribution, guest session management, and provides an admin panel to manage coupons, track claims, and control coupon availability. The backend is connected to MongoDB for data storage and enforces security measures like rate limiting and CORS handling.    
   



### Models  

The `models` folder contains the following database models:  

- **Coupon Model:** Stores information about coupons, including their code, claim status, and assigned users.  
- **Admin Model:** Manages admin credentials for authentication and access to the admin panel. 
### Middlewares  

The `middleware` folder contains essential middlewares for handling various backend functionalities:  

- **Authentication Middleware:**  
  Ensures only authorized admin users can access protected routes.  

- **Rate Limiter Middleware:**  
  Limits API requests to prevent abuse. For the **claimed coupons route**, users can make a maximum of **10 API requests every 5 minutes**. If the limit is exceeded, the user will receive a "Too many requests" message.  

- **Guest Session Middleware:**  
  Assigns a unique guest identifier (cookie-based) to track users who claim coupons while preventing multiple claims in a short period.  
  - The guest cookie **persists for 1 hour** to allow users to claim coupons while enforcing the cooldown period.  

### Routes  

The `routes` folder contains API endpoints to manage the coupon system.  

#### **Admin Routes (`/api/admin`)**  
The **admin route** provides various functionalities for managing coupons:  

- **POST `/login`** - Authenticate admin user.  
- **GET `/coupons`** - View all available and claimed coupons.  
- **POST `/coupons`** - Add a new coupon.  
- **DELETE `/coupons/:id`** - Delete a specific coupon by ID.  
- **DELETE `/coupons`** - Delete all coupons from the database.  
- **PUT `/coupons/:id`** - Edit a coupon by its ID.  
- **GET `/history`** - View user claim history.  
- **PUT `/coupons/toggle/:id`** - Toggle a specific coupon’s availability.  
- **PUT `/coupons/toggle-all`** - Toggle availability for all coupons.  

These routes enable complete control over coupon distribution and tracking.  

### Scripts  

The `scripts` folder contains utility scripts for setting up the admin and populating the database with coupons.  

#### **1. CreateAdmin Script (`CreateAdmin.js`)**  
- This script is used to create a new admin.  
- Edit the **`username`** and **`password`** variables to define the admin credentials.  
- Run the script using **`node ./scripts/CreateAdmin.js`** to create the admin.  
- If an admin with the same credentials already exists, it will display a message indicating so.  

#### **2. Populate Coupons Script (`populateCoupons.js`)**  
- This script adds sample coupons to the database.  
- Modify the **`sampleCoupons`** array to add custom coupons.  
- Note: The default coupons already exist in the database, so running the script without changes may not work unless those coupons are deleted first.  
- Run the script using **`node ./scripts/populateCoupons.js`** to insert the coupons into the database.  

These scripts help in quickly setting up and managing the coupon system.  
### Server (`server.js`)  

The **main server file** is responsible for setting up and running the backend for the Round-Robin Coupon Distribution system.  

#### Key Functionalities  
- Initializes the **Express server**.  
- Connects to **MongoDB** for data storage.  
- Uses **CORS** to allow frontend communication with proper credentials.  
- Parses **JSON** and **cookies** using `express.json()` and `cookie-parser`.  
- Implements **middleware** for authentication, rate limiting, and guest session management.  
- Provides an **Admin API** at `/api/admin` for managing coupons.  
- Implements the **Coupon Claiming API** with cooldown restrictions.  

#### Coupon Claiming API (`/api/coupon`)  
- **Checks for a valid guest session** using either a **guest ID** or the user's **IP address**.  
- **Enforces a cooldown period** of **10 minutes**, preventing users from claiming multiple coupons too quickly.  
- **Finds and assigns an available coupon**, marking it as **claimed** in the database.  
- **Returns appropriate messages** if:  
  - A user is **within the cooldown period**.  
  - **No coupons are available** at the moment.  

#### Middleware Used in Server  
- **`guestsession`**: Ensures guest users are tracked via cookies, which persist for **1 hour**.  
- **`limiter`**: Enforces a **rate limit of 10 API requests per 5 minutes** for claiming coupons.  

#### Starting the Server  
Make sure you have your **MongoDB URI** and **environment variables** set up in a `.env` file, then run:  

**`node server.js`**

## Backend Deployed Link  

[Coupon Distributor (Backend)](https://round-robin-coupons-5914.onrender.com)  

**Note:** This link is only for reference. If you visit it directly in a browser, it will not display anything and may show a message like **"Cannot GET /"** because it is a backend server that serves data to the frontend, not a web page.
## Authors

- [@fieryprofessor](https://www.github.com/fieryprofessor)

