const Router = require('./Router')
const UserService = require('../services/UserService')

class UserRouter extends Router {

    constructor () {
        super()

        this.post({
            endpoint: '/user/',
            callback: this.createUser.bind(this),
            requiredFields: [{name: 'mail', format: 'email'}]
        })

        this.post({
            endpoint: '/user/active',
            callback: this.activeUser.bind(this),
            requiredFields: [{name: 'userId'}, {name: 'activationKey'}, {name: 'password'}]
        })

        this.get({
            endpoint: '/user',
            callback: this.getUser.bind(this),
            authentication: true
        })

        this.put({
            endpoint: '/user',
            callback: this.updateUser.bind(this)
        })

        this.delete({
            endpoint: '/user',
            callback: this.deleteUser.bind(this)
        })
    }

    async createUser (req) {
        const userCreation = await UserService.createUser(req.body)

        if (!userCreation.success) {
            return this.response(400, {}, {code: userCreation.code})
        }

        this.response(200, userCreation.data)
    };

    async activeUser (req) {
        const userActivation = await UserService.activeUser(req.body)

        if (!userActivation.success) {
            return this.response(400, {}, {code: userActivation.code})
        }

        this.response(200, {message: 'User is now active'})
    };

    deleteUser (req, res) {
        //@TODO UserService Delete Function
    };

    updateUser (req, res) {
        //@TODO UserService Update Function
    };

    getUser (req) {
        this.response(200, req.user.object)
    };

}

module.exports = new UserRouter()
