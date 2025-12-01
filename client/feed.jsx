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
        <label htmlFor="name">Text: </label>
        <input type="text" name="name" id="postText" placeholder='Post text'/>
        <input type="submit" value="Create Post" />
    </form>
    );
};

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
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    };

    const postNodes = posts.map(post => {
        return (
            <div  key={post.id}>
                <h3 >{post.owner.username}</h3>
                <p>{post.text}</p>
            </div>
        );
    });

    return (
        <div className="domoList">
            {postNodes}
        </div>
    );
};

const App = () => {
    const [reloadPosts, setReloadPosts] = useState(false);

    return (
        <div>
            <div id="makePost">
                <PostForm triggerReload={() => setReloadPosts(!reloadPosts)}/>
            </div>
            <div id="domos">
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