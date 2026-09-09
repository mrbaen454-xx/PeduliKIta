const prisma = require('../config/database');

const uploadDocument = async (campaignId, campaignerId, fileName, fileUrl, fileType) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: Number(campaignId) } });
  if (!campaign || campaign.campaigner_id !== campaignerId) {
    throw new Error('Campaign tidak ditemukan atau bukan milik anda');
  }

  return prisma.campaignDocument.create({
    data: {
      campaign_id: Number(campaignId),
      file_name: fileName,
      file_url: fileUrl,
      file_type: fileType
    }
  });
};

const getDocumentsByCampaign = async (campaignId) => {
  return prisma.campaignDocument.findMany({
    where: { campaign_id: Number(campaignId) },
    orderBy: { created_at: 'desc' }
  });
};

const deleteDocument = async (id, campaignerId) => {
  const document = await prisma.campaignDocument.findUnique({
    where: { id: Number(id) },
    include: { campaign: true }
  });

  if (!document || document.campaign.campaigner_id !== campaignerId) {
    throw new Error('Dokumen tidak ditemukan atau bukan milik anda');
  }

  return prisma.campaignDocument.delete({ where: { id: Number(id) } });
};

module.exports = { uploadDocument, getDocumentsByCampaign, deleteDocument };
