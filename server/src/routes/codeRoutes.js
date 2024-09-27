const express = require("express");
const router = express.Router();
const {createCodeFile, saveContent, giveAccess, getCodeFiles, getCodeFile, deleteCodeFile,removeAccess, updateCodeFile} = require('../contoller/codeController')

router.post("/create", createCodeFile)
router.put("/save/:id", saveContent)
router.put("/give/:id", giveAccess)
router.put('/take/:id', removeAccess)
router.get("/",getCodeFiles)
router.route("/:id").get(getCodeFile).delete(deleteCodeFile).put(updateCodeFile)

module.exports = router;