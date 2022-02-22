const Sequelize = require('sequelize');
const { Class, User, Regis } = require('./../models');
const AppError = require('./../utils/appError');
const helperFn = require('./../utils/helperFn');
const Op = Sequelize.Op;

//  for user and admin

const registerClass = async (req, res, next) => {
  try {
    const { class_id } = req.body;
    const user_id = req.user.id;
    const currentClass = await Class.findOne({ where: { id: class_id } });
    if (!currentClass || currentClass.status === 'close') {
      return next(
        new AppError(
          'The class not available or not open at this time , try again later',
          404
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

const getAllClass = async (req, res, next) => {
  try {
    const allClass = await Class.findAll();
    res.send(allClass);
  } catch (err) {
    // console.log(err);s
    next(err);
  }
};

const getMyRegisClass = async (req, res, next) => {
  //127.0.0.1:5000/api/classes/myRegisteredClass?status=pending,active,cancel
  try {
    const defaultFilter = ['pending', 'active', 'cancel'];
    let userFilter = req.query.status?.split(',');
    if (!userFilter) {
      userFilter = defaultFilter;
    }
    const user_id = req.user.id;
    const myClass = await Regis.findAll({
      where: {
        user_id: user_id,
        status: {
          [Op.in]: userFilter,
        },
      },
      include: {
        model: Class,
      },
    });

    res.status(200).json({
      status: 'success',
      data: myClass,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getCalendarClass = async (req, res, next) => {
  try {
    const class_id = req.params.id;
    const currentCLass = await Class.findOne({
      where: { id: class_id },
      attributes: ['subject', 'start_date', 'end_date'],
    });
    if (!currentCLass) {
      return next(new AppError('this class does not exist', 404));
    }
    res.send(currentCLass);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//FOR admin only

const createClass = async (req, res, next) => {
  //date mm-dd-yyyy
  try {
    const { subject, max_student, start_date, end_date } = req.body;
    const newClass = await Class.create({
      subject,
      max_student,
      start_date,
      end_date,
    });
    res.status(200).json({
      status: 'success',
      data: newClass,
    });
  } catch (err) {
    next(err);
  }
};

const updateClass = async (req, res, next) => {
  // not finish yet
  try {
    const class_id = req.params.id;
    const currentClass = await Class.findOne({ where: { id: class_id } });
    if (!currentClass) {
      return next(new AppError('No Class found with this id', 404));
    }
    Object.keys(req.body).map((el) => {
      currentClass[el] = req.body[el];
    });
    currentClass.save();
    res.send(currentClass);
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const class_id = req.params.id;
    const currentClass = await Class.findOne({ where: { id: class_id } });
    if (!currentClass) {
      return next(new AppError('No Class found with this id', 404));
    }
    await currentClass.destroy();
    res.send('delete class successfully');
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

module.exports = {
  registerClass: registerClass,
  cancelRegisClass: cancelRegisClass,
  getAllClass: getAllClass,
  getMyRegisClass: getMyRegisClass,
  getCalendarClass: getCalendarClass,
  createClass: createClass,
  updateClass: updateClass,
  deleteClass: deleteClass,
};
