const { Class, User, Regis } = require('./../models');
const AppError = require('./../utils/appError');

const registerClass = async (req, res, next) => {
  try {
    const { class_id } = req.body;
    const user_id = req.user.id;
    const currentClass = await Class.findOne({ where: { id: class_id } });
    if (!currentClass || currentClass.status === 'close') {
      next(
        new AppError('The class not open at this time , try again later', 401)
      );
    }

    const currentRegis = await Regis.create({ class_id, user_id });
    // const user = await User.findAll({
    //   include: [Class],
    // });

    res.send(currentRegis);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  registerClass: registerClass,
};
