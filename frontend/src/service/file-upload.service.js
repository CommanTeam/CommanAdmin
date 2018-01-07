import * as axios from 'axios'

function upload (formData) {
  const url = `/register_course`
  return axios.post(url, formData)
    .then(res => {})
}

export { upload }
