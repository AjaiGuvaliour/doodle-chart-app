module.exports = validationMsg = (error) => {
    let errors = '';
    const promise = new Promise((resolve) => {
        for (let err in error) {
            errors = `${error[err]['message']} ${errors}`
        }
        resolve(errors);
    })
    return promise;
}