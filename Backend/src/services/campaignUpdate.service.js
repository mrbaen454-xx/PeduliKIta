const prisma = require('../config/database');

const createUpdate = async (campaignId, campaignerId, data, imageUrl) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: Number(campaignId) } });
  if (!campaign || campaign.campaigner_id !== campaignerId) {
    throw new Error('Campaign tidak ditemukan atau bukan milik anda');
  }
  if (['COMPLETED', 'CLOSED'].includes(campaign.status)) {
    throw new Error('Tidak bisa menambah update pada campaign yang sudah selesai atau ditutup');
  }

  return prisma.campaignUpdate.create({
    data: {
      campaign_id: Number(campaignId),
      title: data.title,
      content: data.content,
      image_url: imageUrl
    }
  });
};

const getUpdatesByCampaign = async (campaignId) => {
  return prisma.campaignUpdate.findMany({
    where: { campaign_id: Number(campaignId) },
    orderBy: { created_at: 'desc' }
  });
};

const updateCampaignUpdate = async (id, campaignerId, data, imageUrl) => {
  const update = await prisma.campaignUpdate.findUnique({
    where: { id: Number(id) },
    include: { campaign: true }
  });

  if (!update || update.campaign.campaigner_id !== campaignerId) {
    throw new Error('Update tidak ditemukan atau bukan milik anda');
  }

  const updateData = {
    title: data.title || update.title,
    content: data.content || update.content,
  };
  if (imageUrl) updateData.image_url = imageUrl;

  return prisma.campaignUpdate.update({
    where: { id: Number(id) },
    data: updateData
  });
};

const deleteCampaignUpdate = async (id, campaignerId) => {
  const update = await prisma.campaignUpdate.findUnique({
    where: { id: Number(id) },
    include: { campaign: true }
  });

  if (!update || update.campaign.campaigner_id !== campaignerId) {
    throw new Error('Update tidak ditemukan atau bukan milik anda');
  }

  return prisma.campaignUpdate.delete({ where: { id: Number(id) } });
};

module.exports = { createUpdate, getUpdatesByCampaign, updateCampaignUpdate, deleteCampaignUpdate };
