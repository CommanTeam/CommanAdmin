import * as axios from 'axios'

function upload (formData, url) {
  return axios.post(url, formData)
    .then(res => {})
}

export { upload }
