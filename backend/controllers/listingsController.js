const { request } = require('express')
const Listing = require('../models/Listing')
const asyncHandler = require('express-async-handler')

//@desc Get all Listings
//@route GET /listings
//@access Private
const getAllListings = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    const filter = userId ? { userId } : {};

    const listings = await Listing.find(filter).select();
    if (!listings?.length) {
        return res.status(400).json({ message: 'No listings found' });
    }

    res.json(listings);
});

//@desc Get specific Listing by id
//@route GET /listings/:listingId
//@access Private
const getListingByID = asyncHandler(async (req, res) => {
    const listing = await Listing.findOne({ _id: req.params.id }).select().exec()
    if (!listing) {
        return res.status(400).json({ message: 'Listing not found' })
    }
    res.json(listing)
})

//@desc Get specific Listing by UserId
//@route GET /listings
//@access Private
const getListingsByUserID = asyncHandler(async (req, res) => {
    const listings = await Listing.find({ userId: req.params.userId }).exec()
    if (!listings) {
        return res.status(400).json({ message: 'This User has no listings' })
    }
    res.json(listings)
})

//@desc Create new user
//@route POST /listings
//@access Private
const createNewListing = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { userId, title, description, price, images, latitude, longitude } = req.body

    //confirm data
    if (!userId || !title || !description || !price || !images || images.length == 0 || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required!' })
    }

    //Check for duplicates by the same userId
    const duplicate = await Listing.findOne({ title, userId }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: `You already have the same listing: ${title}!` })
    }
    const listingObject = {
        userId, title, description, price, images,
        location: {
            type: 'Point',
            coordinates: [latitude, longitude]
        }
    }

    const listing = await Listing.create(listingObject)

    if (listing) {
        res.status(201).json({ message: `New Listing ${title} created!` })
    } else { res.status(400).json({ message: 'Invalid listing data received' }) }
})

//@desc Update Listing
//@route PUT /listings
//@access Private
const updateListing = asyncHandler(async (req, res) => {
    const id = req.params.id
    const { userId, title, description, price, images, latitude, longitude } = req.body
    console.log(req.body)
    if (!userId || !title || !description || !price || !images || images.length == 0 || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required!' })
    }

    const listing = await Listing.findById(id).exec()

    if (!listing) {
        return res.status(400).json({ message: 'Listing not found' })
    }

    /*     //Check for duplicates by the same user.. need to check for same pictures aswell
        const duplicate = await Listing.findOne({ title, user, price }).lean().exec()
        //Allow updates to the original user
        if (duplicate) {
            return res.status(409).json({ message: `You already have a listing for ${title}!` })
        } */

    listing.user = userId
    listing.title = title
    listing.description = description
    listing.price = price
    listing.images = images
    listing.location.coordinates[0] = latitude
    listing.location.coordinates[1] = longitude

    const updatedListing = await listing.save()
    res.json({ message: `${updatedListing.title} by ${updatedListing.user} updated!` })


})

//@desc Delete Listing
//@route DELETE /listings
//@access Private
const deleteListing = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Listing ID Required!' })
    }

    const listing = await Listing.findById(id).exec()
    if (!listing) {
        return res.status(400).json({ message: 'Listing not found' })
    }
    const result = await listing.deleteOne()
    const reply = `Listing "${result.title}" with ID ${result._id} deleted successfully!`

    res.json(reply)
})

module.exports = {
    getAllListings,
    getListingByID,
    getListingsByUserID,
    createNewListing,
    updateListing,
    deleteListing
}