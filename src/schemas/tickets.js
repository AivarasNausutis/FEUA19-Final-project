import Joi from "joi";

export default Joi.object({
  title: Joi.string().required(),
  ticket_price: Joi.number().required(),
  from_location: Joi.string().required(),
  to_location: Joi.string().required(),
  to_location_photo_url: Joi.string().required(),
  userId: Joi.string().required(),
});
