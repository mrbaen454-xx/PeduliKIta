const documentService = require('../services/document.service');
const { successResponse, errorResponse } = require('../utils/response');

const upload = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'File dokumen wajib diunggah', null, 400);
    }
    const fileName = req.file.originalname;
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;

    const document = await documentService.uploadDocument(req.params.campaignId, req.user.id, fileName, fileUrl, fileType);
    return successResponse(res, 'Berhasil mengunggah dokumen', document, 201);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const getByCampaign = async (req, res) => {
  try {
    const documents = await documentService.getDocumentsByCampaign(req.params.campaignId);
    return successResponse(res, 'Berhasil mengambil daftar dokumen', documents);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const remove = async (req, res) => {
  try {
    await documentService.deleteDocument(req.params.id, req.user.id);
    return successResponse(res, 'Berhasil menghapus dokumen');
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

module.exports = { upload, getByCampaign, remove };
