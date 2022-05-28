const doWork = async() => {
    return 'Ali'
}
doWork().then(res => console.log(res))
    .catch(e => console.log(e))