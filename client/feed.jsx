const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const personality = e.target.querySelector('#domoPersonality').value;

    if(!name || !age || !personality) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, personality}, onDomoAdded);
    return false;
}

const DomoForm = (props) => {
    return (
    <form id="domoForm"
        onSubmit={(e) => handleDomo(e,props.triggerReload)}
        name='domoForm'
        action='/maker'
        method='POST'
        className='domoForm'
    >
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" id="domoName" placeholder='Domo Name'/>
        <label htmlFor="age">Age: </label>
        <input type="number" name="age" id="domoAge" min='0'/>
        <label htmlFor="personality">Personality: </label>
        <input type="text" name="personality" id="domoPersonality" placeholder='Domo Personality'/>
        <input type="submit" value="Make Domo" className='makeDomoSubmit'/>
    </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if(domos.length === 0){
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    };

    const domoNodes = domos.map(domo => {
        return (
            <div className="domo" key={domo.id}>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3>Personality: {domo.personality}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)}/>
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);
};

window.onload = init;