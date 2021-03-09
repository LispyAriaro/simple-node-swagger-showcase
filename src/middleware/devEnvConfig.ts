const devEnvironmentVars = () => {
  if(process.env.NODE_ENV === 'development') {
    require('dotenv').config()
  }
}

export default devEnvironmentVars
