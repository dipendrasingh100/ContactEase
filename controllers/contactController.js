//whenever any exception occured in async function it will pass the exception to the errorHandler
const asyncHandler = require("express-async-handler")
const contactModel = require("../models/contactModel")

//@desc Get all contacts
//@route GET /api/contacts  
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await contactModel.find({ user_id: req.user.id })
    res.status(200).json(contacts)
})

//@desc Get a contact
//@route GET /api/contacts/:id  
//@access private
const getSingleContact = asyncHandler(async (req, res) => {
    const { id } = req.params 
    const contact = await contactModel.findById(id)

    if (!contact || req.user.id !== contact.user_id.toString()) {
        res.status(404)
        throw new Error("Contact Not Found!")
    }
    res.status(200).json(contact)
})

//@desc create contact
//@route POST /api/contacts  
//@access private
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body
    if (!name || !email || !phone) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }
    const contact = await contactModel.create({
        user_id: req.user.id, name, email, phone
    })
    res.status(201).json(contact)
})


//@desc Update contact
//@route PUT /api/contacts/:id 
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const { id } = req.params
    const contact = await contactModel.findById(id)
    if (!contact || req.user.id !== contact.user_id.toString()) {
        res.status(404)
        throw new Error("Contact Not Found!")
    }
    const data = req.body
    const updatedContact = await contactModel.findByIdAndUpdate(id, data, { new: true })
    res.status(202).json(updatedContact)
})

//@desc delete contact
//@route DELETE /api/contacts/:id  
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params
    const contact = await contactModel.findById(id)
    if (!contact || req.user.id !== contact.user_id.toString()) {
        res.status(404)
        throw new Error("Contact Not Found!")
    }
    await contactModel.findByIdAndDelete(id)
    res.status(410).json(contact)
})

module.exports = { getContacts, createContact, updateContact, deleteContact, getSingleContact }