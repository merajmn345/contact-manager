const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contact
// route GET /api/contact
// access private

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

// @desc Create New contact
// route POST /api/contact
// access private

const createContact = asyncHandler(async (req, res) => {
    console.log("the body is : ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fileds are mandatory");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });
    console.log(contact);

    res.status(201).json(contact);
    res.status(201).json({ success: true, message: "New Contact created" });
});

// @desc Get all contact
// route GET /api/contact/:id
// access private

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});
// @desc Update  contact
// route PUT /api/contact/:id
// access private

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updateContact);
});

// @desc Delete  contact
// route Delete /api/contact/:id
// access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }
    await Contact.deleteOne({ _id: req.params.id });
    // console.log(contact);

    res.status(200).json(contact);
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};
