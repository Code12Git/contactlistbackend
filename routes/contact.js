const router = require("express").Router();
const Schema = require("mongoose");
let authenticate = require("../middleware/authenticate");
const Contact = require("../model/contact");
const { body, validationResult } = require("express-validator");

router.get("/fetchAll", authenticate, async (req, res) => {
  try {
    const contact = await Contact.find({ user: req.user._id });
    return res.json(contact);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error occured");
  }
});

router.post(
  "/create",
  authenticate,
  [
    body("name", "Enter a valid name"),
    body("phone", "Phone Number should not be blank"),
    body("address", "Address Should not be blank").isLength({ min: 10 }),
    body("email", "Email should be valid"),
  ],
  async (req, res) => {
    try {
      const { name, address, phone, email } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const contact = new Contact({
        name,
        address,
        phone,
        email,
        user: req.user._id,
      });
      const savedContact = await contact.save();
      res.json(savedContact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(" Error occured");
    }
  }
);

router.put("/:contact", authenticate, async (req, res) => {
  const { name, address, phone, email } = req.body;
  try {
    const newContact = {};
    if (name) {
      newContact.name = name;
    }
    if (address) {
      newContact.address = address;
    }
    if (phone) {
      newContact.phone = phone;
    }

    if (email) {
      newContact.email = email;
    }
    let contact = await Contact.findById(req.params.contact);
    if (!contact) {
      return res.status(404).send("Not Found");
    }
    console.log({ contact: contact, user: req.user });
    if (String(contact.user) !== String(req.user._id)) {
      return res.status(401).send("Not Allowed");
    }
    contact = await Contact.findByIdAndUpdate(
      req.params.contact,
      { $set: newContact },
      { new: true }
    );
    res.json({ contact });
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete("/:contact", authenticate, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.contact);
    if (!contact) {
      return res.status(404).send("Not Found!");
    }
    if (String(contact.user) !== String(req.user._id)) {
      return res.status(404).send("Not Allowed");
    }
    contact = await Contact.findByIdAndDelete(req.params.contact);
    res.json({ success: "Contact deleted" });
  } catch (error) {
    res.sendStatus(500).json({ Server: "Internal Server Error" });
  }
});
module.exports = router;
