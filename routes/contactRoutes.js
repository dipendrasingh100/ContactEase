const { getContacts, createContact, updateContact, deleteContact, getSingleContact } = require("../controllers/contactController")
const validateToken = require("../middleware/validateTokenHandler")

const router = require("express").Router()

router.use(validateToken)
router.get("/", getContacts)

router.post("/", createContact)

router.get("/:id", getSingleContact)

router.put("/:id", updateContact)

router.delete("/:id", deleteContact)

module.exports = router