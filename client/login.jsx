const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();


    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

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

    helper.sendPost(e.target.action, {username, pass, pass2, creditCard});

    return false;

}

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

    helper.sendPost(e.target.action, {username, oldPass, pass, pass2});

    return false;
}

const LoginWindow = (props) => {
    return (
                <form id="loginForm"
                name="loginForm"
                onSubmit={handleLogin}
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

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
        name="signupForm"
        onSubmit={handleSignup}
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

const ChangePassWindow = (props) => {
    return (
        <form id="changePassForm"
        name="changePassForm"
        onSubmit={handleChangePass}
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

    root.render(<LoginWindow/>);
};

window.onload = init;