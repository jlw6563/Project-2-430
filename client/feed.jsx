const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handlePost = (e, onPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#postText').value;
    

    if(!text) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {text}, onPostAdded);
    return false;
}


const PostForm = (props) => {
    return (
    <form id="postForm"
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

const unfollowRequest = (e, post, setFollowState) => {
        e.preventDefault();
        helper.hideError();
    
        
        helper.sendPost(e.target.action, {accountFollow: post.ownerId}, () => {setFollowState(false)});
    
        return false;
    
}

const followRequest = (e, post, setFollowState) => {
        e.preventDefault();
        helper.hideError();
    

        helper.sendPost(e.target.action, {accountFollow: post.ownerId}, () => {setFollowState(true)});

        return false;
    
}


const FollowButtons = (props) => {
    if(props.post.owns === false){
        const [followState, setFollow] = useState(props.post.following);

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

const VerifiedIcon = (props) => {
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

const PostObject = (props) => {
        return (
            <div  key={props.post.id}>
                <h3 >{props.post.username} <span><VerifiedIcon verified={props.post.verified}/></span> 
                <span><FollowButtons post={props.post}/></span> </h3>


                <p>{props.post.text}</p>
                
            </div>
        );
    }

const PostsDisplay = (props) => {
    const [posts, getPosts] = useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const response = await fetch('/getPosts');
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

const App = () => {
    const [reloadPosts, setReloadPosts] = useState(false);

    return (
        <div>
            <div id="makePost" className='row'>
                <PostForm triggerReload={() => setReloadPosts(!reloadPosts)}/>
            </div>
            <div className='rows'>
                <PostsDisplay posts={[]} reloadPosts={reloadPosts}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);
};

window.onload = init;