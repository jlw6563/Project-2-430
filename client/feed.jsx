const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

//Handles creating a new post
//Callback for when a post is created
const handlePost = (e, onPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#postText').value;
    

    if(!text) {
        helper.handleError('All fields are required');
        return false;
    }

    //Makes post request and has a callback
    helper.sendPost(e.target.action, {text}, onPostAdded);
    return false;
}

//React component of the post creation form
const PostForm = (props) => {
    return (
    <form id="postForm"
        //Callback from props gets called when the post request completes
        onSubmit={(e) => handlePost(e,props.triggerReload)}
        name='postForm'
        action='/makePost'
        method='POST'
    >
        
        <input type="text" name="name" id="postText" placeholder='Post text'/>
        <input type="submit" value="Create Post" />
    </form>
    );
};

//Handles unfollowing an account
const unfollowRequest = (e, post, setFollowState) => {
        e.preventDefault();
        helper.hideError();
    
        //Sends the post request and once it's completed updates following to be false
        helper.sendPost(e.target.action, {accountFollow: post.ownerId}, () => {setFollowState(false)});
    
        return false;
    
}

//Handles following an account
const followRequest = (e, post, setFollowState) => {
        e.preventDefault();
        helper.hideError();
    
        //Similar to unfollow except sets it to true
        helper.sendPost(e.target.action, {accountFollow: post.ownerId}, () => {setFollowState(true)});

        return false;
}

//Follow button React componenet
const FollowButtons = (props) => {
    //If the user doesn't own the post
    if(props.post.owns === false){
        //Create following states
        const [followState, setFollow] = useState(props.post.following);

        //Depending on the state renders a follow or unfollow button
        if(followState){
            return ( <form id="unfollow"
            name=""
            onSubmit={(e) => unfollowRequest(e, props.post, setFollow)}
            action="/unfollow"
            method="POST">
                <input type="submit"  value="Unfollow"/>
            </form>);
        }
        else {
            return ( <form id="follow"
            name=""
            onSubmit={(e) => followRequest(e, props.post, setFollow)}
            action="/follow"
            method="POST">
                <input type="submit" value="Follow"  />
            </form>); 
        }
    }
}

//Verified icon React component
const VerifiedIcon = (props) => {
    //If the account is verified then rednder the icon
    if(props.verified) { 
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-check" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
            <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z"/>
        </svg>
        );
    }
    else return;
}

//THe post React component
const PostObject = (props) => {
        return (
            <div  key={props.post.id} className='post-card container'>
                <div className="row">
                    <div className="eight columns">
                        <h3 >{props.post.username}    
                            <span>  <VerifiedIcon verified={props.post.verified}/></span>
                             <hr/>
                        </h3>  
                    </div>
                    <div className="four columns">
                        <FollowButtons post={props.post}/>
                    </div>

                </div>
                
                <div className='row'>
                    <div className='eight columns offset-by-two'>
                        <p>{props.post.text}</p>
                    </div>
                </div>
                
            </div>
        );
    }

//React compoenent that contains all the posts
const PostsDisplay = (props) => {
    //For handling new posts being created
    const [posts, getPosts] = useState(props.posts);

    //Makes it so the server is constantly making requests
    useEffect(() => {
        //Loads the posts from the server
        const loadPostsFromServer = async () => {
            const response = await fetch('/getPosts');
            const data = await response.json();
            getPosts(data.posts);
        };
        loadPostsFromServer();
    }, [props.reloadPosts]);

    //If no post return this empty saying there are no posts
    if(posts.length === 0){
        return (
            <div>
                <h3>No Posts Yet!</h3>
            </div>
        );
    };

    
    //Array of posts passes them into the post object
    const postNodes = posts.map(post =>
        <PostObject post={post} />
    );

    //Returns the list of post components
    return (
        <div>
            {postNodes}
        </div>
    );
};

//Similar to above component excpet for displaying posts of accounts you follow
const FollowingPostsDisplay = (props) => {
    const [posts, getPosts] = useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            //Only difference is the request we make
            const response = await fetch('/getFollowingPosts');
            const data = await response.json();
            getPosts(data.posts);
        };
        loadPostsFromServer();
    }, [props.reloadPosts]);

    if(posts.length === 0){
        return (
            <div>
                <h3>No Posts Yet!</h3>
            </div>
        );
    };

    

    const postNodes = posts.map(post =>
        <PostObject post={post} />
    );

    return (
        <div>
            {postNodes}
        </div>
    );
};

//React compoenent that handles which feed should be displayed the following one or the entire one
const FeedDisplay = (props) => {
    if(props.tab == "feed"){
        return (
            <PostsDisplay posts={props.posts} reloadPosts={props.reloadPosts}/>
        );
    }else {
        return (
            <FollowingPostsDisplay posts={props.posts} reloadPosts={props.reloadPosts}/>
        )
    }
}

const App = () => {
    //For handling posts being reloaded
    //For switching between tabs
    const [reloadPosts, setReloadPosts] = useState(false);
    const [activeTab, switchTabs] = useState('feed')

    return (
        <div className='container'>
            <div className='row center-box'>
                <button type='button' onClick={() => {switchTabs('following')}}>Following</button>
                <button type='button' onClick={() => {switchTabs('feed')}}>Feed</button>
            </div>

            <div id="errorContainer" class='hidden'>
                <h3 className='error-text'><span id="errorMessage"></span></h3>
             </div>
            <div id="makePost" className='row center-box'>
                <PostForm triggerReload={() => setReloadPosts(!reloadPosts)}/>
            </div>
            <div className='row'>
                <div className='ten columns offset-by-one'>
                    <FeedDisplay tab={activeTab} posts={[]} reloadPosts={reloadPosts}/>
                </div>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);
};

window.onload = init;