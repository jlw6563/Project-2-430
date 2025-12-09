const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

//Handles when a user clicks login button
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    //Gets values
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    //Sends the usernam and pass ad QP
    helper.sendPost(e.target.action, {username, pass});
    return false;
}

//Handles hitting the signup button
const handleSignup = (e) => {
     e.preventDefault();
    helper.hideError();


    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const creditCard = e.target.querySelector('#creditCard').checked;

    if(!username || !pass || !pass2){
        helper.handleError('Username or password is empty!');
        return false;
    }

    if(pass !== pass2) {
        helper.handleError('Passwords do not match');
        return false;
    }

    //Sends over QP
    helper.sendPost(e.target.action, {username, pass, pass2, creditCard});

    return false;

}

//Handles when user hits the change pass button
const handleChangePass = (e) => {
     e.preventDefault();
    helper.hideError();


    const username = e.target.querySelector('#user').value;
    const oldPass = e.target.querySelector('#oldPass').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!username || !pass || !pass2 || !oldPass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    if(pass !== pass2) {
        helper.handleError('Passwords do not match');
        return false;
    }

    //Sends a post request with QP
    helper.sendPost(e.target.action, {username, oldPass, pass, pass2});

    return false;
}

//Reacgt component that renders the login form
const LoginWindow = (props) => {
    return (
                <form id="loginForm"
                name="loginForm"
                onSubmit={handleLogin}

                //Action is the post request made when button is pressed
                action="/login"
                method="POST"
                className="mainForm">
                    <label htmlFor="username">Username:</label>
                    <input className="u-full-width" id="user" type="text" name="username" placeholder="username"/>
                    <label htmlFor="pass">Password:</label>
                    <input className="u-full-width" type="password" name="pass" id="pass" placeholder="password"/>
                    <label/>
                    <div className='center-box'>
                    <input  className="" type="submit" value="Sign in" />
                    </div>
                    <hr/>
                </form>
               
    );
}

//React componenet that renderers the signup form
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
        name="signupForm"
        onSubmit={handleSignup}

        //Action is the post request made when button is pressed
        action="/signup"
        method="POST">
            <label htmlFor="username">Username:</label>
            <input className="u-full-width" id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password:</label>
            <input className="u-full-width"type="password" name="pass" id="pass" placeholder="password"/>
            <label htmlFor="pass2">Password:</label>
            <input className="u-full-width" type="password" name="pass2" id="pass2" placeholder="retype password"/>
            
            <label>
                <input type='checkbox' name="creditCard" id='creditCard'></input>
                <span className='label-body'>Select to "enter" credit card details</span>
            </label>
            
            <div className='center-box'>
                    <input  className="" type="submit" value="Sign up" />
                    </div>
            <hr/>
        </form>
        
    );
}

//React component that renderers pass change form
const ChangePassWindow = (props) => {
    return (
        <form id="changePassForm"
        name="changePassForm"
        //Fucntion to call when submit is pressed
        onSubmit={handleChangePass}

        //Action is the post request made when button is pressed
        action="/changePass"
        method="POST"
        className="mainForm">
            <label htmlFor="username">Username:</label>
            <input className="u-full-width" id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="oldPass">Old Password:</label>
            <input className="u-full-width" type="password" name="oldPass" id="oldPass" placeholder="old password"/>
            <label htmlFor="pass">Password:</label>
            <input className="u-full-width" type="password" name="pass" id="pass" placeholder="password"/>
            <label htmlFor="pass2">Password:</label>
            <input className="u-full-width" type="password" name="pass2" id="pass2" placeholder="retype password"/>
            <label/>
            <div className='center-box'>
                    <input  className="" type="submit" value="Change password" />
                    </div>
        </form>
    );
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const changePassButton = document.getElementById('changePassButton')

    const root = createRoot(document.getElementById('content'));

    //Adds click event listener for navbar links
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow/>);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow />);
        return false;
    });

    changePassButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <ChangePassWindow />);
        return false;
    });

    //Renders the login window by defualt 
    root.render(<LoginWindow/>);
};

window.onload = init;