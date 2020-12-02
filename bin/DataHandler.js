let fs = require("fs");
let path = require("path");

module.exports = {
    fetch: function () {
        // Creates promise for Fetching data
        return new Promise(function (resolve, reject) {
            // Defines correct file
            let file = path.join(__dirname, `../data/OldTweets.json`)

            // Reads dir sync so it can get the correct ifle
            const content = fs.readFileSync(file, 'utf8', async function readFileCallback(err, data) {
                // Returns error if that happens
                if (err) return err

                // Returns parsed
                return JSON.parse(data)
            })
            // Resolves content
            resolve(content)
        })
    },

    update: function (newData) {
        // Get's file
        let file = path.join(__dirname, `../data/OldTweets.json`)

        // Write new json to file
        fs.writeFile(file, newData, 'utf8', function (err) {
            if (err) throw err
            return 'Success!'
        })
    }
}