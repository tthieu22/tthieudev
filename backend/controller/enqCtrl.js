const Enquiry = require("../models/enqModel")
const asyncHandler = require("express-async-handler")
const { validateMongodbId } = require("../utils/validateMongodbId")
const { sendEmail } = require("./emailCtrl");

const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry)

    } catch (error) {
        throw new Error(error)
    }
})
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const { status, feedback } = req.body;

    try { 
        let updatedEnquiry = await Enquiry.findByIdAndUpdate(
            id,
            { status, feedback },
            { new: true }
        );

        res.json(updatedEnquiry);

        if (updatedEnquiry?.email) {
            await sendEmail({
                to: updatedEnquiry.email,
                subject: "Phản hồi yêu cầu tư vấn",
                text: `Xin chào ${updatedEnquiry.name || "quý khách"},\n\nTrạng thái yêu cầu của bạn: "${status}".\nPhản hồi: ${feedback}\n\nTrân trọng,\nĐội ngũ hỗ trợ.`,
            });
 
            updatedEnquiry = await Enquiry.findByIdAndUpdate(
                id,
                { status: "In Progress" },
                { new: true }
            );
        }

    } catch (error) {
        throw new Error(error);
    }
});

const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json(deleteEnquiry)

    } catch (error) {
        throw new Error(error)
    }
})

const getaEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getaEnquiry = await Enquiry.findById(id);
        res.json(getaEnquiry)

    } catch (error) {
        throw new Error(error)
    }

})
const getAllEnquiry = asyncHandler(async (req, res) => {
    try {
        const getallEnquiry = await Enquiry.find();
        res.json(getallEnquiry)

    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getaEnquiry, getAllEnquiry }