const User = require('../models/User')
const Listing = require('../models/Listing')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

//@desc Get users by username
//@route GET /users/:id
//@access Private
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).lean().exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    res.json(user)
})

//@desc Create new user
//@route POST /users
//@access Private
const createNewUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { username, password, email, roles, avatar } = req.body

    //confirm data
    if (!username || !password || !email || !Array.isArray(roles) || !roles.length || !avatar) {
        return res.status(400).json({ message: 'All fields are required!' })
    }
    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate userame!' })
    }

    //hash password
    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashedPwd, email, roles, avatar }

    //create and store new user
    const user = await User.create(userObject)

    if (user) { //created
        res.status(201).json({ message: `New User ${username} created!` })
    } else { res.status(400).json({ message: 'Invalid user data received' }) }

})

//@desc Update user
//@route PUT /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {

    console.log(req.body)

    const { id, username, password, email, roles, avatar } = req.body

    //confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || !email || !avatar) {
        return res.status(400).json({ message: 'All fields are required!' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    //Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username!' })
    }
    user.username = username
    user.roles = roles
    user.email = email
    user.avatar = avatar

    if (password) {
        //hash new password
        user.password = await bcrypt.hash(password, 10)
    }
    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated!` })
})

//@desc Delete user
//@route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }
    const listing = await Listing.findOne({ user: id }).lean().exec()
    if (listing) {
        return res.status(400).json({ message: 'User has listings! Delete all listings first!' }) // this can be made to warn user and delete listings too.
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found!' })
    }
    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted successfully!`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    getUser,
    createNewUser,
    updateUser,
    deleteUser
}