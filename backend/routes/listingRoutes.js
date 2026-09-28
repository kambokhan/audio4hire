const express = require('express')
const router = express.Router()
const listingsController = require('../controllers/listingsController')
/* const verifyJWT = require('../middleware/verifyJWT') */

/* router.use(verifyJWT) */

router.route('')
    .get(listingsController.getAllListings)
    .post(listingsController.createNewListing)

router.route(':userId')
    .get(listingsController.getListingsByUserID)

router.route('/:id')
    .get(listingsController.getListingByID)
    .put(listingsController.updateListing)
    .delete(listingsController.deleteListing)

module.exports = router