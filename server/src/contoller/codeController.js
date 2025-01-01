const asyncHandler = require("express-async-handler");
const CodeFile = require("../model/CodeFile");
const User = require("../model/User");

// Create code files without content
const createCodeFile = asyncHandler(async (req, res) => {
    const { FileName, language } = req.body;
    const UserId = req.user.id;

    if (!FileName || !language) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const codeFile = await CodeFile.create({
        FileName,
        language,
        UserId,
        Access: [UserId],
    });

    res.status(201).json(codeFile);
});

// Update code file 
const updateCodeFile = asyncHandler(async (req, res) => {
    const codeFile = await CodeFile.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!codeFile) {
        return res.status(404).json({ message: "Code file not found" });
    }

    res.status(202).json(codeFile);
});

// Save the content in the codeFile
const saveContent = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: "No content to save" });
    }

    const codeFile = await CodeFile.findById(req.params.id).lean();
    if (!codeFile.Access.toString().includes(req.user.id)) {
        return res.status(401).json({ message: "You are not authorized to make changes" });
    }

    const updatedCodeFile = await CodeFile.findByIdAndUpdate(req.params.id, { content }, { new: true });
    res.status(201).json(updatedCodeFile);
});

// Give access to others of codeFile
const giveAccess = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const codeFile = await CodeFile.findByIdAndUpdate(req.params.id, { $addToSet: { Access: user._id } }, { new: true });

    if (!codeFile) {
        return res.status(404).json({ message: "No Code file found" });
    }

    res.status(200).json(codeFile);
});

// Remove the access from the code file 
const removeAccess = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const codeFile = await CodeFile.findById(req.params.id);
    
    console.log(codeFile)
    if (codeFile.UserId.toString() !== req.user.id) {
        return res.status(401).json({ message: "Only creator can remove access" });
    }

    await CodeFile.findByIdAndUpdate(req.params.id, { $pull: { Access: user._id } }, { new: true });

    res.status(200).json({ message: "Access removed successfully" });
});

// Get the code files of the user 
const getCodeFiles = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const codeFiles = await CodeFile.find({ Access: userId }).lean();

    if (codeFiles.length === 0) {
        return res.status(204).json({ message: "No code file present" });
    }

    res.status(200).json(codeFiles);
});

// Get the particular code file
const getCodeFile = asyncHandler(async (req, res) => {
    const codeFile = await CodeFile.findById(req.params.id).lean();

    if (!codeFile) {
        return res.status(404).json({ message: "Code file not found" });
    }

    const users = await User.find({ _id: { $in: codeFile.Access } }, 'email').lean();
    const emails = users.map(user => user.email);

    res.status(200).json({ ...codeFile, Access: emails }); // Replace Access with emails
});

// Deleting a code file 
const deleteCodeFile = asyncHandler(async (req, res) => {
    const codeFile = await CodeFile.findById(req.params.id);

    if (!codeFile) {
        return res.status(404).json({ message: "File not found" });
    }

    await CodeFile.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Code file deleted" });
});

module.exports = {
    createCodeFile,
    saveContent,
    giveAccess,
    getCodeFiles,
    getCodeFile,
    deleteCodeFile,
    removeAccess,
    updateCodeFile
};
