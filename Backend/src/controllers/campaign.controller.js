const campaignService = require('../services/campaign.service');
const { successResponse, errorResponse } = require('../utils/response');

const create = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const campaign = await campaignService.createCampaign(req.user.id, req.body, imageUrl);
    return successResponse(res, 'Berhasil membuat campaign', campaign, 201);
  } catch (error) {
    return errorResponse(res, 'Gagal membuat campaign', null, 400);
  }
};

const getAll = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      status: req.query.status,
      sort: req.query.sort
    };
    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };
    
    const result = await campaignService.getAllCampaigns(filters, pagination);
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar campaign',
      ...result
    });
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const getById = async (req, res) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    if (!campaign) return errorResponse(res, 'Campaign tidak ditemukan', null, 404);
    return successResponse(res, 'Berhasil mengambil detail campaign', campaign);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getMyCampaigns(req.user.id);
    return successResponse(res, 'Berhasil mengambil daftar campaign milik anda', campaigns);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const update = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const campaign = await campaignService.updateCampaign(req.params.id, req.user.id, req.body, imageUrl);
    return successResponse(res, 'Berhasil mengupdate campaign', campaign);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const remove = async (req, res) => {
  try {
    await campaignService.deleteCampaign(req.params.id, req.user.id);
    return successResponse(res, 'Berhasil menghapus campaign');
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const close = async (req, res) => {
  try {
    const campaign = await campaignService.closeCampaign(req.params.id, req.user.id);
    return successResponse(res, 'Berhasil menutup campaign', campaign);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

module.exports = { create, getAll, getById, getMyCampaigns, update, remove, close };
