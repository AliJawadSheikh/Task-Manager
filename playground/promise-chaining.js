require('../src/db/mongoose');
const User = require('../src/models/user');

//6291e1d28192cd2022189ada

// User.findByIdAndUpdate('6291e1d28192cd2022189ada', {
//         age: 28
//     }).then(user => {
//         console.log(user);
//         return User.countDocuments({ age: 25 });
//     }).then(count => console.log(count))
//     .catch(e => console.log(e))

const updateAgeAndCount = async(id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount('6291e1d28192cd2022189ada', 21)
    .then(count => console.log(count))
    .catch(e => console.log(e))