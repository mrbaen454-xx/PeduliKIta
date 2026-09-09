const prisma = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getDashboard = async (req, res) => {
  try {
    const campaignerId = req.user.id;
    const campaigns = await prisma.campaign.findMany({
      where: { campaigner_id: campaignerId },
      include: {
        donations: {
          where: { status: 'VERIFIED' }
        }
      }
    });

    let totalCollected = 0;
    let totalDonors = 0;

    campaigns.forEach(c => {
      totalCollected += c.collected_amount;
      totalDonors += c.donations.length;
    });

    const data = {
      campaigns: {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'ACTIVE').length,
        completed: campaigns.filter(c => c.status === 'COMPLETED').length,
        pending: campaigns.filter(c => c.status === 'PENDING').length
      },
      totalCollected,
      totalDonors
    };

    return successResponse(res, 'Berhasil mengambil data dashboard campaigner', data);
  } catch (error) {
    return errorResponse(res, 'Server error', null, 500);
  }
};

module.exports = { getDashboard };
