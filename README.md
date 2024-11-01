# This is the front-end project for [FullstackAws](https:www.fullstackaws.onrender.com).

The fullstackaws project is a mock social network that implements a lot of aspects of a fully feature fullstack app using node.js and express on the back-end and React for the front-end (**_this_**). For more technical details and a full documentation of the back-end, check out its [repository](https://github.com/vtmattedi/fullstackAws)

## Features:
<details>
<summary style="font-weight: Bold; font-size:1.15em">Resposive:</summary>
The app is fully responsive and works in your computer, on your phone and anything in between.

![responsive](Images\responsive.gif)

</details>

<details>
<summary style="font-weight: Bold; font-size:1.15em">Create, edit and delete user and posts:</summary>
On this project you can create an account, edit its username and delete your account. You can also create posts, edit them, delete them.

![posts](Images\posts.gif)

![user](Images\user.gif)

</details>

<details>
<summary style="font-weight: Bold; font-size:1.15em">Error notifications and feedback:</summary>

![responsive](Images\responsive.gif)

</details>

<details>
<summary style="font-weight: Bold; font-size:1.15em">Global feed with realtime posts from all users:</summary>
You can see all posts by all users on the global feed. You can also go to the user's page if you click on their post, and the page will be update to reflect new and deleted posts.

![realtime](Images\realtime.gif)

</details>


<details>
<summary style="font-weight: Bold; font-size:1.15em">Search for users:</summary>
You can search for all users on the database (by username), you can also check their posts!

![stack](Images\stack.gif)

</details>


<details>
<summary style="font-weight: Bold; font-size:1.15em">Stack Navigation:</summary>
Whenever you travel to another's user page or to the global feed, you will be able to the last page you were in!

![stack](Images\stack.gif)

</details>




<details>
<summary style="font-weight: Bold; font-size:1.15em">Self Login using cookies:</summary>
The app will try to log you in using the refreshToken cookie. if successful you will go to your dashboard, if failed you will be redirected to the login page.

![session](Images\session-continue.gif)

</details>

<details>
<summary style="font-weight: Bold; font-size:1.15em">Automatic Token Handling:</summary>

The project have two main [hooks](src\AxiosIntercept\useAxios.ts) used for the request to the back-end: ```useAxios``` and ```useAxiosJwt```. The first is used to make requests associated with authentication: Login, logout, signup, deleteuser, etc. It always sends the authorization cookies. The second, always sends a jwt access token in the headers. Whenever this encounter an error with code 401 it requests a new access token using the refresh token cookie.

More documentation [here](https://github.com/vtmattedi/fullstackAws?tab=readme-ov-file#endpoints)


![theme](Images\autoretry.gif)

</details>

<details>
<summary style="font-weight: Bold; font-size:1.15em">Persistent dark and light mode:</summary>
The use can choose between dark and light mode. This preference is currently been stored using local storage, therefore it is not restored between devices, however it is stored with a user's ID so if multiple users use the app in the same device, each one can select their prefered theme and it will be loaded upon login.

![theme](Images\theme.gif)

<gif>
</details>

### Running the project:

This is a react project and therefore can be run using:

```shell
npm run start
```

However, it is only the front-end and will not work without a back-end, so you will need the [back-end](https://github.com/vtmattedi/fullstackAws) project too. When in development, the app uses the port 4500 (same as back-end), so you can run both projects, and go to localhost:3000
to develop the front-end. On production, it does not uses the port 4500, instead it uses the default https port (since on production the back-end also serves the app).

---
### Tecnologies:
![TS](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-226973?style=for-the-badge&logo=react&logoColor=61DAFB)
![bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

### Host on:
![Render](https://img.shields.io/badge/Render-563D7C?style=for-the-badge&logo=render&logoColor=white)

