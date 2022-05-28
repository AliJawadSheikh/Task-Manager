require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndRemove('628fe5cc8e6624178c2868e3').then(res => {
//         console.log(res);
//         return Task.countDocuments({ completed: false });
//     }).then(cnt => console.log(cnt))
//     .catch(e => console.log(e))

const removeAndCountTask = async(id, completed) => {
    const removed = await Task.findByIdAndRemove(id);
    const count = await Task.countDocuments({ completed })
    return [removed, count];
};

removeAndCountTask('628fd8fa965b34a285f7e118', false)
    .then(res => console.log(res))
    .catch(e => console.log(e));