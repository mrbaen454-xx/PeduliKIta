const prisma = require('../config/database');
const campaignService = require('../services/campaign.service');
const donationService = require('../services/donation.service');
const { successResponse, errorResponse } = require('../utils/response');

const getDashboard = async (req, res) => {
  try {
    const [
      users, campaigns, donations, totalCollected
    ] = await Promise.all([
      prisma.user.findMany({ select: { role: true } }),
      prisma.campaign.findMany({ select: { status: true } }),
      prisma.donation.findMany({ select: { status: true } }),
      prisma.campaign.aggregate({ _sum: { collected_amount: true }, where: { status: 'COMPLETED' } })
    ]);

    const data = {
      users: {
        total: users.length,
        campaigners: users.filter(u => u.role === 'CAMPAIGNER').length,
        donors: users.filter(u => u.role === 'DONOR').length,
        admins: users.filter(u => u.role === 'ADMIN').length
      },
      campaigns: {
        total: campaigns.length,
        pending: campaigns.filter(c => c.status === 'PENDING').length,
        active: campaigns.filter(c => c.status === 'ACTIVE').length,
        completed: campaigns.filter(c => c.status === 'COMPLETED').length,
        rejected: campaigns.filter(c => c.status === 'REJECTED').length
      },
      donations: {
        total: donations.length,
        pending: donations.filter(d => d.status === 'PENDING').length,
        verified: donations.filter(d => d.status === 'VERIFIED').length,
        rejected: donations.filter(d => d.status === 'REJECTED').length
      },
      totalCollected: totalCollected._sum.collected_amount || 0
    };

    return successResponse(res, 'Berhasil mengambil data dashboard admin', data);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: 'PENDING' },
      include: { category: true, campaigner: { select: { name: true } } }
    });
    return successResponse(res, 'Berhasil mengambil campaign pending', campaigns);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const approveCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.verifyCampaign(req.params.id, 'APPROVED');
    return successResponse(res, 'Campaign disetujui', campaign);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const rejectCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.verifyCampaign(req.params.id, 'REJECTED', req.body.rejectionReason);
    return successResponse(res, 'Campaign ditolak', campaign);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const getPendingDonations = async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { status: 'PENDING' },
      include: { campaign: { select: { title: true } }, donor: { select: { name: true } } }
    });
    return successResponse(res, 'Berhasil mengambil donasi pending', donations);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

const verifyDonationAction = async (req, res) => {
  try {
    const donation = await donationService.verifyDonation(req.params.id, 'VERIFIED');
    return successResponse(res, 'Donasi diverifikasi', donation);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

const rejectDonationAction = async (req, res) => {
  try {
    const donation = await donationService.verifyDonation(req.params.id, 'REJECTED');
    return successResponse(res, 'Donasi ditolak', donation);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

module.exports = {
  getDashboard,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  getPendingDonations,
  verifyDonationAction,
  rejectDonationAction
};
