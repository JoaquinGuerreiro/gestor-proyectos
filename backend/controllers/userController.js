const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.getUsers = catchAsync(async (req, res) => {
  console.log('Getting users...');
  console.log('Current user ID:', req.user.id);
  
  const users = await User.find({ _id: { $ne: req.user.id } })
    .select('username email')
    .sort({ username: 1 });
    
  console.log('Found users:', users);

  res.status(200).json({
    status: 'success',
    data: users
  });
}); 