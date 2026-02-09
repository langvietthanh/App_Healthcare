
class homeController {
    index(req, res) {
        res.send('THIS IS HOME');
    }
}

module.exports = new homeController();