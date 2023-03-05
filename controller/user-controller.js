const BASE_URL = process.env.BASE_URL;

// Create a new contact
app.post("/api/contact", function (req, res) {
  const contact = new Contact(req.body);

  contact.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error occurred while creating a new contact");
    } else {
      res.status(200).send("Contact created successfully");
    }
  });
});

// Update an existing contact
app.put("/api/contact/:id", function (req, res) {
  Contact.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error occurred while updating the contact");
    } else {
      res.status(200).send("Contact updated successfully");
    }
  });
});

// Delete an existing contact
app.delete("/api/contact/:id", function (req, res) {
  Contact.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error occurred while deleting the contact");
    } else {
      res.status(200).send("Contact deleted successfully");
    }
  });
});
