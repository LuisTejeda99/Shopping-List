const makeType = (mod) => (type) => `${mod}/${type}`;

const mac = (type,...argNames) => (...args) => {
    const action = { type };
    argNames.forEach((arg,index) => {
        action[argNames[index]] = args[index];
    })
    return action;
}

const createReducer = (IS, handlers) => (state = IS, action) => {
    if(handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state,action)
    } else {
        return state;
    }
}

function getCurrentDate() {
    let date = new Date()

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      let full = null;
      if(month < 10){
        full = `${day}-0${month}-${year}`;
      }else{
        full = `${day}-${month}-${year}`;
      }
      return full;
  }

export {
    makeType,
    mac,
    createReducer,
    getCurrentDate,
}