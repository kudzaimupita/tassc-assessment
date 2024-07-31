const allRoles = {
  user: ['getTasks', 'manageTasks'],
  admin: ['getUsers', 'manageUsers', 'getTasks', 'manageTasks'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
