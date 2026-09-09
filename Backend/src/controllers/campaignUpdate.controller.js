const updateService = require('../services/campaignUpdate.service');
const { successResponse, errorResponse } = require('../utils/response');

const create = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const update = await updateService.createUpdate(req.params.campaignId, req.user.id, req.body, imageUrl);
    return successResponse(res, 'Berhasil membuat update campaign', update, 201);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const getByCampaign = async (req, res) => {
  try {
    const updates = await updateService.getUpdatesByCampaign(req.params.campaignId);
    return successResponse(res, 'Berhasil mengambil daftar update', updates);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const update = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await updateService.updateCampaignUpdate(req.params.id, req.user.id, req.body, imageUrl);
    return successResponse(res, 'Berhasil mengubah update', result);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const remove = async (req, res) => {
  try {
    await updateService.deleteCampaignUpdate(req.params.id, req.user.id);
    return successResponse(res, 'Berhasil menghapus update');
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

module.exports = { create, getByCampaign, update, remove };
