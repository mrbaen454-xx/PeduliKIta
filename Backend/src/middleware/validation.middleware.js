const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message
    }));
    console.error('[Joi Validation Error]:', JSON.stringify(errors, null, 2));
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  next();
};

module.exports = validate;
