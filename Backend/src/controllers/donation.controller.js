const donationService = require('../services/donation.service');
const { successResponse, errorResponse } = require('../utils/response');

const create = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Bukti transfer wajib diunggah', null, 400);
    }
    const proofUrl = `/uploads/${req.file.filename}`;
    const donation = await donationService.createDonation(req.user.id, req.body, proofUrl);
    return successResponse(res, 'Berhasil membuat donasi, menunggu verifikasi', donation, 201);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const getMyDonations = async (req, res) => {
  try {
    const donations = await donationService.getMyDonations(req.user.id);
    return successResponse(res, 'Berhasil mengambil riwayat donasi', donations);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const getById = async (req, res) => {
  try {
    const donation = await donationService.getDonationById(req.params.id, req.user.id);
    return successResponse(res, 'Berhasil mengambil detail donasi', donation);
  } catch (error) {
    return errorResponse(res, error.message, null, 404);
  }
};

const getCampaignDonations = async (req, res) => {
  try {
    const donations = await donationService.getCampaignDonations(req.params.campaignId);
    return successResponse(res, 'Berhasil mengambil donatur', donations);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

module.exports = { create, getMyDonations, getById, getCampaignDonations };
