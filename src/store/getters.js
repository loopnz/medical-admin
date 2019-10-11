const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  expiration:state => state.user.expiration,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  flagPermission: state => state.flagPermission,
  addRouters: state => state.permission.addRouters,
  userID:state =>state.user.userID,
  gName:state =>state.user.gName,
  gId:state =>state.user.gId
  // userID:state => {
  //   if(state.user.user){
  //     return state.user.user.id;
  //   }
  //   return '';
  // }
}
export default getters
