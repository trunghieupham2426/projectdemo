const { Class, User, Regis } = require('./../models');
const AppError = require('./../utils/appError');
const helperFn = require('./../utils/helperFn');

const registerClass = async (req, res, next) => {
  try {
    const { class_id } = req.body;
    if (!class_id) {
      return next(new AppError('missing classId', 401));
    }
    const user_id = req.user.id;
    const currentClass = await Class.findOne({ where: { id: class_id } });
    if (!currentClass || currentClass.status === 'close') {
      return next(
        new AppError(
          'The class not available or not open at this time , try again later',
          401
        )
      );
    }
    const currentUser = JSON.stringify(
      await User.findOne({
        where: { id: user_id },
        include: [Class],
      }),
      null,
      2
    );

    const listClassIdOfUser = JSON.parse(currentUser).Classes.map((el) => {
      return el.id;
    });

    if (listClassIdOfUser.includes(+class_id)) {
      return next(new AppError('you  already register this class', 401));
    }
    await Regis.create({ class_id, user_id });

    helperFn.sendEmail(
      req.user.email,
      'THANK YOU FOR REGISTER CLASS',
      'your register class is pending , we will contact you later'
    );
    res.status(200).json({
      status: 'success',
      message: 'please check your email for more information',
    });
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

const cancelRegisClass = async (req, res, next) => {
  try {
    const { class_id } = req.body;
    if (!class_id) {
      return next(new AppError('missing classId', 401));
    }
    const cancelClass = await Regis.findOne({
      where: { class_id: class_id, status: 'pending' },
    });
    if (!cancelClass) {
      return next(new AppError(`can not cancel this class`, 401));
    }
    cancelClass.status = 'cancel';
    cancelClass.save();
    res.status(200).json({
      status: 'success',
      message: 'cancel successfully',
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  registerClass: registerClass,
  cancelRegisClass: cancelRegisClass,
};
