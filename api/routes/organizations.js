const router = require('express').Router()
const responseFormatter = require('./../middleware/responseFormatter')
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')

const scopes = [
  'read:organizations',
  'read:organization_members',
  'read:organization_connections',
  'update:organizations'
]
const management = require('./../models/management')(scopes)

module.exports = router

/**
 * List Organizations
 */
router
  .route('/')
  .get(async (req, res) => {
    let status = 200
    let message = ``
    let data = []
    try {
      const options = {
        per_page: parseInt(req.query.limit) || 50,
        page: parseInt(req.query.page) || 0
      }
      data = await management.organizations.getAll(options)
      message = `Found ${data.length} organizations`
    } catch (error) {
      status = parseInt(error.statusCode) || 500
      message = error.message
      data = error
    }

    const json = responseFormatter(req, res, { status, message, data })
    res.status(status).json(json)
  })

/**
 * Get organization by ID
 */
router
  // .all(verifyJWT)
  .route('/:org_id')
  .get(
    // checkJWTScopes(['read:organizations'], options),
    async (req, res) => {
      const id = req.params.org_id
      let status = 200
      let message = ``
      let data = []
      try {
        data = await management.organizations.getByID({ id })
        message = `Found details for "${data.display_name}".`
      } catch (error) {
        status = parseInt(error.statusCode) || 500
        message = error.message
        data = error
      }
      
      const json = responseFormatter(req, res, { status, message, data })
      res.status(status).json(json)
    }
  )

/**
 * List Organization Members
 */
router
  // .all(verifyJWT)
  .route('/:org_id/members')
  .get(
    // checkJWTScopes(['read:organization_members'], options),
    async (req, res) => {
      const id = req.params.org_id
      let status = 200
      let message = ``
      let data = []
      try {
        data = await management.organizations.getMembers({ id })
        message = `Found ${data.length} members of organization.`
      } catch (error) {
        status = parseInt(error.statusCode) || 500
        message = error.message
        data = error
      }
      
      const json = responseFormatter(req, res, { status, message, data })
      res.status(status).json(json)
    }
  )
