const baseUrl = 'https://ih-crud-api.herokuapp.com/characters';

const getCharacters = () => {
    // get characters from the api
    axios.get(baseUrl).then(response => {
        const data = response.data;
        console.log(response);
        let str = '';

        data.forEach(character => {
            str += `<li>${character.id} ${character.name}</li>`;
        });

        // insert characters in the list in the html
        document.getElementById('characters-list').innerHTML = str;
    });
};


getCharacters();

// document.querySelector('form').onsubmit = event => {
//     event.preventDefault();
//     const name = document.getElementById('name').value;
//     const occupation = document.getElementById('occupation').value;
//     const debt = document.getElementById('debt').checked; // checkbox
//     const weapon = document.getElementById('weapon').value;

//     console.log(name, occupation, debt, weapon);


// };


// refactored to async await :

// we need to put the async keyword in front of the function
document.querySelector('form').onsubmit = async event => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const occupation = document.getElementById('occupation').value;
    const debt = document.getElementById('debt').checked; // checkbox
    const weapon = document.getElementById('weapon').value;

    console.log(name, occupation, debt, weapon);

    // we add a try catch for the error handling
    try {
        // every async operation we prepend with the await keyword
        const response = await axios.post(baseUrl, { name, occupation, debt, weapon });
        // const user = await User.find();
        console.log(response);
    } catch (err) {
        console.log(err);
    }
};


