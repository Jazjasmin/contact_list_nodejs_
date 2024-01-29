const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route Get /api/contacts
//@access Private
const getContacts = asyncHandler(async (req,res) => {
    const contacts = await Contact.find({user_id:req.user.id});
    //res.status(200).json({message:"Get all contact"});
    res.status(200).json(contacts);
});

//@desc Create new contact
//@route Post /api/contacts
//@access Private
const createContact = asyncHandler(async (req,res) => {
    console.log("request body:", req.body);
    const { name, email, phone } = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = Contact.create({
       name,
       email,
       phone, 
    });
    res.status(201).json(contact);
});

//@desc Get contacts
//@route Get /api/contacts/:id
//@access Private
const getContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
    //res.status(200).json({message: `Get Contact for ${req.params.id}`})
});

//@desc Update  contacts
//@route Put /api/contacts/:id
//@access Private
const updateContact = asyncHandler(async (req,res) => {
    console.log("request body:", req.body);

    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User Don't have permission to update other user contacts")
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updateContact);
    //res.status(200).json({message: `Update Contact ${req.params.id}`})
});

//@desc Delete  contacts
//@route Put /api/contacts/:id
//@access Private
const deleteContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User Don't have permission to update other user contacts")
    }
    await Contact.deleteOne({ _id: req.params.id});
    res.status(200).json(contact);
    //res.status(200).json({message: `Delete Contact ${req.params.id}`})
});

module.exports = { 
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact 
}; 

